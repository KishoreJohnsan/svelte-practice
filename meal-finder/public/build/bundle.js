
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.25.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\components\Meal.svelte generated by Svelte v3.25.1 */

    const file = "src\\components\\Meal.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (54:4) {#if meal.strCategory}
    function create_if_block_1(ctx) {
    	let p;
    	let t_value = /*meal*/ ctx[0].strCategory + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-d536rf");
    			add_location(p, file, 54, 6, 1008);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meal*/ 1 && t_value !== (t_value = /*meal*/ ctx[0].strCategory + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(54:4) {#if meal.strCategory}",
    		ctx
    	});

    	return block;
    }

    // (57:4) {#if meal.strArea}
    function create_if_block(ctx) {
    	let p;
    	let t_value = /*meal*/ ctx[0].strArea + "";
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(t_value);
    			attr_dev(p, "class", "svelte-d536rf");
    			add_location(p, file, 57, 6, 1076);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*meal*/ 1 && t_value !== (t_value = /*meal*/ ctx[0].strArea + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(57:4) {#if meal.strArea}",
    		ctx
    	});

    	return block;
    }

    // (65:6) {#each ingredients as ing}
    function create_each_block(ctx) {
    	let li;
    	let t_value = /*ing*/ ctx[2] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-d536rf");
    			add_location(li, file, 65, 8, 1255);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ingredients*/ 2 && t_value !== (t_value = /*ing*/ ctx[2] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(65:6) {#each ingredients as ing}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div2;
    	let h1;
    	let t0_value = /*meal*/ ctx[0].strMeal + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t2;
    	let div0;
    	let t3;
    	let t4;
    	let div1;
    	let p;
    	let t5_value = /*meal*/ ctx[0].strInstructions + "";
    	let t5;
    	let t6;
    	let h2;
    	let t8;
    	let ul;
    	let if_block0 = /*meal*/ ctx[0].strCategory && create_if_block_1(ctx);
    	let if_block1 = /*meal*/ ctx[0].strArea && create_if_block(ctx);
    	let each_value = /*ingredients*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			t4 = space();
    			div1 = element("div");
    			p = element("p");
    			t5 = text(t5_value);
    			t6 = space();
    			h2 = element("h2");
    			h2.textContent = "Ingredients";
    			t8 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file, 50, 2, 861);
    			if (img.src !== (img_src_value = /*meal*/ ctx[0].strMealThumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*meal*/ ctx[0].strMeal);
    			attr_dev(img, "class", "svelte-d536rf");
    			add_location(img, file, 51, 2, 888);
    			attr_dev(div0, "class", "single-meal-info svelte-d536rf");
    			add_location(div0, file, 52, 2, 942);
    			attr_dev(p, "class", "svelte-d536rf");
    			add_location(p, file, 61, 4, 1146);
    			add_location(h2, file, 62, 4, 1181);
    			attr_dev(ul, "class", "svelte-d536rf");
    			add_location(ul, file, 63, 4, 1207);
    			attr_dev(div1, "class", "main");
    			add_location(div1, file, 60, 2, 1122);
    			attr_dev(div2, "class", "single-meal svelte-d536rf");
    			add_location(div2, file, 49, 0, 832);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, img);
    			append_dev(div2, t2);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t3);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			append_dev(p, t5);
    			append_dev(div1, t6);
    			append_dev(div1, h2);
    			append_dev(div1, t8);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*meal*/ 1 && t0_value !== (t0_value = /*meal*/ ctx[0].strMeal + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*meal*/ 1 && img.src !== (img_src_value = /*meal*/ ctx[0].strMealThumb)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*meal*/ 1 && img_alt_value !== (img_alt_value = /*meal*/ ctx[0].strMeal)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (/*meal*/ ctx[0].strCategory) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*meal*/ ctx[0].strArea) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*meal*/ 1 && t5_value !== (t5_value = /*meal*/ ctx[0].strInstructions + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*ingredients*/ 2) {
    				each_value = /*ingredients*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Meal", slots, []);
    	let { meal } = $$props;
    	let { ingredients } = $$props;
    	const writable_props = ["meal", "ingredients"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Meal> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("meal" in $$props) $$invalidate(0, meal = $$props.meal);
    		if ("ingredients" in $$props) $$invalidate(1, ingredients = $$props.ingredients);
    	};

    	$$self.$capture_state = () => ({ meal, ingredients });

    	$$self.$inject_state = $$props => {
    		if ("meal" in $$props) $$invalidate(0, meal = $$props.meal);
    		if ("ingredients" in $$props) $$invalidate(1, ingredients = $$props.ingredients);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [meal, ingredients];
    }

    class Meal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { meal: 0, ingredients: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Meal",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*meal*/ ctx[0] === undefined && !("meal" in props)) {
    			console.warn("<Meal> was created without expected prop 'meal'");
    		}

    		if (/*ingredients*/ ctx[1] === undefined && !("ingredients" in props)) {
    			console.warn("<Meal> was created without expected prop 'ingredients'");
    		}
    	}

    	get meal() {
    		throw new Error("<Meal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meal(value) {
    		throw new Error("<Meal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ingredients() {
    		throw new Error("<Meal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ingredients(value) {
    		throw new Error("<Meal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.25.1 */
    const file$1 = "src\\App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (172:4) {#if meal}
    function create_if_block_2(ctx) {
    	let meal_1;
    	let current;

    	meal_1 = new Meal({
    			props: {
    				meal: /*meal*/ ctx[4],
    				ingredients: /*ingredients*/ ctx[0]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(meal_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(meal_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const meal_1_changes = {};
    			if (dirty & /*meal*/ 16) meal_1_changes.meal = /*meal*/ ctx[4];
    			if (dirty & /*ingredients*/ 1) meal_1_changes.ingredients = /*ingredients*/ ctx[0];
    			meal_1.$set(meal_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(meal_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(meal_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(meal_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(172:4) {#if meal}",
    		ctx
    	});

    	return block;
    }

    // (175:4) {#if resultHeading}
    function create_if_block_1$1(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*resultHeading*/ ctx[3]);
    			add_location(h2, file$1, 175, 6, 3581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*resultHeading*/ 8) set_data_dev(t, /*resultHeading*/ ctx[3]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(175:4) {#if resultHeading}",
    		ctx
    	});

    	return block;
    }

    // (178:4) {#if searchResult}
    function create_if_block$1(ctx) {
    	let div;
    	let each_value = /*searchResult*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "id", "meals");
    			attr_dev(div, "class", "meals svelte-1wf4vjt");
    			add_location(div, file$1, 178, 6, 3645);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*fetchMealById, searchResult*/ 132) {
    				each_value = /*searchResult*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(178:4) {#if searchResult}",
    		ctx
    	});

    	return block;
    }

    // (180:8) {#each searchResult as meal}
    function create_each_block$1(ctx) {
    	let div1;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t0;
    	let div0;
    	let h3;
    	let t1_value = /*meal*/ ctx[4].strMeal + "";
    	let t1;
    	let t2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			if (img.src !== (img_src_value = /*meal*/ ctx[4].strMealThumb)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*meal*/ ctx[4].strMeal);
    			attr_dev(img, "class", "svelte-1wf4vjt");
    			add_location(img, file$1, 181, 12, 3754);
    			add_location(h3, file$1, 183, 14, 3893);
    			attr_dev(div0, "class", "meal-info svelte-1wf4vjt");
    			add_location(div0, file$1, 182, 12, 3817);
    			attr_dev(div1, "class", "meal svelte-1wf4vjt");
    			add_location(div1, file$1, 180, 10, 3723);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, img);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, h3);
    			append_dev(h3, t1);
    			append_dev(div1, t2);

    			if (!mounted) {
    				dispose = listen_dev(
    					div0,
    					"click",
    					function () {
    						if (is_function(/*fetchMealById*/ ctx[7](/*meal*/ ctx[4].idMeal))) /*fetchMealById*/ ctx[7](/*meal*/ ctx[4].idMeal).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*searchResult*/ 4 && img.src !== (img_src_value = /*meal*/ ctx[4].strMealThumb)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*searchResult*/ 4 && img_alt_value !== (img_alt_value = /*meal*/ ctx[4].strMeal)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if (dirty & /*searchResult*/ 4 && t1_value !== (t1_value = /*meal*/ ctx[4].strMeal + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(180:8) {#each searchResult as meal}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div1;
    	let h1;
    	let t1;
    	let div0;
    	let input;
    	let t2;
    	let button0;
    	let i0;
    	let t3;
    	let button1;
    	let i1;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*meal*/ ctx[4] && create_if_block_2(ctx);
    	let if_block1 = /*resultHeading*/ ctx[3] && create_if_block_1$1(ctx);
    	let if_block2 = /*searchResult*/ ctx[2] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Meal Finder";
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			button0 = element("button");
    			i0 = element("i");
    			t3 = space();
    			button1 = element("button");
    			i1 = element("i");
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			add_location(h1, file$1, 156, 4, 3062);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "search");
    			attr_dev(input, "placeholder", "Search for meals or keywords");
    			attr_dev(input, "class", "svelte-1wf4vjt");
    			add_location(input, file$1, 158, 6, 3112);
    			attr_dev(i0, "class", "fas fa-search");
    			add_location(i0, file$1, 164, 8, 3308);
    			attr_dev(button0, "class", "search-btn svelte-1wf4vjt");
    			add_location(button0, file$1, 163, 6, 3251);
    			attr_dev(i1, "class", "fas fa-random");
    			add_location(i1, file$1, 168, 8, 3435);
    			attr_dev(button1, "class", "random-btn svelte-1wf4vjt");
    			attr_dev(button1, "id", "random");
    			add_location(button1, file$1, 167, 6, 3359);
    			attr_dev(div0, "class", "flex svelte-1wf4vjt");
    			add_location(div0, file$1, 157, 4, 3087);
    			attr_dev(div1, "class", "container svelte-1wf4vjt");
    			add_location(div1, file$1, 155, 2, 3034);
    			add_location(main, file$1, 154, 0, 3025);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, input);
    			set_input_value(input, /*searchMeal*/ ctx[1]);
    			append_dev(div0, t2);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(button1, i1);
    			append_dev(div1, t4);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t5);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block2) if_block2.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[8]),
    					listen_dev(button0, "click", /*fetchMeal*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*fetchRandomMeals*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*searchMeal*/ 2 && input.value !== /*searchMeal*/ ctx[1]) {
    				set_input_value(input, /*searchMeal*/ ctx[1]);
    			}

    			if (/*meal*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*meal*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div1, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*resultHeading*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div1, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*searchResult*/ ctx[2]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let meal;
    	let ingredients = [];
    	let searchMeal;
    	let searchResult;
    	let resultHeading;

    	const fetchRandomMeals = async () => {
    		$$invalidate(2, searchResult = "");
    		$$invalidate(3, resultHeading = "");
    		const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
    		let data = await response.json();
    		$$invalidate(4, meal = data.meals[0]);

    		for (let i = 1; i <= 20; i++) {
    			if (meal[`strIngredient${i}`]) {
    				ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    			} else {
    				break;
    			}
    		}
    	};

    	const fetchMeal = async () => {
    		$$invalidate(4, meal = "");
    		$$invalidate(0, ingredients = []);
    		$$invalidate(2, searchResult = "");
    		const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchMeal}`);
    		let data = await response.json();

    		if (data.meals === null) $$invalidate(3, resultHeading = "There are no search results. Try again!"); else {
    			$$invalidate(2, searchResult = data.meals);
    			$$invalidate(3, resultHeading = `Search results for '${searchMeal}`);
    		}
    	};

    	const fetchMealById = async mealId => {
    		$$invalidate(2, searchResult = "");
    		$$invalidate(3, resultHeading = "");
    		const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
    		let data = await response.json();
    		$$invalidate(4, meal = data.meals[0]);

    		for (let i = 1; i <= 20; i++) {
    			if (meal[`strIngredient${i}`]) {
    				ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
    			} else {
    				break;
    			}
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function input_input_handler() {
    		searchMeal = this.value;
    		$$invalidate(1, searchMeal);
    	}

    	$$self.$capture_state = () => ({
    		Meal,
    		meal,
    		ingredients,
    		searchMeal,
    		searchResult,
    		resultHeading,
    		fetchRandomMeals,
    		fetchMeal,
    		fetchMealById
    	});

    	$$self.$inject_state = $$props => {
    		if ("meal" in $$props) $$invalidate(4, meal = $$props.meal);
    		if ("ingredients" in $$props) $$invalidate(0, ingredients = $$props.ingredients);
    		if ("searchMeal" in $$props) $$invalidate(1, searchMeal = $$props.searchMeal);
    		if ("searchResult" in $$props) $$invalidate(2, searchResult = $$props.searchResult);
    		if ("resultHeading" in $$props) $$invalidate(3, resultHeading = $$props.resultHeading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ingredients,
    		searchMeal,
    		searchResult,
    		resultHeading,
    		meal,
    		fetchRandomMeals,
    		fetchMeal,
    		fetchMealById,
    		input_input_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({
    	target: document.body	
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
