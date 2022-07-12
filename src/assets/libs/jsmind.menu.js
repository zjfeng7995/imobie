/*
 * Released under BSD License
 * Copyright (c) 2019-2020 Allen_sun_js@hotmail.com
 *
 * Project Home:
 *  https://github.com/allensunjian
 */

(function ($w, temp) {
    var Jm = $w[temp]

    var name = 'menu'

    var colors = ['#3bba54', '#ffad4d', '#2c67ff', '#ff6056', '#000000', '#ffffff', '#e6e6e6', '#e2c6ac', '#c6cfee', '#dac9ff'];

    var $d = $w['document']

    var menuEvent = 'oncontextmenu'

    var clickEvent = 'onclick'

    var overEvent = 'mouseover'

    var $c = function (tag) { return $d.createElement(tag) }

    var _noop = function () { }

    var logger = (typeof console === 'undefined') ? {

        log: _noop, debug: _noop, error: _noop, warn: _noop, info: _noop

    } : console

    var $t = function (n, t) { if (n.hasChildNodes()) { n.firstChild.nodeValue = t } else { n.appendChild($d.createTextNode(t)) } }

    var $h = function (n, t) {
        if (t instanceof HTMLElement) {
            t.innerHTML = ''
            n.appendChild(t)
        } else {
            n.innerHTML = t
        }
    }

    if (!Jm || Jm[name]) return

    Jm.menu = function (_jm) {
        this._get_menu_options(_jm, function () {
            this.init(_jm)

            this._mount_events()
        })
    }
    Jm.menu.prototype = {

        defaultDataMap: {
            funcMap: {
                edit: {
                    isDepNode: true,
                    // defaultFn不受到中台变量的控制，始终会先于fn去执行
                    defaultFn: function (node) {
                        var f = this._menu_default_mind_methods._menu_begin_edit.call(this.jm)
                        f && this._menu_default_mind_methods._menu_edit_node_begin(this.jm.view, node)
                    },
                    fn: _noop,
                    text: 'edit node'
                },
                addChild: {
                    isDepNode: true,
                    fn: function (nodeid, text) {
                        var selected_node = this.get_selected_node()
                        if (selected_node) {
                            var node = this.add_node(selected_node, nodeid, text)
                            if (node) {
                                this.select_node(nodeid)
                                this.begin_edit(nodeid)
                            }
                        }
                    },
                    text: 'append child'
                },
                addBrother: {
                    isDepNode: true,
                    fn: function (nodeid, text) {
                        var selected_node = this.get_selected_node()
                        if (!!selected_node && !selected_node.isroot) {
                            var node = this.insert_node_after(selected_node, nodeid, text)
                            if (node) {
                                this.select_node(nodeid)
                                this.begin_edit(nodeid)
                            }
                        }
                    },
                    text: 'append brother'
                },
                delete: {
                    isDepNode: true,
                    fn: function () {
                        this.shortcut.handle_delnode.call(this.shortcut, this)
                    },
                    text: 'delete node'
                },
                showAll: {
                    sDepNode: false,
                    fn: function () {
                        this.expand_all(this)
                    },
                    text: 'show all'
                },
                setBgColor: {
                    isDepNode: false,
                    fn: function () {
                        // this.handler_paint(this)
                    },
                    text: 'paint node'
                },
                hideAll: {
                    isDepNode: false,
                    fn: function () {
                        console.log(this);
                        this.collapse_all(this)
                    },
                    text: 'hide all'
                },
                screenshot: {
                    isDepNode: false,
                    fn: function () {
                        if (!this.screenshot) {
                            logger.error('[jsmind] screenshot dependent on jsmind.screenshot.js !')
                            return
                        }
                        this.screenshot.shootDownload()
                    },
                    text: 'load mind picture'
                },
                showNode: {
                    isDepNode: true,
                    fn: function (node) {
                        this.expand_node(node)
                    },
                    text: 'show target node'
                },
                hideNode: {
                    isDepNode: true,
                    fn: function (node) {
                        this.collapse_node(node)
                    },
                    text: 'hide target node'
                }
            },
            menuStl: {
                'padding': '11px 10px 11px 20px',
                'position': 'fixed',
                'z-index': '10',
                'background': '#fff',
                'box-shadow': '0 2px 12px 0 rgba(0,0,0,0.1)',
                'border-radius': '5px',
                'font-size': '12px',
                'transform': 'translateX(-50%)',
                'display': 'none'
            },
            menuItemStl: {
                padding: '8px 10px',
                cursor: 'pointer',
                display: 'flex',
                'border-radius': '4px',
                'justify-content': 'center',
                'align-items': 'center',
                transition: 'all .2s'
            },
            injectionList: ['edit', 'addChild', 'delete']
        },

        init: function (_jm) {
            this._create_menu(_jm)
            this._get_injectionList(_jm)
            this.menuOpts.switchMidStage && Jm.util.dom.add_event(_jm.view.e_editor, 'blur', function (e) {
                this._menu_default_mind_methods._menu_edit_node_end.call(_jm.view)
                if (typeof this.menuOpts.editCaller === 'function') {
                    this.menuOpts.editCaller($w.menu._update_node_info, this._menu_default_mind_methods._menu_update_edit_node)
                    return
                }
                this._menu_default_mind_methods._menu_update_edit_node()
            }.bind(this))
        },

        _event_contextMenu(e) {
            return;
            e.preventDefault()
            this.menu.style.left = e.clientX + 'px'
            this.menu.style.top = e.clientY + 'px'
            this.menu.style.display = 'flex'
            this.selected_node = this.jm.get_selected_node()
        },

        _event_hideMenu(e) {
            e.preventDefault()
            if (e.target.nodeName == 'JMNODE') {
                this.selected_node = this.jm.get_selected_node();
                // 设置菜单隐藏项
                document.querySelector('.color_picker_container').style.display = 'none';
                // 设置菜单颜色
                let nodeData = this.jm.get_selected_node().data;
                this.setMenuColor(nodeData?.bgColor ?? '#ffffff')
                // 设置选中节点颜色
                if (nodeData['background-color']){
                    this.jm.set_node_color(this.selected_node.id, nodeData['background-color'], nodeData['foreground-color'] ?? '#fff')
                } 
                // 设置根节点菜单
                const isRoot = e.target.className.includes('root');
                this.setMenuItemShow(isRoot)
                // 设置菜单定位位置
                const nodePosition = e.target.getBoundingClientRect();
                this.menu.style.left = nodePosition.x + 150 + 'px'
                this.menu.style.top = nodePosition.y - 67 + 'px'
                this.menu.style.display = 'flex'
            } else {
                this.menu.style.display = 'none'
            }
        },
        setMenuItemShow(isRoot) {
            this.menu.childNodes.forEach(item => {
                let menutype = item.getAttribute('data-type');
                let hide = isRoot && ['addBrother', 'delete'].includes(menutype);
                item.style.display = hide ? 'none' : 'flex';
            });
        },
        setMenuColor(colorPick) {
            this.menu.childNodes.forEach(item => {
                let menuSpan = item.firstChild.firstChild;
                if (menuSpan.className.includes('setBgColor')) {
                    menuSpan.style.background = colorPick;
                    menuSpan.style.border = `1px solid ${colorPick == '#ffffff' ? '#e6e6e6' : colorPick}`;
                }
            });
        },
        _mount_events() {
            $w[menuEvent] = this._event_contextMenu.bind(this)
            $w[clickEvent] = this._event_hideMenu.bind(this)
        },

        _create_menu(_jm) {
            var d = $c('menu')
            this._set_menu_wrap_syl(d)
            this.menu = d
            this.e_panel = _jm.view.e_panel
            this.e_panel.appendChild(d)
            document.querySelector('.jsmind-inner').onscroll = () => {
                this.menu.style.display = 'none';
            };
        },
        getIconStyle(config) {
            return config.target !== 'setBgColor' ? `
                width: 20px;
                height: 20px;
                background: url(${config.icon}) center center;
            ` : `
                width: 16px;
                height: 16px;
                border-radius: 50%;
            `
        },
        buildColorSelect(container) {
            let selectedNode = this.selected_node;
            let colorPicked = selectedNode?.data?.bgColor ?? '#ffffff';
            var Div = $c('div');
            Div.className = 'color_picker_container'
            Div.style.cssText = `
                position: absolute; 
                left: 70px;
                height: 58px;
                padding: 10px;
                z-index: 10;
                display: none;
                grid-template-columns: repeat(5,16px);
                grid-auto-rows: 16px;
                gap: 10px;
                background: #fff;
                box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
                border-radius: 5px;`
            Div.onclick = (e) => {
                e.stopPropagation();
            }
            colors.forEach(color => {
                let P = $c('p');
                P.setAttribute('data-color', color)
                P.style.cssText = `
                    background: ${color};
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 1px solid ${color == '#ffffff' ? '#e6e6e6' : color}
                `
                let checked = $c('i')
                checked.className = 'el-icon-check'
                checked.style.cssText = `
                    color: ${color == '#ffffff' ? '#000' : '#fff'};
                    font-size: 10px;
                    transform: scale(0.9);
                    display: ${color === colorPicked ? 'block' : 'none'};
                    transform-origin: center;
                `
                P.appendChild(checked)
                Div.appendChild(P);
            })
            container.appendChild(Div);
        },
        // 显示颜色拾取器
        colorSelectShow(container, cb) {
            let selectedNode = this.selected_node;
            this.setColorPicked(container, selectedNode?.data?.bgColor);
            setTimeout(() => {
                let colorPickBox = container.querySelector('.color_picker_container');
                colorPickBox.style.display = colorPickBox.style.display == 'none' ? 'grid' : 'none';
                
            });
            let pickes = container.querySelectorAll('p');
            pickes.forEach(pickItem => {
                pickItem.onclick = (e) => {
                    e.stopPropagation();
                    let colorPick = pickItem.getAttribute('data-color');
                    selectedNode.data = { bgColor: colorPick }

                    this.setMenuColor(colorPick);
                    this.jm.set_node_color(selectedNode.id, colorPick, colorPick === '#ffffff' ? '#333' : '#fff')
                    this.setColorPicked(container, colorPick);
                    if (cb && typeof cb == 'function') cb();
                }
            })
        },
        // 设置颜色拾取器选中状态
        setColorPicked(container, color = '#ffffff') {
            let pickes = container.querySelectorAll('p');
            pickes.forEach(pickItem => {
                let colorPick = pickItem.getAttribute('data-color');
                pickItem.firstChild.style.display = colorPick === color ? 'block' : 'none';
            })
        },
        // 创建菜单项
        _create_menu_item(j, text, fn, isDepNode, cb, defaultFn, config) {
            function menuHandler() {
                defaultFn.call(this, this.selected_node)
                if (!this._get_mid_opts()) {
                    cb(this.selected_node, _noop)
                    fn.call(j, Jm.util.uuid.newid(), this.menuOpts.newNodeText || '请输入节点名称')
                    return
                }
                cb(this.selected_node, this._mid_stage_next(function () {
                    var retArgs = [this.selected_node]
                    var argus = Array.prototype.slice.call(arguments[0], 0)
                    argus[1] = this.menuOpts.newNodeText || '请输入节点名称'
                    if (argus[0]) {
                        retArgs = argus
                    }
                    fn.apply(j, retArgs)
                }.bind(this)))
            }
            const isSetColor = config.target == 'setBgColor';
            var d = $c('menu-item');
            d.setAttribute('data-type', config.target)
            d.style.cssText = `display: flex; justify-content: center;align-items: center;`
            var Div = $c('div');
            this._set_menu_item_syl(Div)
            Div.title = text;
            const icon = $c('span')
            icon.classList.add(config.target)
            icon.style.cssText = this.getIconStyle(config);
            Div.appendChild(icon)
            d.appendChild(Div)
            if (isSetColor) {
                d.style.paddingLeft = '5px';
                d.style.marginLeft = '5px';
                d.style.borderLeft = '1px solid #f5f5f5';
                Div.style.paddingRight = '6px';
                Div.style.position = 'relative';
                let dropDown = $c('i');
                dropDown.style.cssText = `width: 6px;height: 5px;margin-left: 6px;background: url(${config.icon}) center center;`
                Div.appendChild(dropDown);
                this.buildColorSelect(Div);
            }
            Div.addEventListener('click', function (e) {
                if (this.selected_node || !isDepNode) {
                    if (isSetColor) {
                        e.stopPropagation();
                        this.colorSelectShow(Div, menuHandler.bind(this))
                    } else {
                        (menuHandler.bind(this))();
                    }
                    return
                }
                alert(this.menuOpts.tipContent || '请选择一个节点！')
            }.bind(this))
            Div.addEventListener('mouseover', function () {
                Div.style.background = '#f5f5f5'
            })
            Div.addEventListener('mouseleave', function () {
                Div.style.background = '#fff'
            })
            return d
        },

        _set_menu_wrap_syl(d) {
            var os = this._get_option_sty('menu', this._get_mixin_sty)
            d.style.cssText = this._format_cssText(os)
        },

        _set_menu_item_syl(d) {
            var os = this._get_option_sty('menuItem', this._get_mixin_sty)
            d.style.cssText = this._format_cssText(os)
        },

        _format_cssText(o) {
            var text = ''
            Object.keys(o).forEach(function (k) {
                text += k + ':' + o[k] + ';'
            })
            return text
        },

        _empty_object(o) {
            return Object.keys(o).length == 0
        },

        _get_option_sty(type, fn) {
            var sty = this.menuOpts.style
            var menu = this.defaultDataMap.menuStl
            var menuItem = this.defaultDataMap.menuItemStl
            var o = { menu, menuItem }
            if (!sty) return o[type]
            if (!sty[type]) return o[type]
            if (!sty[type] || this._empty_object(sty[type])) return o[type]
            return fn(o[type], sty[type])
        },

        _get_mixin_sty(dSty, oSty) {
            var o = {}
            Object.keys(oSty).forEach(function (k) {
                o[k] = oSty[k]
            })
            Object.keys(dSty).forEach(function (k) {
                if (!o[k]) o[k] = dSty[k]
            })
            return o
        },

        _get_menu_options(j, fn) {
            var options = j.options
            if (!options.menuOpts) return
            if (!options.menuOpts.showMenu) return
            this.menuOpts = j.options.menuOpts
            fn.call(this)
        },

        _get_injectionDetail() {
            var iLs = this.menuOpts.injectionList
            var dLs = this.defaultDataMap.injectionList
            if (!iLs) return dLs
            if (!Array.isArray(iLs)) {
                logger.error('[jsmind] injectionList must be a Array')
                return
            }
            if (iLs.length == 0) return dLs
            return iLs
        },

        _get_injectionList(j) {
            var list = this._get_injectionDetail()
            var _this = this
            list.forEach(function (k) {
                var o = null
                var text = ''
                var callback = _noop
                var defaultFn = _noop

                if (typeof k === 'object') {
                    o = _this.defaultDataMap.funcMap[k.target]
                    text = k.text
                    k.callback && (callback = k.callback)
                } else {
                    o = _this.defaultDataMap.funcMap[k]
                    text = o.text
                }

                if (o.defaultFn) defaultFn = o.defaultFn
                _this.menu.appendChild(_this._create_menu_item(j, text, o.fn, o.isDepNode, callback, defaultFn, k))
            })
        },

        _get_mid_opts() {
            var b = this.menuOpts.switchMidStage
            if (!b) return false
            if (typeof b !== 'boolean') {
                logger.error('[jsmind] switchMidStage must be Boolean')
                return false
            }
            return b
        },

        _switch_view_db_event(b, jm) {
            Jm.prototype.dblclick_handle = _noop
            Jm.shortcut_provider.prototype.handler = _noop
            Jm.view_provider.prototype.edit_node_end = _noop
        },

        _mid_stage_next(fn) {
            return function () {
                fn(arguments)
            }
        },

        _reset_mind_event_edit() { },

        _menu_default_mind_methods: {
            _menu_begin_edit: function () {
                var f = this.get_editable()
                if (!f) {
                    logger.error('fail, this mind map is not editable.')
                };
                return f
            },
            _menu_edit_node_begin(scope, node) {
                if (!node.topic) {
                    logger.warn("don't edit image nodes")
                    return
                }
                if (scope.editing_node != null) {
                    this._menu_default_mind_methods._menu_edit_node_end.call(scope)
                }
                scope.editing_node = node
                var view_data = node._data.view
                var element = view_data.element
                var topic = node.topic
                var ncs = getComputedStyle(element)
                scope.e_editor.value = topic
                scope.e_editor.style.width = (element.clientWidth - parseInt(ncs.getPropertyValue('padding-left')) - parseInt(ncs.getPropertyValue('padding-right'))) + 'px'
                element.innerHTML = ''
                element.appendChild(scope.e_editor)
                element.style.zIndex = 5
                scope.e_editor.focus()
                scope.e_editor.select()
            },
            _menu_edit_node_end: function () {
                if (this.editing_node != null) {
                    var node = this.editing_node
                    this.editing_node = null
                    var view_data = node._data.view
                    var element = view_data.element
                    var topic = this.e_editor.value
                    element.style.zIndex = 'auto'
                    element.removeChild(this.e_editor)
                    $w.menu._update_node_info = { id: node.id, topic: topic }
                    if (Jm.util.text.is_empty(topic) || node.topic === topic) {
                        if (this.opts.support_html) {
                            $h(element, node.topic)
                        } else {
                            $t(element, node.topic)
                        }
                    }
                }
            },
            _menu_update_edit_node: function () {
                var info = $w.menu._update_node_info
                $w.menu.jm.update_node(info.id, info.topic)
            }
        }

    }
    var plugin = new Jm.plugin('menu', function (_jm) {
        $w.menu = new Jm.menu(_jm)

        menu.jm = _jm

        if (menu.menuOpts) _jm.menu = menu
    })

    Jm.register_plugin(plugin)

    function preventMindEventDefault() {
        Jm.menu.prototype._switch_view_db_event()
    }
    Jm.preventMindEventDefault = preventMindEventDefault
})(window, 'jsMind')