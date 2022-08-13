;(function (v, B) {
	typeof exports == 'object' && typeof module < 'u'
		? (module.exports = B(require('vue')))
		: typeof define == 'function' && define.amd
		? define(['vue'], B)
		: ((v = typeof globalThis < 'u' ? globalThis : v || self), (v['@sedum/stonecrop'] = B(v.Vue)))
})(this, function (v) {
	'use strict'
	const B = (() => {
			let t
			try {
				t = process.env.NODE_ENV
			} catch {
				t = 'development'
			}
			return t
		})(),
		j = Symbol('IS_PROXY'),
		G = Symbol('PATH'),
		z = Symbol('VALUE'),
		Lt = Symbol('PROXY_TREE'),
		Ht = t => String(t) === '[object Object]' && t.constructor.name === 'Object',
		$e = new Set(['push', 'shift', 'pop', 'unshift', 'splice', 'reverse', 'sort', 'copyWithin']),
		Ve = t => (t && t[j] ? t[z] : t),
		ce = t =>
			typeof t == 'object' &&
			t !== null &&
			!Array.isArray(t) &&
			t.constructor.name !== 'Object' &&
			Object.isExtensible(t),
		Le = t => t !== void 0 && (!ce(t) || (ce(t) && !(t instanceof Date) && !(t instanceof Map) && !(t instanceof Set)))
	class pe {
		constructor(e) {
			;(this.tree = e),
				(this.CACHED_PROXY = Symbol('CACHED_PROXY')),
				(this.delimiter = e.master.options.delimiter),
				(this.ssr = Boolean(e.master.options.ssr))
		}
		concat(e, n) {
			return e ? e + this.delimiter + n : n
		}
		ensureMutationTrackingIsEnabled(e) {
			if (B !== 'production' && this.tree.master.options.devmode && !this.tree.canMutate())
				throw new Error(`proxy-state-tree - You are mutating the path "${e}", but it is not allowed. The following could have happened:
        
        - The mutation is explicitly being blocket
        - You are passing state to a 3rd party tool trying to manipulate the state
        - You are running asynchronous code and forgot to "await" its execution
        `)
		}
		isDefaultProxifier() {
			return this.tree.proxifier === this.tree.master.proxifier
		}
		ensureValueDosntExistInStateTreeElsewhere(e) {
			if (B !== 'production') {
				if (e && e[j] === !0)
					throw new Error(
						`proxy-state-tree - You are trying to insert a value that already exists in the state tree on path "${e[G]}"`
					)
				return e
			}
		}
		trackPath(e) {
			if (!!this.tree.canTrack())
				if (this.isDefaultProxifier()) {
					const n = this.tree.master.currentTree
					if (!n) return
					n.addTrackingPath(e)
				} else this.tree.addTrackingPath(e)
		}
		getTrackingTree() {
			return this.tree.master.currentTree && this.isDefaultProxifier()
				? this.tree.master.currentTree
				: this.tree.canTrack() && this.tree.canTrack()
				? this.tree
				: null
		}
		getMutationTree() {
			return this.tree.master.mutationTree || this.tree
		}
		isProxyCached(e, n) {
			return e[this.CACHED_PROXY] && String(e[this.CACHED_PROXY][G]) === String(n)
		}
		createArrayProxy(e, n) {
			if (!this.ssr && this.isProxyCached(e, n)) return e[this.CACHED_PROXY]
			const s = this,
				r = new Proxy(e, {
					get(i, o) {
						if (o === j) return !0
						if (o === G) return n
						if (o === z) return e
						if (o === 'indexOf') return (h, f) => e.indexOf(Ve(h), Ve(f))
						if (o === 'length' || (typeof i[o] == 'function' && !$e.has(String(o))) || typeof o == 'symbol') return i[o]
						const l = s.getTrackingTree(),
							c = s.concat(n, o),
							u = l || s.tree
						l && l.proxifier.trackPath(c), u.trackPathListeners.forEach(h => h(c))
						const a = String(o)
						return $e.has(a)
							? (...h) => {
									const f = s.getMutationTree()
									let p
									return (
										B === 'production'
											? (p = i[o](...h))
											: (p = i[o](...h.map(y => s.ensureValueDosntExistInStateTreeElsewhere(y)))),
										f.addMutation({ method: a, path: n, delimiter: s.delimiter, args: h, hasChangedValue: !0 }),
										p
									)
							  }
							: Le(i[o])
							? s.proxify(i[o], c)
							: i[o]
					},
					set(i, o, l) {
						const c = s.concat(n, o),
							u = s.getMutationTree(),
							a = Reflect.set(i, o, l)
						return u.addMutation({ method: 'set', path: c, args: [l], delimiter: s.delimiter, hasChangedValue: !0 }), a
					},
				})
			return this.ssr || Object.defineProperty(e, this.CACHED_PROXY, { value: r, configurable: !0 }), r
		}
		createObjectProxy(e, n) {
			if (!this.ssr && this.isProxyCached(e, n)) return e[this.CACHED_PROXY]
			const s = this,
				r = new Proxy(e, {
					get(i, o) {
						if (o === j) return !0
						if (o === G) return n
						if (o === z) return e
						if (o === Lt) return s.tree
						if (typeof o == 'symbol' || o in Object.prototype) return i[o]
						const l =
							Object.getOwnPropertyDescriptor(i, o) ||
							(Object.getPrototypeOf(i) && Object.getOwnPropertyDescriptor(Object.getPrototypeOf(i), o))
						if (l && 'get' in l) {
							const f = l.get.call(r)
							return (
								s.tree.master.options.devmode &&
									s.tree.master.options.onGetter &&
									s.tree.master.options.onGetter(s.concat(n, o), f),
								f
							)
						}
						const c = s.getTrackingTree(),
							u = i[o],
							a = s.concat(n, o),
							h = c || s.tree
						return typeof u == 'function'
							? s.tree.master.options.onGetFunction
								? s.tree.master.options.onGetFunction(c || s.tree, a, i, o)
								: ce(i)
								? u
								: u.call(i, s.tree, a)
							: (h.trackPathListeners.forEach(f => f(a)), c && c.proxifier.trackPath(a), Le(u) ? s.proxify(u, a) : u)
					},
					set(i, o, l) {
						const c = s.concat(n, o)
						let u
						o in i || (u = n)
						const a = s.getMutationTree(),
							h = i[o]
						typeof l == 'function' &&
							s.tree.master.options.onSetFunction &&
							(l = s.tree.master.options.onSetFunction(s.getTrackingTree() || s.tree, c, i, o, l))
						const f = h !== l,
							p = Reflect.set(i, o, l)
						return (
							a.addMutation({ method: 'set', path: c, args: [l], delimiter: s.delimiter, hasChangedValue: f }, u), p
						)
					},
					deleteProperty(i, o) {
						const l = s.concat(n, o)
						let c
						o in i && (c = n)
						const u = s.getMutationTree()
						return (
							delete i[o],
							u.addMutation({ method: 'unset', path: l, args: [], delimiter: s.delimiter, hasChangedValue: !0 }, c),
							!0
						)
					},
				})
			return this.ssr || Object.defineProperty(e, this.CACHED_PROXY, { value: r, configurable: !0 }), r
		}
		proxify(e, n) {
			if (e) {
				if (e[j] && (String(e[G]) !== String(n) || e[z][this.CACHED_PROXY] !== e)) return this.proxify(e[z], n)
				if (e[j]) return e
				if (Array.isArray(e)) return this.createArrayProxy(e, n)
				if (Ht(e) || ce(e)) return this.createObjectProxy(e, n)
			}
			return e
		}
	}
	class me {
		constructor(e, n) {
			;(this.mutationCallbacks = []),
				(this.mutations = []),
				(this.objectChanges = new Set()),
				(this.isTracking = !1),
				(this.isBlocking = !1),
				(this.trackPathListeners = []),
				(this.isTracking = !0),
				(this.master = e),
				(this.proxifier = n || new pe(this)),
				(this.state = this.proxifier.proxify(e.sourceState, ''))
		}
		trackPaths() {
			const e = new Set(),
				n = s => {
					e.add(s)
				}
			return (
				this.trackPathListeners.push(n),
				() => (this.trackPathListeners.splice(this.trackPathListeners.indexOf(n), 1), e)
			)
		}
		getMutations() {
			const e = this.mutations.slice()
			return (this.mutations.length = 0), e
		}
		getObjectChanges() {
			const e = new Set([...this.objectChanges])
			return this.objectChanges.clear(), e
		}
		addMutation(e, n) {
			const s = this.master.currentFlushId
			this.mutations.push(e), n && this.objectChanges.add(n)
			for (const r of this.master.mutationCallbacks) r(e, new Set(n ? [e.path, n] : [e.path]), s)
			for (const r of this.mutationCallbacks) r(e, new Set(n ? [e.path, n] : [e.path]), s)
		}
		flush(e = !1) {
			return this.master.flush(this, e)
		}
		onMutation(e) {
			this.mutationCallbacks.push(e)
		}
		canMutate() {
			return this.isTracking && !this.isBlocking
		}
		canTrack() {
			return !1
		}
		blockMutations() {
			this.isBlocking = !0
		}
		enableMutations() {
			this.isBlocking = !1
		}
		dispose() {
			return (this.isTracking = !1), (this.mutationCallbacks.length = 0), (this.proxifier = this.master.proxifier), this
		}
	}
	class ue {
		constructor(e) {
			;(this.pathDependencies = new Set()),
				(this.shouldTrack = !1),
				(this.trackPathListeners = []),
				(this.master = e),
				(this.proxifier = e.proxifier),
				(this.state = e.state)
		}
		trackPaths() {
			const e = new Set(),
				n = s => {
					e.add(s)
				}
			return (
				this.trackPathListeners.push(n),
				() => (this.trackPathListeners.splice(this.trackPathListeners.indexOf(n), 1), e)
			)
		}
		canMutate() {
			return !1
		}
		canTrack() {
			return !0
		}
		addTrackingPath(e) {
			!this.shouldTrack ||
				(this.pathDependencies.add(e), this.callback && this.master.addPathDependency(e, this.callback))
		}
		track(e) {
			return (
				this.master.changeTrackStateTree(this),
				(this.shouldTrack = !0),
				this.clearTracking(),
				e &&
					(this.callback = (...n) => {
						!this.callback || e(...n)
					}),
				this
			)
		}
		clearTracking() {
			if (this.callback) for (const e of this.pathDependencies) this.master.removePathDependency(e, this.callback)
			this.pathDependencies.clear()
		}
		stopTracking() {
			this.shouldTrack = !1
		}
		trackScope(e, n) {
			const s = this.master.previousTree,
				r = this.master.currentTree
			;(this.master.currentTree = this), this.track(n)
			const i = e(this)
			return (this.master.currentTree = r), (this.master.previousTree = s), this.stopTracking(), i
		}
		dispose() {
			return this.callback
				? (this.clearTracking(),
				  (this.callback = null),
				  (this.proxifier = this.master.proxifier),
				  this.master.currentTree === this && (this.master.currentTree = null),
				  this)
				: (this.pathDependencies.clear(), this)
		}
	}
	class Ft {
		constructor(e, n = {}) {
			;(this.cache = { mutationTree: [], trackStateTree: [] }),
				(this.flushCallbacks = []),
				(this.mutationCallbacks = []),
				(this.currentFlushId = 0),
				(this.pathDependencies = {}),
				typeof n.devmode > 'u' && (n.devmode = !0),
				n.delimiter || (n.delimiter = '.'),
				(this.master = this),
				(this.sourceState = e),
				(this.options = n),
				this.createTrackStateProxifier()
		}
		createTrackStateProxifier() {
			const e = new ue(this)
			;(this.proxifier = e.proxifier = new pe(e)), (this.state = e.state = this.proxifier.proxify(this.sourceState, ''))
		}
		getMutationTree() {
			return this.options.devmode
				? this.cache.mutationTree.pop() || new me(this)
				: (this.mutationTree = this.mutationTree || new me(this, this.proxifier))
		}
		getTrackStateTree() {
			return this.cache.trackStateTree.pop() || new ue(this)
		}
		getTrackStateTreeWithProxifier() {
			const e = this.getTrackStateTree()
			return (
				this.options.ssr
					? (e.state = this.sourceState)
					: ((e.proxifier = new pe(e)), (e.state = e.proxifier.proxify(this.sourceState, ''))),
				e
			)
		}
		changeTrackStateTree(e) {
			;(this.previousTree = this.currentTree), (this.currentTree = e)
		}
		disposeTree(e) {
			e instanceof me
				? this.cache.mutationTree.push(e.dispose())
				: e instanceof ue && this.cache.trackStateTree.push(e.dispose())
		}
		onMutation(e) {
			return (
				this.mutationCallbacks.push(e),
				() => {
					this.mutationCallbacks.splice(this.mutationCallbacks.indexOf(e), 1)
				}
			)
		}
		forceFlush() {
			const e = [],
				n = []
			for (const s in this.pathDependencies)
				this.pathDependencies[s].forEach(i => {
					i(e, n, this.currentFlushId++, !1)
				})
		}
		flush(e, n = !1) {
			let s
			if (
				(Array.isArray(e)
					? (s = e.reduce(
							(u, a) => ({
								mutations: u.mutations.concat(a.getMutations()),
								objectChanges: new Set([...u.objectChanges, ...a.getObjectChanges()]),
							}),
							{ mutations: [], objectChanges: new Set() }
					  ))
					: (s = { mutations: e.getMutations(), objectChanges: e.getObjectChanges() }),
				!s.mutations.length && !s.objectChanges.size)
			)
				return { mutations: [], flushId: null }
			const r = new Set(),
				i = new Set(),
				o = this.currentFlushId++
			for (const u of s.objectChanges) this.pathDependencies[u] && r.add(u)
			for (const u of s.mutations) u.hasChangedValue && r.add(u.path)
			const l = Array.from(r).sort()
			for (const u of l) if (this.pathDependencies[u]) for (const a of this.pathDependencies[u]) i.add(a)
			for (const u of i) u(s.mutations, l, o, n)
			const c = this.flushCallbacks.slice()
			for (const u of c) this.flushCallbacks.includes(u) && u(s.mutations, l, o, n)
			return r.clear(), i.clear(), { mutations: s.mutations, flushId: o }
		}
		onFlush(e) {
			return this.flushCallbacks.push(e), () => this.flushCallbacks.splice(this.flushCallbacks.indexOf(e), 1)
		}
		rescope(e, n) {
			return e && e[j] ? n.proxifier.proxify(e[z], e[G]) : e
		}
		addPathDependency(e, n) {
			this.pathDependencies[e] || (this.pathDependencies[e] = new Set()), this.pathDependencies[e].add(n)
		}
		removePathDependency(e, n) {
			this.pathDependencies[e].delete(n), this.pathDependencies[e].size || delete this.pathDependencies[e]
		}
		toJSON() {
			return this.sourceState
		}
	}
	var b
	;(function (t) {
		;(t.ACTION_START = 'action:start'),
			(t.ACTION_END = 'action:end'),
			(t.OPERATOR_START = 'operator:start'),
			(t.OPERATOR_END = 'operator:end'),
			(t.OPERATOR_ASYNC = 'operator:async'),
			(t.MUTATIONS = 'mutations'),
			(t.EFFECT = 'effect'),
			(t.DERIVED = 'derived'),
			(t.DERIVED_DIRTY = 'derived:dirty'),
			(t.COMPONENT_ADD = 'component:add'),
			(t.COMPONENT_UPDATE = 'component:update'),
			(t.COMPONENT_REMOVE = 'component:remove'),
			(t.GETTER = 'getter')
	})(b || (b = {}))
	const He = Symbol('IS_DERIVED'),
		ge = Symbol('IS_DERIVED_CONSTRUCTOR')
	class Fe {
		constructor(e) {
			;(this.cb = e), (this.isDirty = !0), (this.updateCount = 0)
			const n = this.evaluate.bind(this)
			return (
				process.env.NODE_ENV === 'development' &&
					(n.dispose = () => {
						this.disposeOnMutation()
					}),
				(n[He] = !0),
				n
			)
		}
		runScope(e, n) {
			const s = n.slice(0, n.length - 1).reduce((r, i) => r[i], e.state)
			return this.cb(s, e.state)
		}
		evaluate(e, n, s, r) {
			if (
				(this.disposeOnMutation ||
					(this.disposeOnMutation = s.onMutation((i, o, l) => {
						if (typeof r.reduce((c, u) => c && c[u], s.sourceState) != 'function') {
							this.disposeOnMutation()
							return
						}
						if (!this.isDirty) {
							for (const c of o)
								if (this.paths.has(c)) {
									;(this.isDirty = !0), e.emitAsync(b.DERIVED_DIRTY, { derivedPath: r, path: c, flushId: l })
									return
								}
						}
					})),
				this.isDirty || this.previousProxifier !== n.proxifier)
			) {
				const i = n.trackPaths()
				;(this.value = this.runScope(n, r)),
					(this.isDirty = !1),
					(this.paths = i()),
					process.env.NODE_ENV === 'development' &&
						(e.emitAsync(b.DERIVED, {
							path: r,
							paths: Array.from(this.paths),
							updateCount: this.updateCount,
							value: this.value,
						}),
						this.updateCount++)
			}
			if (n instanceof ue) for (const i of this.paths) n.addTrackingPath(i), n.trackPathListeners.forEach(o => o(i))
			return (this.previousProxifier = n.proxifier), this.value && this.value[j] ? s.rescope(this.value, n) : this.value
		}
	}
	var Ut = (function () {
			function t() {
				this.events = new Map()
			}
			return (
				(t.prototype.emit = function (e, n) {
					for (var s = this.events.get(e) || [], r = s.length - 1; r >= 0; r--) {
						var i = s[r]
						i.cb(n), i.once && s.splice(r, 1)
					}
				}),
				(t.prototype.emitAsync = function (e, n) {
					var s = this.events.get(e) || []
					setTimeout(function () {
						for (var r = s.length - 1; r >= 0; r--) {
							var i = s[r]
							i.cb(n), i.once && s.splice(r, 1)
						}
					})
				}),
				(t.prototype.on = function (e, n) {
					this.addListener(e, n, !1)
				}),
				(t.prototype.once = function (e, n) {
					this.addListener(e, n, !0)
				}),
				(t.prototype.addListener = function (e, n, s) {
					var r = this.events.get(e) || []
					r.push({ once: s, cb: n }), this.events.set(e, r)
				}),
				t
			)
		})(),
		Yt = Object.prototype.toString,
		K = function (t) {
			var e
			return (
				Yt.call(t) === '[object Object]' &&
				((e = Object.getPrototypeOf(t)), e === null || e === Object.getPrototypeOf({}))
			)
		}
	/*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */ function Bt(t, e, n, s) {
		function r(i) {
			return i instanceof n
				? i
				: new n(function (o) {
						o(i)
				  })
		}
		return new (n || (n = Promise))(function (i, o) {
			function l(a) {
				try {
					u(s.next(a))
				} catch (h) {
					o(h)
				}
			}
			function c(a) {
				try {
					u(s.throw(a))
				} catch (h) {
					o(h)
				}
			}
			function u(a) {
				a.done ? i(a.value) : r(a.value).then(l, c)
			}
			u((s = s.apply(t, e || [])).next())
		})
	}
	function Ue(t, e, n = {}) {
		if (!t || !e) throw new Error('You have to pass a "target" and "source" object to rehydrate')
		Object.keys(e).forEach(s => {
			const r = e[s],
				i = n[s]
			typeof i == 'function' && Array.isArray(t[s])
				? (t[s] = e[s].map(o => i(o)))
				: typeof i == 'function' && typeof t[s] == 'object' && t[s] !== null && t[s].constructor.name === 'Object'
				? (t[s] = Object.keys(e[s]).reduce((o, l) => ((o[l] = i(e[s][l])), o), {}))
				: typeof i == 'function'
				? (t[s] = i(e[s]))
				: typeof r == 'object' && !Array.isArray(r) && r !== null
				? (t[s] || (t[s] = {}), Ue(t[s], e[s], n[s]))
				: (t[s] = e[s])
		})
	}
	const Gt = Symbol('SERIALIZE'),
		Ye = (t, e, n = {}) => {
			Array.isArray(e)
				? e.forEach(r => {
						const i = r.path.split(r.delimiter),
							o = i.pop(),
							l = i.reduce((u, a) => u[a], t),
							c = i.reduce((u, a) => u && u[a], n)
						r.method === 'set'
							? typeof c == 'function' && Array.isArray(r.args[0])
								? (l[o] = r.args[0].map(u => c(u)))
								: typeof c == 'function'
								? (l[o] = c(r.args[0]))
								: (l[o] = r.args[0])
							: r.method === 'unset'
							? delete l[o]
							: l[o][r.method].apply(
									l[o],
									typeof c == 'function' ? r.args.map(u => (typeof u == 'object' && u !== null ? c(u) : u)) : r.args
							  )
				  })
				: Ue(t, e, n)
		}
	class zt {
		constructor(e) {
			;(this.safeClassNames = new Set()),
				(this.unsafeClassNames = new Set()),
				(this.circularReferenceCache = []),
				(this.buffer = []),
				(this.serializer = Promise.resolve()),
				(this.isConnected = !1),
				(this.doReconnect = !1),
				(this.hasWarnedReconnect = !1),
				(this.reconnectInterval = 1e4),
				(this.connect = (n, s) => {
					;(n = n || 'localhost:3031'),
						(this.ws = new WebSocket(`ws://${n}?name=${this.name}`)),
						(this.ws.onmessage = r => {
							const i = JSON.parse(r.data)
							i.appName === this.name && s(i)
						}),
						(this.ws.onopen = () => {
							;(this.isConnected = !0), this.flushBuffer()
						}),
						(this.ws.onerror = () => {
							console.error(`OVERMIND DEVTOOLS: Not able to connect. You are trying to connect to "${n}", but there was no devtool there. Try the following:
        
          - Make sure you are running the latest version of the devtools, using "npx overmind-devtools@latest" or install latest extension for VSCode
          - Close the current tab and open a new one
          - Make sure the correct port is configured in the devtools
        `)
						}),
						(this.ws.onclose = () => {
							;(this.isConnected = !1),
								this.doReconnect &&
									!this.hasWarnedReconnect &&
									(console.warn(
										'Debugger application is not running on selected port... will reconnect automatically behind the scenes'
									),
									(this.hasWarnedReconnect = !0)),
								this.doReconnect && this.reconnect(n, s)
						})
				}),
				(this.sendMessage = n => {
					if (!this.isConnected) {
						this.buffer.push(n)
						return
					}
					this.ws.send(`{"appName":"${this.name}","message":${n}}`)
				}),
				(this.flushBuffer = () =>
					Bt(this, void 0, void 0, function* () {
						this.buffer.forEach(n => {
							this.sendMessage(n)
						}),
							(this.buffer.length = 0)
					})),
				(this.name =
					typeof location < 'u' && location.search.includes('OVERMIND_DEVTOOL') ? e + ' (Overmind Devtool)' : e)
		}
		reconnect(e, n) {
			setTimeout(() => this.connect(e, n), this.reconnectInterval)
		}
		send(e) {
			const n = this.safeClassNames,
				s = this.unsafeClassNames,
				r = this.circularReferenceCache
			this.sendMessage(
				JSON.stringify(e, function (i, o) {
					if (typeof o == 'function') return '[Function]'
					if (this.__CLASS__) return o
					if (o && o[Gt]) return { __CLASS__: !0, name: o.constructor.name, value: o }
					if (
						typeof o == 'object' &&
						o !== null &&
						!Array.isArray(o) &&
						o.constructor &&
						o.constructor.name !== 'Object'
					) {
						if (r.includes(o)) return `[CIRCULAR REFERENCE: ${o.constructor.name}]`
						if ((r.push(o), !n.has(o.constructor.name) && !s.has(o.constructor.name)))
							try {
								JSON.stringify(o), n.add(o.constructor.name)
							} catch {
								s.add(o.constructor.name)
							}
						return n.has(o.constructor.name)
							? { __CLASS__: !0, name: o.constructor.name, value: o }
							: `[${o.constructor.name || 'NOT SERIALIZABLE'}]`
					}
					return o
				})
			),
				(r.length = 0)
		}
	}
	function Kt(t) {
		return typeof t == 'object' && !Array.isArray(t) && t !== null
	}
	let Be = !1,
		Wt = 0
	const Ge = Symbol('ORIGIN_TARGET')
	function ze(t, e, n = '') {
		return !Kt(t) && typeof t != 'function'
			? t
			: new Proxy(t, {
					apply(s, r, i) {
						const o = Wt++,
							l = n.split('.'),
							c = l.pop()
						return e({ func: s.bind(r ? r[Ge] : void 0), effectId: o, name: l.join('.'), method: c, args: i })
					},
					construct(s, r) {
						return (
							Be ||
								(console.warn(
									`EFFECTS - It is highly recommended to create a custom effect, exposing a method that deals with the instantiation of "${n}". It improves readability and debugability of your app`
								),
								(Be = !0)),
							new s(...r)
						)
					},
					get(s, r) {
						return r === Ge ? s : ze(s[r], e, n ? n + '.' + r.toString() : r.toString())
					},
			  })
	}
	const qt =
			() =>
			({ actions: t }, e) => {
				const n = Qe('onInitializeOvermind', t)
				return Promise.all(n.map(s => s(e)))
			},
		M = (() => {
			let t
			try {
				t = process.env.NODE_ENV
			} catch {
				console.warn(
					'Overmind was unable to determine the NODE_ENV, which means it will run in DEVELOPMENT mode. If this is a production app, please configure your build tool to define NODE_ENV'
				),
					(t = 'development')
			}
			return t
		})(),
		Xt = M === 'test',
		Ke = Symbol('operator'),
		Qt = Symbol('origina_actions'),
		ye = Symbol('execution'),
		H = Symbol('MODE_DEFAULT'),
		le = Symbol('MODE_TEST'),
		V = Symbol('MODE_SSR')
	class Jt {
		emit() {}
		emitAsync() {}
		on() {}
		once() {}
		addListener() {}
	}
	function We(t) {
		return t instanceof Promise || (t && typeof t.then == 'function' && typeof t.catch == 'function')
	}
	function Ee(t) {
		return Object.keys(t).reduce(
			(e, n) => {
				if (n === '__esModule') return e
				const s = Object.getOwnPropertyDescriptor(t, n)
				if (s && 'get' in s) return Object.defineProperty(e, n, s), e
				const r = t[n]
				return K(r) ? (e[n] = Ee(r)) : Object.defineProperty(e, n, s), e
			},
			K(t) ? {} : t
		)
	}
	const qe = '.'
	function Xe(t, e, n = [], s = []) {
		const r = Object.keys(t),
			i = Object.keys(e)
		return (
			r.forEach(o => {
				i.includes(o) ||
					s.push({ delimiter: qe, args: [], path: n.concat(o).join('.'), hasChangedValue: !1, method: 'unset' })
			}),
			i.forEach(o => {
				K(t[o]) && K(e[o])
					? Xe(t[o], e[o], n.concat(o), s)
					: t[o] !== e[o] &&
					  s.push({ delimiter: qe, args: [e[o]], path: n.concat(o).join('.'), hasChangedValue: !1, method: 'set' })
			}),
			s
		)
	}
	function Qe(t, e = {}, n = []) {
		return Object.keys(e).reduce(
			(s, r) => (typeof e[r] == 'function' && r === t ? s.concat(e[r]) : s.concat(Qe(t, e[r], n.concat(r)))),
			[]
		)
	}
	function ve(t = {}, e = []) {
		return Object.keys(t).reduce(
			(n, s) => (typeof t[s] == 'function' ? n.concat(e.concat(s).join('.')) : n.concat(ve(t[s], e.concat(s)))),
			[]
		)
	}
	function Je(t, e) {
		return new Proxy(t, {
			get(n, s) {
				if (s === Qt) return t
				if (typeof n[s] == 'function') return e(n[s])
				if (!!n[s]) return Je(n[s], e)
			},
		})
	}
	const be = {}
	class Zt {
		constructor(e, n = {}, s = { mode: H }) {
			;(this.actionReferences = {}),
				(this.nextExecutionId = 0),
				(this.reydrateMutationsForHotReloading = []),
				(this.isStrict = !1),
				(this.reaction = (u, a, h = {}) => {
					let f
					if (h.nested) {
						const p = u(this.state)
						if (!p || !p[j])
							throw new Error(
								'You have to return an object or array from the Overmind state when using a "nested" reaction'
							)
						const y = p[G]
						f = this.addFlushListener(N => {
							N.forEach(A => {
								A.path.startsWith(y) && a(y ? y.split(this.delimiter).reduce((T, _) => T[_], this.state) : this.state)
							})
						})
					} else {
						const p = this.proxyStateTreeInstance.getTrackStateTree()
						let y
						const N = () => {
							p.trackScope(
								() => (y = u(p.state)),
								() => {
									N(), a(y)
								}
							)
						}
						N(),
							(f = () => {
								p.dispose()
							})
					}
					return h.immediate && a(u(this.state)), f
				}),
				(this.addMutationListener = u => this.proxyStateTreeInstance.onMutation(u)),
				(this.addFlushListener = u => this.proxyStateTreeInstance.onFlush(u))
			const r = n.name || 'OvermindApp',
				i = n.devEnv || 'development',
				o = typeof process < 'u' && process.title && process.title.includes('node')
			if (
				((this.delimiter = n.delimiter || '.'),
				(this.isStrict = Boolean(n.strict)),
				M === i && s.mode === H && n.hotReloading !== !1 && !o)
			) {
				if (be[r]) return be[r].reconfigure(e)
				be[r] = this
			}
			const l = s.mode === V ? new Jt() : new Ut(),
				c = this.createProxyStateTree(e, l, s.mode === le || M === i, s.mode === V)
			if (
				((this.originalConfiguration = e),
				(this.state = c.state),
				(this.effects = e.effects || {}),
				(this.proxyStateTreeInstance = c),
				(this.eventHub = l),
				(this.mode = s),
				(this.actions = this.getActions(e.actions)),
				s.mode !== V)
			) {
				if (M === i && s.mode === H && typeof window < 'u') {
					let u = 'OVERMIND: You are running in DEVELOPMENT mode.'
					if (n.logProxies !== !0) {
						const a = console.log
						;(console.log = (...h) =>
							a.apply(
								console,
								h.map(f => (f && f[j] ? f[z] : f))
							)),
							(u += `

 - To improve debugging experience "console.log" will NOT log proxies from Overmind, but the actual value. Please see docs to turn off this behaviour`)
					}
					if (n.devtools || (typeof location < 'u' && location.hostname === 'localhost' && n.devtools !== !1)) {
						const a = n.devtools === !0 ? 'localhost:3031' : n.devtools,
							h = n.name ? n.name : typeof document > 'u' ? 'NoName' : document.title || 'NoName'
						this.initializeDevtools(a, h, l, c.sourceState, e.actions)
					} else
						n.devtools !== !1 &&
							(u += `

 - You are not running on localhost. You will have to manually define the devtools option to connect`)
					Xt || console.warn(u)
				}
				if (M === 'production' && s.mode === H) {
					l.on(b.OPERATOR_ASYNC, h => {
						;(!h.parentExecution || !h.parentExecution.isRunning) && c.getMutationTree().flush(!0)
					}),
						l.on(b.ACTION_END, h => {
							;(!h.parentExecution || !h.parentExecution.isRunning) && c.getMutationTree().flush()
						})
					let u
					const a = () => {
						c.getMutationTree().flush(!0)
					}
					this.proxyStateTreeInstance.onMutation(() => {
						u && clearTimeout(u), (u = setTimeout(a, 0))
					})
				} else
					(s.mode === H || s.mode === le) &&
						((M === 'test' || (this.devtools && n.hotReloading !== !1)) &&
							l.on(b.MUTATIONS, u => {
								this.reydrateMutationsForHotReloading = this.reydrateMutationsForHotReloading.concat(u.mutations)
							}),
						l.on(b.OPERATOR_ASYNC, u => {
							if (!u.parentExecution || !u.parentExecution.isRunning) {
								const a = u.flush(!0)
								this.devtools &&
									a.mutations.length &&
									this.devtools.send({ type: 'flush', data: Object.assign(Object.assign({}, u), a) })
							}
						}),
						l.on(b.ACTION_END, u => {
							if (!u.parentExecution || !u.parentExecution.isRunning) {
								const a = u.flush()
								this.devtools &&
									a.mutations.length &&
									this.devtools.send({ type: 'flush', data: Object.assign(Object.assign({}, u), a) })
							}
						}))
				if (s.mode === H) {
					const u = this.createAction('onInitialize', qt())
					this.initialized = Promise.resolve(u(this))
				} else this.initialized = Promise.resolve(null)
			}
		}
		createProxyStateTree(e, n, s, r) {
			const i = new Ft(this.getState(e), {
				devmode: s && !r,
				ssr: r,
				delimiter: this.delimiter,
				onSetFunction: (o, l, c, u, a) => (a[ge] ? new Fe(a) : a),
				onGetFunction: (o, l, c, u) => {
					const a = c[u]
					if (a[He]) return a(n, o, i, l.split(this.delimiter))
					if (a[ge]) {
						const h = new Fe(a)
						return (c[u] = h), h(n, o, i, l.split(this.delimiter))
					}
					return a
				},
				onGetter: s
					? (o, l) => {
							this.eventHub.emitAsync(b.GETTER, { path: o, value: l })
					  }
					: void 0,
			})
			return i
		}
		createExecution(e, n, s) {
			const r = e.split('.')
			if ((r.pop(), M === 'production'))
				return {
					[ye]: !0,
					parentExecution: s,
					namespacePath: r,
					actionName: e,
					getMutationTree: () => this.proxyStateTreeInstance.getMutationTree(),
					getTrackStateTree: () => this.proxyStateTreeInstance.getTrackStateTree(),
					emit: this.eventHub.emit.bind(this.eventHub),
				}
			const i = []
			return {
				[ye]: !0,
				namespacePath: r,
				actionId: e,
				executionId: this.nextExecutionId++,
				actionName: e,
				operatorId: 0,
				isRunning: !0,
				parentExecution: s,
				path: [],
				emit: this.eventHub.emit.bind(this.eventHub),
				send: this.devtools ? this.devtools.send.bind(this.devtools) : () => {},
				trackEffects: this.trackEffects.bind(this, this.effects),
				getNextOperatorId: (() => {
					let l = 0
					return () => ++l
				})(),
				flush: s ? s.flush : l => this.proxyStateTreeInstance.flush(i, l),
				getMutationTree: s
					? s.getMutationTree
					: () => {
							const l = this.proxyStateTreeInstance.getMutationTree()
							return i.push(l), l
					  },
				getTrackStateTree: () => this.proxyStateTreeInstance.getTrackStateTree(),
				onFlush: l => this.proxyStateTreeInstance.onFlush(l),
				scopeValue: (l, c) => this.scopeValue(l, c),
			}
		}
		createContext(e, n) {
			return {
				state: n.state,
				actions: Je(this.actions, s => r => s(r, e.isRunning ? e : null)),
				execution: e,
				proxyStateTree: this.proxyStateTreeInstance,
				effects: this.trackEffects(this.effects, e),
				addNamespace: this.addNamespace.bind(this),
				reaction: this.reaction.bind(this),
				addMutationListener: this.addMutationListener.bind(this),
				addFlushListener: this.addFlushListener.bind(this),
			}
		}
		addNamespace(e, n, s) {
			const r = s || this.state,
				i = n.pop()
			if (e.state) {
				const o = n.reduce((l, c) => l[c], r)
				o[i] = Ee(e.state)
			}
			if (e.actions) {
				const o = n.reduce((l, c) => l[c], this.actions)
				o[i] = this.getActions(e.actions)
			}
			if (e.effects) {
				const o = n.reduce((l, c) => l[c], this.effects)
				o[i] = e.effects
			}
		}
		scopeValue(e, n) {
			return (
				e &&
				(e[j]
					? this.proxyStateTreeInstance.rescope(e, n)
					: K(e)
					? Object.assign({}, ...Object.keys(e).map(s => ({ [s]: this.proxyStateTreeInstance.rescope(e[s], n) })))
					: e)
			)
		}
		addExecutionMutation(e) {
			this.mutations.push(e)
		}
		createAction(e, n) {
			return (
				(this.actionReferences[e] = n),
				(r, i) => {
					const o = this.actionReferences[e]
					if (((i = i && i[ye] ? i : void 0), M === 'production' || o[Ke] || this.mode.mode === V)) {
						const l = this.createExecution(e, o, i)
						if ((this.eventHub.emit(b.ACTION_START, Object.assign(Object.assign({}, l), { value: r })), o[Ke]))
							return new Promise((c, u) => {
								o(
									null,
									Object.assign(Object.assign({}, this.createContext(l, this.proxyStateTreeInstance)), { value: r }),
									(a, h) => {
										;(l.isRunning = !1),
											h &&
												this.eventHub.emit(
													b.ACTION_END,
													Object.assign(Object.assign({}, h.execution), { operatorId: h.execution.operatorId - 1 })
												),
											a ? u(a) : c(h.value)
									}
								)
							})
						{
							const c = l.getMutationTree()
							this.isStrict && c.blockMutations()
							const u = o(this.createContext(l, c), r)
							return this.eventHub.emit(b.ACTION_END, l), u
						}
					} else {
						const l = Object.assign(Object.assign({}, this.createExecution(e, o, i)), { operatorId: 0, type: 'action' })
						this.eventHub.emit(b.ACTION_START, Object.assign(Object.assign({}, l), { value: r })),
							this.eventHub.emit(b.OPERATOR_START, l)
						const c = l.getMutationTree()
						this.isStrict && c.blockMutations(),
							c.onMutation(h => {
								this.eventHub.emit(b.MUTATIONS, Object.assign(Object.assign({}, l), { mutations: [h] }))
							})
						const u = this.scopeValue(r, c),
							a = this.createContext(l, c)
						try {
							let h
							c.onMutation(p => {
								h && clearTimeout(h),
									this.mode.mode === le
										? this.addExecutionMutation(p)
										: this.mode.mode === H &&
										  (h = setTimeout(() => {
												h = null
												const y = l.flush(!0)
												this.devtools &&
													y.mutations.length &&
													this.devtools.send({
														type: 'flush',
														data: Object.assign(Object.assign(Object.assign({}, l), y), { mutations: y.mutations }),
													})
										  }))
							})
							let f = o(a, u)
							return (
								We(f)
									? (this.eventHub.emit(b.OPERATOR_ASYNC, l),
									  (f = f
											.then(
												p => (
													(l.isRunning = !1),
													i || c.dispose(),
													this.eventHub.emit(
														b.OPERATOR_END,
														Object.assign(Object.assign({}, l), { isAsync: !0, result: void 0 })
													),
													this.eventHub.emit(b.ACTION_END, l),
													p
												)
											)
											.catch(p => {
												throw (
													((l.isRunning = !1),
													i || c.dispose(),
													this.eventHub.emit(
														b.OPERATOR_END,
														Object.assign(Object.assign({}, l), { isAsync: !0, result: void 0, error: p.message })
													),
													this.eventHub.emit(b.ACTION_END, l),
													p)
												)
											})))
									: ((l.isRunning = !1),
									  i || c.dispose(),
									  this.eventHub.emit(
											b.OPERATOR_END,
											Object.assign(Object.assign({}, l), { isAsync: !1, result: void 0 })
									  ),
									  this.eventHub.emit(b.ACTION_END, l)),
								f
							)
						} catch (h) {
							throw (
								(this.eventHub.emit(
									b.OPERATOR_END,
									Object.assign(Object.assign({}, l), { isAsync: !1, result: void 0, error: h.message })
								),
								this.eventHub.emit(b.ACTION_END, l),
								h)
							)
						}
					}
				}
			)
		}
		trackEffects(e = {}, n) {
			return M === 'production'
				? e
				: ze(this.effects, s => {
						let r
						try {
							this.mode.mode === le
								? (r = this.mode.options.effectsCallback(s))
								: (this.eventHub.emit(
										b.EFFECT,
										Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !0, error: !1 })
								  ),
								  (r = s.func.apply(this, s.args)))
						} catch (i) {
							throw (
								(this.eventHub.emit(
									b.EFFECT,
									Object.assign(Object.assign(Object.assign({}, n), s), {
										args: s.args,
										isPending: !1,
										error: i.message,
									})
								),
								i)
							)
						}
						return We(r)
							? (this.eventHub.emit(
									b.EFFECT,
									Object.assign(Object.assign(Object.assign({}, n), s), { args: s.args, isPending: !0, error: !1 })
							  ),
							  r
									.then(
										i => (
											this.eventHub.emit(
												b.EFFECT,
												Object.assign(Object.assign(Object.assign({}, n), s), {
													args: s.args,
													result: i,
													isPending: !1,
													error: !1,
												})
											),
											i
										)
									)
									.catch(i => {
										throw (
											(this.eventHub.emit(
												b.EFFECT,
												Object.assign(Object.assign(Object.assign({}, n), s), {
													args: s.args,
													isPending: !1,
													error: i && i.message,
												})
											),
											i)
										)
									}))
							: (this.eventHub.emit(
									b.EFFECT,
									Object.assign(Object.assign(Object.assign({}, n), s), {
										args: s.args,
										result: r,
										isPending: !1,
										error: !1,
									})
							  ),
							  r)
				  })
		}
		initializeDevtools(e, n, s, r, i) {
			if (M === 'production') return
			const o = new zt(n)
			o.connect(e, l => {
				switch (l.type) {
					case 'refresh': {
						location.reload()
						break
					}
					case 'executeAction': {
						const c = l.data.name.split('.').reduce((u, a) => u[a], this.actions)
						l.data.payload ? c(JSON.parse(l.data.payload)) : c()
						break
					}
					case 'mutation': {
						const c = this.proxyStateTreeInstance.getMutationTree(),
							u = l.data.path.slice(),
							a = JSON.parse(`{ "value": ${l.data.value} }`).value,
							h = u.pop(),
							f = u.reduce((p, y) => p[y], c.state)
						;(f[h] = a),
							c.flush(!0),
							c.dispose(),
							this.devtools.send({ type: 'state', data: { path: l.data.path, value: a } })
						break
					}
				}
			})
			for (const l in b)
				s.on(
					b[l],
					(c => u => {
						o.send({ type: b[l], data: u }),
							c === b.MUTATIONS &&
								u.mutations.forEach(a => {
									const h = a.path.split(this.delimiter).reduce((f, p) => f[p], this.proxyStateTreeInstance.state)
									K(h)
										? Object.keys(h).forEach(f => h[f])
										: Array.isArray(h) &&
										  h.forEach(f => {
												K(f) && Object.keys(f).forEach(p => f[p])
										  })
								}),
							c === b.DERIVED_DIRTY && u.derivedPath.reduce((a, h) => a[h], this.proxyStateTreeInstance.state)
					})(b[l])
				)
			o.send({
				type: 'init',
				data: { state: this.proxyStateTreeInstance.state, actions: ve(i), delimiter: this.delimiter },
			}),
				(this.devtools = o)
		}
		getState(e) {
			let n = {}
			return e.state && (n = Ee(e.state)), n
		}
		getActions(e = {}, n = []) {
			return Object.keys(e).reduce((s, r) => {
				if (typeof e[r] == 'function') {
					const i = this.createAction(n.concat(r).join('.'), e[r])
					return (i.displayName = n.concat(r).join('.')), Object.assign(s, { [r]: i })
				}
				return Object.assign(s, { [r]: this.getActions(e[r], n.concat(r)) })
			}, {})
		}
		updateActions(e = {}, n = []) {
			Object.keys(e).forEach(s => {
				if (typeof e[s] == 'function') {
					const r = n.concat(s).join('.')
					if (this.actionReferences[r]) this.actionReferences[r] = e[s]
					else {
						const i = n.reduce((o, l) => (o[l] || (o[l] = {}), o[l]), this.actions)
						;(i[s] = this.createAction(r, e[s])), (i[s].displayName = n.concat(s).join('.'))
					}
				} else this.updateActions(e[s], n.concat(s))
			}, {})
		}
		getTrackStateTree() {
			return this.proxyStateTreeInstance.getTrackStateTree()
		}
		getMutationTree() {
			return this.proxyStateTreeInstance.getMutationTree()
		}
		reconfigure(e) {
			const n = Xe(this.originalConfiguration.state, e.state || {})
			this.updateActions(e.actions), (this.effects = e.effects || {})
			const s = this.proxyStateTreeInstance.getMutationTree()
			return (
				Ye(s.state, n),
				this.reydrateMutationsForHotReloading.forEach(r => {
					try {
						Ye(s.state, [r])
					} catch {}
				}),
				s.flush(),
				s.dispose(),
				this.devtools && this.devtools.send({ type: 're_init', data: { state: this.state, actions: ve(e.actions) } }),
				this
			)
		}
	}
	const en = t => ((t[ge] = !0), t)
	function tn(t, e) {
		return new Zt(t, e, { mode: H })
	}
	const C = Symbol('OVERMIND'),
		Ze = M === 'production'
	let nn = 0
	function sn(t, e, n = !1) {
		const s = nn++
		let r = 0
		return Object.assign(
			Object.assign(
				{
					beforeCreate() {
						t.mode.mode === V
							? ((this.overmind = {
									state: t.state,
									actions: t.actions,
									effects: t.effects,
									addMutationListener: t.addMutationListener,
									reaction: t.reaction,
							  }),
							  e && Object.assign(this, e({ state: t.state, actions: t.actions, effects: t.effects })))
							: ((this[C] = {
									tree: t.proxyStateTreeInstance.getTrackStateTree(),
									componentInstanceId: r++,
									onUpdate: (i, o, l) => {
										;(this[C].currentFlushId = l), (this[C].isUpdating = !0), this.$forceUpdate()
									},
									isUpdating: !1,
							  }),
							  (this.overmind = {
									state: this[C].tree.state,
									actions: t.actions,
									effects: t.effects,
									addMutationListener: t.addMutationListener,
									reaction: t.reaction,
							  }),
							  this[C].tree.track(this[C].onUpdate),
							  e && Object.assign(this, e({ state: this[C].tree.state, actions: t.actions, effects: t.effects })))
					},
					beforeUpdate() {
						t.mode.mode !== V &&
							(this[C].tree.track(this[C].onUpdate),
							e && n && Object.assign(this, e({ state: this[C].tree.state, actions: t.actions, effects: t.effects })))
					},
				},
				Ze
					? {
							updated() {
								this[C].tree.stopTracking()
							},
					  }
					: {
							mounted() {
								t.mode.mode !== V &&
									t.eventHub.emitAsync(b.COMPONENT_ADD, {
										componentId: s,
										componentInstanceId: this[C].componentInstanceId,
										name: this.$options.name || '',
										paths: Array.from(this[C].tree.pathDependencies),
									})
							},
							updated() {
								t.mode.mode !== V &&
									(this[C].tree.stopTracking(),
									this[C].isUpdating &&
										(t.eventHub.emitAsync(b.COMPONENT_UPDATE, {
											componentId: s,
											componentInstanceId: this[C].componentInstanceId,
											name: this.$options.name || '',
											flushId: this[C].currentFlushId,
											paths: Array.from(this[C].tree.pathDependencies),
										}),
										(this[C].isUpdating = !1)))
							},
					  }
			),
			{
				beforeDestroy() {
					t.mode.mode !== V &&
						(t.proxyStateTreeInstance.disposeTree(this[C].tree),
						!Ze &&
							t.eventHub.emitAsync(b.COMPONENT_REMOVE, {
								componentId: s,
								componentInstanceId: this[C].componentInstanceId,
								name: this.$options.name || '',
							}))
				},
			}
		)
	}
	const rn = t => ({
		install(e, n = ({ state: s, actions: r, effects: i }) => ({ state: s, actions: r, effects: i })) {
			e.mixin(sn(t, n))
		},
	})
	en((t, e) => {
		let n = []
		return (
			e.route.view == 'login' ||
				(e.route.doctype && n.push({ title: e.route.doctype, to: `/${e.route.doctype}` }),
				e.route.document && n.push({ title: e.route.document, to: `/${e.route.doctype}/${e.route.document}` })),
			n
		)
	})
	function on() {
		return et().__VUE_DEVTOOLS_GLOBAL_HOOK__
	}
	function et() {
		return typeof navigator < 'u' ? window : typeof global < 'u' ? global : {}
	}
	const an = 'devtools-plugin:setup'
	function cn(t, e) {
		const n = on()
		if (n) n.emit(an, t, e)
		else {
			const s = et()
			;(s.__VUE_DEVTOOLS_PLUGINS__ = s.__VUE_DEVTOOLS_PLUGINS__ || []).push({ pluginDescriptor: t, setupFn: e })
		}
	}
	/*!
	 * vue-router v4.0.10
	 * (c) 2021 Eduardo San Martin Morote
	 * @license MIT
	 */ const tt = typeof Symbol == 'function' && typeof Symbol.toStringTag == 'symbol',
		J = t =>
			tt
				? Symbol(process.env.NODE_ENV !== 'production' ? '[vue-router]: ' + t : t)
				: (process.env.NODE_ENV !== 'production' ? '[vue-router]: ' : '_vr_') + t,
		un = J(process.env.NODE_ENV !== 'production' ? 'router view location matched' : 'rvlm'),
		nt = J(process.env.NODE_ENV !== 'production' ? 'router view depth' : 'rvd'),
		Oe = J(process.env.NODE_ENV !== 'production' ? 'router' : 'r'),
		st = J(process.env.NODE_ENV !== 'production' ? 'route location' : 'rl'),
		Te = J(process.env.NODE_ENV !== 'production' ? 'router view location' : 'rvl'),
		F = typeof window < 'u'
	function ln(t) {
		return t.__esModule || (tt && t[Symbol.toStringTag] === 'Module')
	}
	const w = Object.assign
	function _e(t, e) {
		const n = {}
		for (const s in e) {
			const r = e[s]
			n[s] = Array.isArray(r) ? r.map(t) : t(r)
		}
		return n
	}
	let te = () => {}
	function R(t) {
		const e = Array.from(arguments).slice(1)
		console.warn.apply(console, ['[Vue Router warn]: ' + t].concat(e))
	}
	const hn = /\/$/,
		fn = t => t.replace(hn, '')
	function Se(t, e, n = '/') {
		let s,
			r = {},
			i = '',
			o = ''
		const l = e.indexOf('?'),
			c = e.indexOf('#', l > -1 ? l : 0)
		return (
			l > -1 && ((s = e.slice(0, l)), (i = e.slice(l + 1, c > -1 ? c : e.length)), (r = t(i))),
			c > -1 && ((s = s || e.slice(0, c)), (o = e.slice(c, e.length))),
			(s = mn(s != null ? s : e, n)),
			{ fullPath: s + (i && '?') + i + o, path: s, query: r, hash: o }
		)
	}
	function dn(t, e) {
		let n = e.query ? t(e.query) : ''
		return e.path + (n && '?') + n + (e.hash || '')
	}
	function rt(t, e) {
		return !e || !t.toLowerCase().startsWith(e.toLowerCase()) ? t : t.slice(e.length) || '/'
	}
	function it(t, e, n) {
		let s = e.matched.length - 1,
			r = n.matched.length - 1
		return (
			s > -1 &&
			s === r &&
			U(e.matched[s], n.matched[r]) &&
			ot(e.params, n.params) &&
			t(e.query) === t(n.query) &&
			e.hash === n.hash
		)
	}
	function U(t, e) {
		return (t.aliasOf || t) === (e.aliasOf || e)
	}
	function ot(t, e) {
		if (Object.keys(t).length !== Object.keys(e).length) return !1
		for (let n in t) if (!pn(t[n], e[n])) return !1
		return !0
	}
	function pn(t, e) {
		return Array.isArray(t) ? at(t, e) : Array.isArray(e) ? at(e, t) : t === e
	}
	function at(t, e) {
		return Array.isArray(e) ? t.length === e.length && t.every((n, s) => n === e[s]) : t.length === 1 && t[0] === e
	}
	function mn(t, e) {
		if (t.startsWith('/')) return t
		if (process.env.NODE_ENV !== 'production' && !e.startsWith('/'))
			return (
				R(
					`Cannot resolve a relative location without an absolute path. Trying to resolve "${t}" from "${e}". It should look like "/${e}".`
				),
				t
			)
		if (!t) return e
		const n = e.split('/'),
			s = t.split('/')
		let r = n.length - 1,
			i,
			o
		for (i = 0; i < s.length; i++)
			if (((o = s[i]), !(r === 1 || o === '.')))
				if (o === '..') r--
				else break
		return n.slice(0, r).join('/') + '/' + s.slice(i - (i === s.length ? 1 : 0)).join('/')
	}
	var ne
	;(function (t) {
		;(t.pop = 'pop'), (t.push = 'push')
	})(ne || (ne = {}))
	var se
	;(function (t) {
		;(t.back = 'back'), (t.forward = 'forward'), (t.unknown = '')
	})(se || (se = {}))
	function gn(t) {
		if (!t)
			if (F) {
				const e = document.querySelector('base')
				;(t = (e && e.getAttribute('href')) || '/'), (t = t.replace(/^\w+:\/\/[^\/]+/, ''))
			} else t = '/'
		return t[0] !== '/' && t[0] !== '#' && (t = '/' + t), fn(t)
	}
	const yn = /^[^#]+#/
	function En(t, e) {
		return t.replace(yn, '#') + e
	}
	function vn(t, e) {
		const n = document.documentElement.getBoundingClientRect(),
			s = t.getBoundingClientRect()
		return { behavior: e.behavior, left: s.left - n.left - (e.left || 0), top: s.top - n.top - (e.top || 0) }
	}
	const he = () => ({ left: window.pageXOffset, top: window.pageYOffset })
	function bn(t) {
		let e
		if ('el' in t) {
			let n = t.el
			const s = typeof n == 'string' && n.startsWith('#')
			if (
				process.env.NODE_ENV !== 'production' &&
				typeof t.el == 'string' &&
				(!s || !document.getElementById(t.el.slice(1)))
			)
				try {
					let i = document.querySelector(t.el)
					if (s && i) {
						R(
							`The selector "${t.el}" should be passed as "el: document.querySelector('${t.el}')" because it starts with "#".`
						)
						return
					}
				} catch {
					R(
						`The selector "${t.el}" is invalid. If you are using an id selector, make sure to escape it. You can find more information about escaping characters in selectors at https://mathiasbynens.be/notes/css-escapes or use CSS.escape (https://developer.mozilla.org/en-US/docs/Web/API/CSS/escape).`
					)
					return
				}
			const r = typeof n == 'string' ? (s ? document.getElementById(n.slice(1)) : document.querySelector(n)) : n
			if (!r) {
				process.env.NODE_ENV !== 'production' &&
					R(`Couldn't find element using selector "${t.el}" returned by scrollBehavior.`)
				return
			}
			e = vn(r, t)
		} else e = t
		'scrollBehavior' in document.documentElement.style
			? window.scrollTo(e)
			: window.scrollTo(e.left != null ? e.left : window.pageXOffset, e.top != null ? e.top : window.pageYOffset)
	}
	function ct(t, e) {
		return (history.state ? history.state.position - e : -1) + t
	}
	const Re = new Map()
	function On(t, e) {
		Re.set(t, e)
	}
	function Tn(t) {
		const e = Re.get(t)
		return Re.delete(t), e
	}
	let _n = () => location.protocol + '//' + location.host
	function ut(t, e) {
		const { pathname: n, search: s, hash: r } = e,
			i = t.indexOf('#')
		if (i > -1) {
			let l = r.includes(t.slice(i)) ? t.slice(i).length : 1,
				c = r.slice(l)
			return c[0] !== '/' && (c = '/' + c), rt(c, '')
		}
		return rt(n, t) + s + r
	}
	function Sn(t, e, n, s) {
		let r = [],
			i = [],
			o = null
		const l = ({ state: f }) => {
			const p = ut(t, location),
				y = n.value,
				N = e.value
			let A = 0
			if (f) {
				if (((n.value = p), (e.value = f), o && o === y)) {
					o = null
					return
				}
				A = N ? f.position - N.position : 0
			} else s(p)
			r.forEach(T => {
				T(n.value, y, { delta: A, type: ne.pop, direction: A ? (A > 0 ? se.forward : se.back) : se.unknown })
			})
		}
		function c() {
			o = n.value
		}
		function u(f) {
			r.push(f)
			const p = () => {
				const y = r.indexOf(f)
				y > -1 && r.splice(y, 1)
			}
			return i.push(p), p
		}
		function a() {
			const { history: f } = window
			!f.state || f.replaceState(w({}, f.state, { scroll: he() }), '')
		}
		function h() {
			for (const f of i) f()
			;(i = []), window.removeEventListener('popstate', l), window.removeEventListener('beforeunload', a)
		}
		return (
			window.addEventListener('popstate', l),
			window.addEventListener('beforeunload', a),
			{ pauseListeners: c, listen: u, destroy: h }
		)
	}
	function lt(t, e, n, s = !1, r = !1) {
		return { back: t, current: e, forward: n, replaced: s, position: window.history.length, scroll: r ? he() : null }
	}
	function Rn(t) {
		const { history: e, location: n } = window
		let s = { value: ut(t, n) },
			r = { value: e.state }
		r.value ||
			i(
				s.value,
				{ back: null, current: s.value, forward: null, position: e.length - 1, replaced: !0, scroll: null },
				!0
			)
		function i(c, u, a) {
			const h = t.indexOf('#'),
				f = h > -1 ? (n.host && document.querySelector('base') ? t : t.slice(h)) + c : _n() + t + c
			try {
				e[a ? 'replaceState' : 'pushState'](u, '', f), (r.value = u)
			} catch (p) {
				process.env.NODE_ENV !== 'production' ? R('Error with push/replace State', p) : console.error(p),
					n[a ? 'replace' : 'assign'](f)
			}
		}
		function o(c, u) {
			const a = w({}, e.state, lt(r.value.back, c, r.value.forward, !0), u, { position: r.value.position })
			i(c, a, !0), (s.value = c)
		}
		function l(c, u) {
			const a = w({}, r.value, e.state, { forward: c, scroll: he() })
			process.env.NODE_ENV !== 'production' &&
				!e.state &&
				R(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:

history.replaceState(history.state, '', url)

You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`),
				i(a.current, a, !0)
			const h = w({}, lt(s.value, c, null), { position: a.position + 1 }, u)
			i(c, h, !1), (s.value = c)
		}
		return { location: s, state: r, push: l, replace: o }
	}
	function Pn(t) {
		t = gn(t)
		const e = Rn(t),
			n = Sn(t, e.state, e.location, e.replace)
		function s(i, o = !0) {
			o || n.pauseListeners(), history.go(i)
		}
		const r = w({ location: '', base: t, go: s, createHref: En.bind(null, t) }, e, n)
		return (
			Object.defineProperty(r, 'location', { enumerable: !0, get: () => e.location.value }),
			Object.defineProperty(r, 'state', { enumerable: !0, get: () => e.state.value }),
			r
		)
	}
	function wn(t) {
		return typeof t == 'string' || (t && typeof t == 'object')
	}
	function ht(t) {
		return typeof t == 'string' || typeof t == 'symbol'
	}
	const W = {
			path: '/',
			name: void 0,
			params: {},
			query: {},
			hash: '',
			fullPath: '/',
			matched: [],
			meta: {},
			redirectedFrom: void 0,
		},
		Pe = J(process.env.NODE_ENV !== 'production' ? 'navigation failure' : 'nf')
	var ft
	;(function (t) {
		;(t[(t.aborted = 4)] = 'aborted'), (t[(t.cancelled = 8)] = 'cancelled'), (t[(t.duplicated = 16)] = 'duplicated')
	})(ft || (ft = {}))
	const Nn = {
		[1]({ location: t, currentLocation: e }) {
			return `No match for
 ${JSON.stringify(t)}${
				e
					? `
while being at
` + JSON.stringify(e)
					: ''
			}`
		},
		[2]({ from: t, to: e }) {
			return `Redirected from "${t.fullPath}" to "${Cn(e)}" via a navigation guard.`
		},
		[4]({ from: t, to: e }) {
			return `Navigation aborted from "${t.fullPath}" to "${e.fullPath}" via a navigation guard.`
		},
		[8]({ from: t, to: e }) {
			return `Navigation cancelled from "${t.fullPath}" to "${e.fullPath}" with a new navigation.`
		},
		[16]({ from: t, to: e }) {
			return `Avoided redundant navigation to current location: "${t.fullPath}".`
		},
	}
	function Z(t, e) {
		return process.env.NODE_ENV !== 'production'
			? w(new Error(Nn[t](e)), { type: t, [Pe]: !0 }, e)
			: w(new Error(), { type: t, [Pe]: !0 }, e)
	}
	function q(t, e) {
		return t instanceof Error && Pe in t && (e == null || !!(t.type & e))
	}
	const An = ['params', 'query', 'hash']
	function Cn(t) {
		if (typeof t == 'string') return t
		if ('path' in t) return t.path
		const e = {}
		for (const n of An) n in t && (e[n] = t[n])
		return JSON.stringify(e, null, 2)
	}
	const dt = '[^/]+?',
		In = { sensitive: !1, strict: !1, start: !0, end: !0 },
		kn = /[.+*?^${}()[\]/\\]/g
	function xn(t, e) {
		const n = w({}, In, e)
		let s = [],
			r = n.start ? '^' : ''
		const i = []
		for (const u of t) {
			const a = u.length ? [] : [90]
			n.strict && !u.length && (r += '/')
			for (let h = 0; h < u.length; h++) {
				const f = u[h]
				let p = 40 + (n.sensitive ? 0.25 : 0)
				if (f.type === 0) h || (r += '/'), (r += f.value.replace(kn, '\\$&')), (p += 40)
				else if (f.type === 1) {
					const { value: y, repeatable: N, optional: A, regexp: T } = f
					i.push({ name: y, repeatable: N, optional: A })
					const _ = T || dt
					if (_ !== dt) {
						p += 10
						try {
							new RegExp(`(${_})`)
						} catch (D) {
							throw new Error(`Invalid custom RegExp for param "${y}" (${_}): ` + D.message)
						}
					}
					let x = N ? `((?:${_})(?:/(?:${_}))*)` : `(${_})`
					h || (x = A && u.length < 2 ? `(?:/${x})` : '/' + x),
						A && (x += '?'),
						(r += x),
						(p += 20),
						A && (p += -8),
						N && (p += -20),
						_ === '.*' && (p += -50)
				}
				a.push(p)
			}
			s.push(a)
		}
		if (n.strict && n.end) {
			const u = s.length - 1
			s[u][s[u].length - 1] += 0.7000000000000001
		}
		n.strict || (r += '/?'), n.end ? (r += '$') : n.strict && (r += '(?:/|$)')
		const o = new RegExp(r, n.sensitive ? '' : 'i')
		function l(u) {
			const a = u.match(o),
				h = {}
			if (!a) return null
			for (let f = 1; f < a.length; f++) {
				const p = a[f] || '',
					y = i[f - 1]
				h[y.name] = p && y.repeatable ? p.split('/') : p
			}
			return h
		}
		function c(u) {
			let a = '',
				h = !1
			for (const f of t) {
				;(!h || !a.endsWith('/')) && (a += '/'), (h = !1)
				for (const p of f)
					if (p.type === 0) a += p.value
					else if (p.type === 1) {
						const { value: y, repeatable: N, optional: A } = p,
							T = y in u ? u[y] : ''
						if (Array.isArray(T) && !N)
							throw new Error(`Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`)
						const _ = Array.isArray(T) ? T.join('/') : T
						if (!_)
							if (A) f.length < 2 && (a.endsWith('/') ? (a = a.slice(0, -1)) : (h = !0))
							else throw new Error(`Missing required param "${y}"`)
						a += _
					}
			}
			return a
		}
		return { re: o, score: s, keys: i, parse: l, stringify: c }
	}
	function Dn(t, e) {
		let n = 0
		for (; n < t.length && n < e.length; ) {
			const s = e[n] - t[n]
			if (s) return s
			n++
		}
		return t.length < e.length
			? t.length === 1 && t[0] === 40 + 40
				? -1
				: 1
			: t.length > e.length
			? e.length === 1 && e[0] === 40 + 40
				? 1
				: -1
			: 0
	}
	function jn(t, e) {
		let n = 0
		const s = t.score,
			r = e.score
		for (; n < s.length && n < r.length; ) {
			const i = Dn(s[n], r[n])
			if (i) return i
			n++
		}
		return r.length - s.length
	}
	const Mn = { type: 0, value: '' },
		$n = /[a-zA-Z0-9_]/
	function Vn(t) {
		if (!t) return [[]]
		if (t === '/') return [[Mn]]
		if (!t.startsWith('/'))
			throw new Error(
				process.env.NODE_ENV !== 'production'
					? `Route paths should start with a "/": "${t}" should be "/${t}".`
					: `Invalid path "${t}"`
			)
		function e(p) {
			throw new Error(`ERR (${n})/"${u}": ${p}`)
		}
		let n = 0,
			s = n
		const r = []
		let i
		function o() {
			i && r.push(i), (i = [])
		}
		let l = 0,
			c,
			u = '',
			a = ''
		function h() {
			!u ||
				(n === 0
					? i.push({ type: 0, value: u })
					: n === 1 || n === 2 || n === 3
					? (i.length > 1 &&
							(c === '*' || c === '+') &&
							e(`A repeatable param (${u}) must be alone in its segment. eg: '/:ids+.`),
					  i.push({
							type: 1,
							value: u,
							regexp: a,
							repeatable: c === '*' || c === '+',
							optional: c === '*' || c === '?',
					  }))
					: e('Invalid state to consume buffer'),
				(u = ''))
		}
		function f() {
			u += c
		}
		for (; l < t.length; ) {
			if (((c = t[l++]), c === '\\' && n !== 2)) {
				;(s = n), (n = 4)
				continue
			}
			switch (n) {
				case 0:
					c === '/' ? (u && h(), o()) : c === ':' ? (h(), (n = 1)) : f()
					break
				case 4:
					f(), (n = s)
					break
				case 1:
					c === '(' ? (n = 2) : $n.test(c) ? f() : (h(), (n = 0), c !== '*' && c !== '?' && c !== '+' && l--)
					break
				case 2:
					c === ')' ? (a[a.length - 1] == '\\' ? (a = a.slice(0, -1) + c) : (n = 3)) : (a += c)
					break
				case 3:
					h(), (n = 0), c !== '*' && c !== '?' && c !== '+' && l--, (a = '')
					break
				default:
					e('Unknown state')
					break
			}
		}
		return n === 2 && e(`Unfinished custom RegExp for param "${u}"`), h(), o(), r
	}
	function Ln(t, e, n) {
		const s = xn(Vn(t.path), n)
		if (process.env.NODE_ENV !== 'production') {
			const i = new Set()
			for (const o of s.keys)
				i.has(o.name) &&
					R(
						`Found duplicated params with name "${o.name}" for path "${t.path}". Only the last one will be available on "$route.params".`
					),
					i.add(o.name)
		}
		const r = w(s, { record: t, parent: e, children: [], alias: [] })
		return e && !r.record.aliasOf == !e.record.aliasOf && e.children.push(r), r
	}
	function Hn(t, e) {
		const n = [],
			s = new Map()
		e = mt({ strict: !1, end: !0, sensitive: !1 }, e)
		function r(a) {
			return s.get(a)
		}
		function i(a, h, f) {
			let p = !f,
				y = Un(a)
			y.aliasOf = f && f.record
			const N = mt(e, a),
				A = [y]
			if ('alias' in a) {
				const x = typeof a.alias == 'string' ? [a.alias] : a.alias
				for (const D of x)
					A.push(w({}, y, { components: f ? f.record.components : y.components, path: D, aliasOf: f ? f.record : y }))
			}
			let T, _
			for (const x of A) {
				let { path: D } = x
				if (h && D[0] !== '/') {
					let X = h.record.path,
						L = X[X.length - 1] === '/' ? '' : '/'
					x.path = h.record.path + (D && L + D)
				}
				if (process.env.NODE_ENV !== 'production' && x.path === '*')
					throw new Error(`Catch all routes ("*") must now be defined using a param with a custom regexp.
See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.`)
				if (
					((T = Ln(x, h, N)),
					process.env.NODE_ENV !== 'production' && h && D[0] === '/' && zn(T, h),
					f
						? (f.alias.push(T), process.env.NODE_ENV !== 'production' && Gn(f, T))
						: ((_ = _ || T), _ !== T && _.alias.push(T), p && a.name && !pt(T) && o(a.name)),
					'children' in y)
				) {
					let X = y.children
					for (let L = 0; L < X.length; L++) i(X[L], T, f && f.children[L])
				}
				;(f = f || T), c(T)
			}
			return _
				? () => {
						o(_)
				  }
				: te
		}
		function o(a) {
			if (ht(a)) {
				const h = s.get(a)
				h && (s.delete(a), n.splice(n.indexOf(h), 1), h.children.forEach(o), h.alias.forEach(o))
			} else {
				let h = n.indexOf(a)
				h > -1 && (n.splice(h, 1), a.record.name && s.delete(a.record.name), a.children.forEach(o), a.alias.forEach(o))
			}
		}
		function l() {
			return n
		}
		function c(a) {
			let h = 0
			for (; h < n.length && jn(a, n[h]) >= 0; ) h++
			n.splice(h, 0, a), a.record.name && !pt(a) && s.set(a.record.name, a)
		}
		function u(a, h) {
			let f,
				p = {},
				y,
				N
			if ('name' in a && a.name) {
				if (((f = s.get(a.name)), !f)) throw Z(1, { location: a })
				;(N = f.record.name),
					(p = w(
						Fn(
							h.params,
							f.keys.filter(_ => !_.optional).map(_ => _.name)
						),
						a.params
					)),
					(y = f.stringify(p))
			} else if ('path' in a)
				(y = a.path),
					process.env.NODE_ENV !== 'production' &&
						!y.startsWith('/') &&
						R(
							`The Matcher cannot resolve relative paths but received "${y}". Unless you directly called \`matcher.resolve("${y}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/vue-router-next.`
						),
					(f = n.find(_ => _.re.test(y))),
					f && ((p = f.parse(y)), (N = f.record.name))
			else {
				if (((f = h.name ? s.get(h.name) : n.find(_ => _.re.test(h.path))), !f))
					throw Z(1, { location: a, currentLocation: h })
				;(N = f.record.name), (p = w({}, h.params, a.params)), (y = f.stringify(p))
			}
			const A = []
			let T = f
			for (; T; ) A.unshift(T.record), (T = T.parent)
			return { name: N, path: y, params: p, matched: A, meta: Bn(A) }
		}
		return t.forEach(a => i(a)), { addRoute: i, resolve: u, removeRoute: o, getRoutes: l, getRecordMatcher: r }
	}
	function Fn(t, e) {
		let n = {}
		for (let s of e) s in t && (n[s] = t[s])
		return n
	}
	function Un(t) {
		return {
			path: t.path,
			redirect: t.redirect,
			name: t.name,
			meta: t.meta || {},
			aliasOf: void 0,
			beforeEnter: t.beforeEnter,
			props: Yn(t),
			children: t.children || [],
			instances: {},
			leaveGuards: new Set(),
			updateGuards: new Set(),
			enterCallbacks: {},
			components: 'components' in t ? t.components || {} : { default: t.component },
		}
	}
	function Yn(t) {
		const e = {},
			n = t.props || !1
		if ('component' in t) e.default = n
		else for (let s in t.components) e[s] = typeof n == 'boolean' ? n : n[s]
		return e
	}
	function pt(t) {
		for (; t; ) {
			if (t.record.aliasOf) return !0
			t = t.parent
		}
		return !1
	}
	function Bn(t) {
		return t.reduce((e, n) => w(e, n.meta), {})
	}
	function mt(t, e) {
		let n = {}
		for (let s in t) n[s] = s in e ? e[s] : t[s]
		return n
	}
	function we(t, e) {
		return t.name === e.name && t.optional === e.optional && t.repeatable === e.repeatable
	}
	function Gn(t, e) {
		for (let n of t.keys)
			if (!n.optional && !e.keys.find(we.bind(null, n)))
				return R(
					`Alias "${e.record.path}" and the original record: "${t.record.path}" should have the exact same param named "${n.name}"`
				)
		for (let n of e.keys)
			if (!n.optional && !t.keys.find(we.bind(null, n)))
				return R(
					`Alias "${e.record.path}" and the original record: "${t.record.path}" should have the exact same param named "${n.name}"`
				)
	}
	function zn(t, e) {
		for (let n of e.keys)
			if (!t.keys.find(we.bind(null, n)))
				return R(
					`Absolute path "${t.record.path}" should have the exact same param named "${n.name}" as its parent "${e.record.path}".`
				)
	}
	const gt = /#/g,
		Kn = /&/g,
		Wn = /\//g,
		qn = /=/g,
		Xn = /\?/g,
		yt = /\+/g,
		Qn = /%5B/g,
		Jn = /%5D/g,
		Et = /%5E/g,
		Zn = /%60/g,
		vt = /%7B/g,
		es = /%7C/g,
		bt = /%7D/g,
		ts = /%20/g
	function Ne(t) {
		return encodeURI('' + t)
			.replace(es, '|')
			.replace(Qn, '[')
			.replace(Jn, ']')
	}
	function ns(t) {
		return Ne(t).replace(vt, '{').replace(bt, '}').replace(Et, '^')
	}
	function Ae(t) {
		return Ne(t)
			.replace(yt, '%2B')
			.replace(ts, '+')
			.replace(gt, '%23')
			.replace(Kn, '%26')
			.replace(Zn, '`')
			.replace(vt, '{')
			.replace(bt, '}')
			.replace(Et, '^')
	}
	function ss(t) {
		return Ae(t).replace(qn, '%3D')
	}
	function rs(t) {
		return Ne(t).replace(gt, '%23').replace(Xn, '%3F')
	}
	function is(t) {
		return rs(t).replace(Wn, '%2F')
	}
	function re(t) {
		try {
			return decodeURIComponent('' + t)
		} catch {
			process.env.NODE_ENV !== 'production' && R(`Error decoding "${t}". Using original value`)
		}
		return '' + t
	}
	function os(t) {
		const e = {}
		if (t === '' || t === '?') return e
		const s = (t[0] === '?' ? t.slice(1) : t).split('&')
		for (let r = 0; r < s.length; ++r) {
			const i = s[r].replace(yt, ' ')
			let o = i.indexOf('='),
				l = re(o < 0 ? i : i.slice(0, o)),
				c = o < 0 ? null : re(i.slice(o + 1))
			if (l in e) {
				let u = e[l]
				Array.isArray(u) || (u = e[l] = [u]), u.push(c)
			} else e[l] = c
		}
		return e
	}
	function Ot(t) {
		let e = ''
		for (let n in t) {
			const s = t[n]
			if (((n = ss(n)), s == null)) {
				s !== void 0 && (e += (e.length ? '&' : '') + n)
				continue
			}
			;(Array.isArray(s) ? s.map(i => i && Ae(i)) : [s && Ae(s)]).forEach(i => {
				i !== void 0 && ((e += (e.length ? '&' : '') + n), i != null && (e += '=' + i))
			})
		}
		return e
	}
	function as(t) {
		const e = {}
		for (let n in t) {
			let s = t[n]
			s !== void 0 && (e[n] = Array.isArray(s) ? s.map(r => (r == null ? null : '' + r)) : s == null ? s : '' + s)
		}
		return e
	}
	function ie() {
		let t = []
		function e(s) {
			return (
				t.push(s),
				() => {
					const r = t.indexOf(s)
					r > -1 && t.splice(r, 1)
				}
			)
		}
		function n() {
			t = []
		}
		return { add: e, list: () => t, reset: n }
	}
	function Y(t, e, n, s, r) {
		const i = s && (s.enterCallbacks[r] = s.enterCallbacks[r] || [])
		return () =>
			new Promise((o, l) => {
				const c = h => {
						h === !1
							? l(Z(4, { from: n, to: e }))
							: h instanceof Error
							? l(h)
							: wn(h)
							? l(Z(2, { from: e, to: h }))
							: (i && s.enterCallbacks[r] === i && typeof h == 'function' && i.push(h), o())
					},
					u = t.call(s && s.instances[r], e, n, process.env.NODE_ENV !== 'production' ? cs(c, e, n) : c)
				let a = Promise.resolve(u)
				if ((t.length < 3 && (a = a.then(c)), process.env.NODE_ENV !== 'production' && t.length > 2)) {
					const h = `The "next" callback was never called inside of ${t.name ? '"' + t.name + '"' : ''}:
${t.toString()}
. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`
					if (typeof u == 'object' && 'then' in u)
						a = a.then(f => (c._called ? f : (R(h), Promise.reject(new Error('Invalid navigation guard')))))
					else if (u !== void 0 && !c._called) {
						R(h), l(new Error('Invalid navigation guard'))
						return
					}
				}
				a.catch(h => l(h))
			})
	}
	function cs(t, e, n) {
		let s = 0
		return function () {
			s++ === 1 &&
				R(
					`The "next" callback was called more than once in one navigation guard when going from "${n.fullPath}" to "${e.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`
				),
				(t._called = !0),
				s === 1 && t.apply(null, arguments)
		}
	}
	function Ce(t, e, n, s) {
		const r = []
		for (const i of t)
			for (const o in i.components) {
				let l = i.components[o]
				if (process.env.NODE_ENV !== 'production') {
					if (!l || (typeof l != 'object' && typeof l != 'function'))
						throw (
							(R(`Component "${o}" in record with path "${i.path}" is not a valid component. Received "${String(l)}".`),
							new Error('Invalid route component'))
						)
					if ('then' in l) {
						R(
							`Component "${o}" in record with path "${i.path}" is a Promise instead of a function that returns a Promise. Did you write "import('./MyPage.vue')" instead of "() => import('./MyPage.vue')" ? This will break in production if not fixed.`
						)
						let c = l
						l = () => c
					} else
						l.__asyncLoader &&
							!l.__warnedDefineAsync &&
							((l.__warnedDefineAsync = !0),
							R(
								`Component "${o}" in record with path "${i.path}" is defined using "defineAsyncComponent()". Write "() => import('./MyPage.vue')" instead of "defineAsyncComponent(() => import('./MyPage.vue'))".`
							))
				}
				if (!(e !== 'beforeRouteEnter' && !i.instances[o]))
					if (us(l)) {
						const u = (l.__vccOpts || l)[e]
						u && r.push(Y(u, n, s, i, o))
					} else {
						let c = l()
						process.env.NODE_ENV !== 'production' &&
							!('catch' in c) &&
							(R(
								`Component "${o}" in record with path "${i.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`
							),
							(c = Promise.resolve(c))),
							r.push(() =>
								c.then(u => {
									if (!u) return Promise.reject(new Error(`Couldn't resolve component "${o}" at "${i.path}"`))
									const a = ln(u) ? u.default : u
									i.components[o] = a
									const f = (a.__vccOpts || a)[e]
									return f && Y(f, n, s, i, o)()
								})
							)
					}
			}
		return r
	}
	function us(t) {
		return typeof t == 'object' || 'displayName' in t || 'props' in t || '__vccOpts' in t
	}
	function Tt(t) {
		const e = v.inject(Oe),
			n = v.inject(st),
			s = v.computed(() => e.resolve(v.unref(t.to))),
			r = v.computed(() => {
				let { matched: c } = s.value,
					{ length: u } = c
				const a = c[u - 1]
				let h = n.matched
				if (!a || !h.length) return -1
				let f = h.findIndex(U.bind(null, a))
				if (f > -1) return f
				let p = _t(c[u - 2])
				return u > 1 && _t(a) === p && h[h.length - 1].path !== p ? h.findIndex(U.bind(null, c[u - 2])) : f
			}),
			i = v.computed(() => r.value > -1 && fs(n.params, s.value.params)),
			o = v.computed(() => r.value > -1 && r.value === n.matched.length - 1 && ot(n.params, s.value.params))
		function l(c = {}) {
			return hs(c) ? e[v.unref(t.replace) ? 'replace' : 'push'](v.unref(t.to)).catch(te) : Promise.resolve()
		}
		if ((process.env.NODE_ENV !== 'production' || !1) && F) {
			const c = v.getCurrentInstance()
			if (c) {
				const u = { route: s.value, isActive: i.value, isExactActive: o.value }
				;(c.__vrl_devtools = c.__vrl_devtools || []),
					c.__vrl_devtools.push(u),
					v.watchEffect(
						() => {
							;(u.route = s.value), (u.isActive = i.value), (u.isExactActive = o.value)
						},
						{ flush: 'post' }
					)
			}
		}
		return { route: s, href: v.computed(() => s.value.href), isActive: i, isExactActive: o, navigate: l }
	}
	const ls = v.defineComponent({
		name: 'RouterLink',
		props: {
			to: { type: [String, Object], required: !0 },
			replace: Boolean,
			activeClass: String,
			exactActiveClass: String,
			custom: Boolean,
			ariaCurrentValue: { type: String, default: 'page' },
		},
		useLink: Tt,
		setup(t, { slots: e }) {
			const n = v.reactive(Tt(t)),
				{ options: s } = v.inject(Oe),
				r = v.computed(() => ({
					[St(t.activeClass, s.linkActiveClass, 'router-link-active')]: n.isActive,
					[St(t.exactActiveClass, s.linkExactActiveClass, 'router-link-exact-active')]: n.isExactActive,
				}))
			return () => {
				const i = e.default && e.default(n)
				return t.custom
					? i
					: v.h(
							'a',
							{
								'aria-current': n.isExactActive ? t.ariaCurrentValue : null,
								href: n.href,
								onClick: n.navigate,
								class: r.value,
							},
							i
					  )
			}
		},
	})
	function hs(t) {
		if (
			!(t.metaKey || t.altKey || t.ctrlKey || t.shiftKey) &&
			!t.defaultPrevented &&
			!(t.button !== void 0 && t.button !== 0)
		) {
			if (t.currentTarget && t.currentTarget.getAttribute) {
				const e = t.currentTarget.getAttribute('target')
				if (/\b_blank\b/i.test(e)) return
			}
			return t.preventDefault && t.preventDefault(), !0
		}
	}
	function fs(t, e) {
		for (let n in e) {
			let s = e[n],
				r = t[n]
			if (typeof s == 'string') {
				if (s !== r) return !1
			} else if (!Array.isArray(r) || r.length !== s.length || s.some((i, o) => i !== r[o])) return !1
		}
		return !0
	}
	function _t(t) {
		return t ? (t.aliasOf ? t.aliasOf.path : t.path) : ''
	}
	const St = (t, e, n) => (t != null ? t : e != null ? e : n),
		ds = v.defineComponent({
			name: 'RouterView',
			inheritAttrs: !1,
			props: { name: { type: String, default: 'default' }, route: Object },
			setup(t, { attrs: e, slots: n }) {
				process.env.NODE_ENV !== 'production' && ms()
				const s = v.inject(Te),
					r = v.computed(() => t.route || s.value),
					i = v.inject(nt, 0),
					o = v.computed(() => r.value.matched[i])
				v.provide(nt, i + 1), v.provide(un, o), v.provide(Te, r)
				const l = v.ref()
				return (
					v.watch(
						() => [l.value, o.value, t.name],
						([c, u, a], [h, f, p]) => {
							u &&
								((u.instances[a] = c),
								f &&
									f !== u &&
									c &&
									c === h &&
									(u.leaveGuards.size || (u.leaveGuards = f.leaveGuards),
									u.updateGuards.size || (u.updateGuards = f.updateGuards))),
								c && u && (!f || !U(u, f) || !h) && (u.enterCallbacks[a] || []).forEach(y => y(c))
						},
						{ flush: 'post' }
					),
					() => {
						const c = r.value,
							u = o.value,
							a = u && u.components[t.name],
							h = t.name
						if (!a) return Rt(n.default, { Component: a, route: c })
						const f = u.props[t.name],
							p = f ? (f === !0 ? c.params : typeof f == 'function' ? f(c) : f) : null,
							y = A => {
								A.component.isUnmounted && (u.instances[h] = null)
							},
							N = v.h(a, w({}, p, e, { onVnodeUnmounted: y, ref: l }))
						return Rt(n.default, { Component: N, route: c }) || N
					}
				)
			},
		})
	function Rt(t, e) {
		if (!t) return null
		const n = t(e)
		return n.length === 1 ? n[0] : n
	}
	const ps = ds
	function ms() {
		const t = v.getCurrentInstance(),
			e = t.parent && t.parent.type.name
		if (e && (e === 'KeepAlive' || e.includes('Transition'))) {
			const n = e === 'KeepAlive' ? 'keep-alive' : 'transition'
			R(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.
Use slot props instead:

<router-view v-slot="{ Component }">
  <${n}>
    <component :is="Component" />
  </${n}>
</router-view>`)
		}
	}
	function oe(t, e) {
		const n = w({}, t, { matched: t.matched.map(s => Rs(s, ['instances', 'children', 'aliasOf'])) })
		return { _custom: { type: null, readOnly: !0, display: t.fullPath, tooltip: e, value: n } }
	}
	function fe(t) {
		return { _custom: { display: t } }
	}
	let gs = 0
	function ys(t, e, n) {
		if (e.__hasDevtools) return
		e.__hasDevtools = !0
		const s = gs++
		cn(
			{
				id: 'org.vuejs.router' + (s ? '.' + s : ''),
				label: 'Vue Router',
				packageName: 'vue-router',
				homepage: 'https://next.router.vuejs.org/',
				logo: 'https://vuejs.org/images/icons/favicon-96x96.png',
				componentStateTypes: ['Routing'],
				app: t,
			},
			r => {
				r.on.inspectComponent((a, h) => {
					a.instanceData &&
						a.instanceData.state.push({
							type: 'Routing',
							key: '$route',
							editable: !1,
							value: oe(e.currentRoute.value, 'Current Route'),
						})
				}),
					r.on.visitComponentTree(({ treeNode: a, componentInstance: h }) => {
						Array.isArray(h.__vrl_devtools) &&
							((h.__devtoolsApi = r),
							h.__vrl_devtools.forEach(f => {
								let p = Nt,
									y = ''
								f.isExactActive
									? ((p = wt), (y = 'This is exactly active'))
									: f.isActive && ((p = Pt), (y = 'This link is active')),
									a.tags.push({ label: f.route.path, textColor: 0, tooltip: y, backgroundColor: p })
							}))
					}),
					v.watch(e.currentRoute, () => {
						c(), r.notifyComponentUpdate(), r.sendInspectorTree(l), r.sendInspectorState(l)
					})
				const i = 'router:navigations:' + s
				r.addTimelineLayer({ id: i, label: `Router${s ? ' ' + s : ''} Navigations`, color: 4237508 }),
					e.onError((a, h) => {
						r.addTimelineEvent({
							layerId: i,
							event: {
								title: 'Error during Navigation',
								subtitle: h.fullPath,
								logType: 'error',
								time: Date.now(),
								data: { error: a },
								groupId: h.meta.__navigationId,
							},
						})
					})
				let o = 0
				e.beforeEach((a, h) => {
					const f = {
						guard: fe('beforeEach'),
						from: oe(h, 'Current Location during this navigation'),
						to: oe(a, 'Target location'),
					}
					Object.defineProperty(a.meta, '__navigationId', { value: o++ }),
						r.addTimelineEvent({
							layerId: i,
							event: {
								time: Date.now(),
								title: 'Start of navigation',
								subtitle: a.fullPath,
								data: f,
								groupId: a.meta.__navigationId,
							},
						})
				}),
					e.afterEach((a, h, f) => {
						const p = { guard: fe('afterEach') }
						f
							? ((p.failure = {
									_custom: {
										type: Error,
										readOnly: !0,
										display: f ? f.message : '',
										tooltip: 'Navigation Failure',
										value: f,
									},
							  }),
							  (p.status = fe('\u274C')))
							: (p.status = fe('\u2705')),
							(p.from = oe(h, 'Current Location during this navigation')),
							(p.to = oe(a, 'Target location')),
							r.addTimelineEvent({
								layerId: i,
								event: {
									title: 'End of navigation',
									subtitle: a.fullPath,
									time: Date.now(),
									data: p,
									logType: f ? 'warning' : 'default',
									groupId: a.meta.__navigationId,
								},
							})
					})
				const l = 'router-inspector:' + s
				r.addInspector({
					id: l,
					label: 'Routes' + (s ? ' ' + s : ''),
					icon: 'book',
					treeFilterPlaceholder: 'Search routes',
				})
				function c() {
					if (!u) return
					const a = u
					let h = n.getRoutes().filter(f => !f.parent)
					h.forEach(It),
						a.filter && (h = h.filter(f => Ie(f, a.filter.toLowerCase()))),
						h.forEach(f => Ct(f, e.currentRoute.value)),
						(a.rootNodes = h.map(At))
				}
				let u
				r.on.getInspectorTree(a => {
					;(u = a), a.app === t && a.inspectorId === l && c()
				}),
					r.on.getInspectorState(a => {
						if (a.app === t && a.inspectorId === l) {
							const f = n.getRoutes().find(p => p.record.__vd_id === a.nodeId)
							f && (a.state = { options: vs(f) })
						}
					}),
					r.sendInspectorTree(l),
					r.sendInspectorState(l)
			}
		)
	}
	function Es(t) {
		return t.optional ? (t.repeatable ? '*' : '?') : t.repeatable ? '+' : ''
	}
	function vs(t) {
		const { record: e } = t,
			n = [{ editable: !1, key: 'path', value: e.path }]
		return (
			e.name != null && n.push({ editable: !1, key: 'name', value: e.name }),
			n.push({ editable: !1, key: 'regexp', value: t.re }),
			t.keys.length &&
				n.push({
					editable: !1,
					key: 'keys',
					value: {
						_custom: {
							type: null,
							readOnly: !0,
							display: t.keys.map(s => `${s.name}${Es(s)}`).join(' '),
							tooltip: 'Param keys',
							value: t.keys,
						},
					},
				}),
			e.redirect != null && n.push({ editable: !1, key: 'redirect', value: e.redirect }),
			t.alias.length && n.push({ editable: !1, key: 'aliases', value: t.alias.map(s => s.record.path) }),
			n.push({
				key: 'score',
				editable: !1,
				value: {
					_custom: {
						type: null,
						readOnly: !0,
						display: t.score.map(s => s.join(', ')).join(' | '),
						tooltip: 'Score used to sort routes',
						value: t.score,
					},
				},
			}),
			n
		)
	}
	const bs = 15485081,
		Pt = 2450411,
		wt = 8702998,
		Os = 2282478,
		Nt = 16486972,
		Ts = 6710886
	function At(t) {
		const e = [],
			{ record: n } = t
		n.name != null && e.push({ label: String(n.name), textColor: 0, backgroundColor: Os }),
			n.aliasOf && e.push({ label: 'alias', textColor: 0, backgroundColor: Nt }),
			t.__vd_match && e.push({ label: 'matches', textColor: 0, backgroundColor: bs }),
			t.__vd_exactActive && e.push({ label: 'exact', textColor: 0, backgroundColor: wt }),
			t.__vd_active && e.push({ label: 'active', textColor: 0, backgroundColor: Pt }),
			n.redirect &&
				e.push({
					label: 'redirect: ' + (typeof n.redirect == 'string' ? n.redirect : 'Object'),
					textColor: 16777215,
					backgroundColor: Ts,
				})
		let s = n.__vd_id
		return (
			s == null && ((s = String(_s++)), (n.__vd_id = s)),
			{ id: s, label: n.path, tags: e, children: t.children.map(At) }
		)
	}
	let _s = 0
	const Ss = /^\/(.*)\/([a-z]*)$/
	function Ct(t, e) {
		const n = e.matched.length && U(e.matched[e.matched.length - 1], t.record)
		;(t.__vd_exactActive = t.__vd_active = n),
			n || (t.__vd_active = e.matched.some(s => U(s, t.record))),
			t.children.forEach(s => Ct(s, e))
	}
	function It(t) {
		;(t.__vd_match = !1), t.children.forEach(It)
	}
	function Ie(t, e) {
		const n = String(t.re).match(Ss)
		if (((t.__vd_match = !1), !n || n.length < 3)) return !1
		if (new RegExp(n[1].replace(/\$$/, ''), n[2]).test(e))
			return (
				t.children.forEach(o => Ie(o, e)), t.record.path !== '/' || e === '/' ? ((t.__vd_match = t.re.test(e)), !0) : !1
			)
		const r = t.record.path.toLowerCase(),
			i = re(r)
		return (!e.startsWith('/') && (i.includes(e) || r.includes(e))) ||
			i.startsWith(e) ||
			r.startsWith(e) ||
			(t.record.name && String(t.record.name).includes(e))
			? !0
			: t.children.some(o => Ie(o, e))
	}
	function Rs(t, e) {
		const n = {}
		for (let s in t) e.includes(s) || (n[s] = t[s])
		return n
	}
	function Ps(t) {
		const e = Hn(t.routes, t)
		let n = t.parseQuery || os,
			s = t.stringifyQuery || Ot,
			r = t.history
		if (process.env.NODE_ENV !== 'production' && !r)
			throw new Error(
				'Provide the "history" option when calling "createRouter()": https://next.router.vuejs.org/api/#history.'
			)
		const i = ie(),
			o = ie(),
			l = ie(),
			c = v.shallowRef(W)
		let u = W
		F && t.scrollBehavior && 'scrollRestoration' in history && (history.scrollRestoration = 'manual')
		const a = _e.bind(null, d => '' + d),
			h = _e.bind(null, is),
			f = _e.bind(null, re)
		function p(d, g) {
			let m, E
			return ht(d) ? ((m = e.getRecordMatcher(d)), (E = g)) : (E = d), e.addRoute(E, m)
		}
		function y(d) {
			let g = e.getRecordMatcher(d)
			g
				? e.removeRoute(g)
				: process.env.NODE_ENV !== 'production' && R(`Cannot remove non-existent route "${String(d)}"`)
		}
		function N() {
			return e.getRoutes().map(d => d.record)
		}
		function A(d) {
			return !!e.getRecordMatcher(d)
		}
		function T(d, g) {
			if (((g = w({}, g || c.value)), typeof d == 'string')) {
				let S = Se(n, d, g.path),
					k = e.resolve({ path: S.path }, g),
					Q = r.createHref(S.fullPath)
				return (
					process.env.NODE_ENV !== 'production' &&
						(Q.startsWith('//')
							? R(`Location "${d}" resolved to "${Q}". A resolved location cannot start with multiple slashes.`)
							: k.matched.length || R(`No match found for location with path "${d}"`)),
					w(S, k, { params: f(k.params), hash: re(S.hash), redirectedFrom: void 0, href: Q })
				)
			}
			let m
			'path' in d
				? (process.env.NODE_ENV !== 'production' &&
						'params' in d &&
						!('name' in d) &&
						Object.keys(d.params).length &&
						R(
							`Path "${d.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`
						),
				  (m = w({}, d, { path: Se(n, d.path, g.path).path })))
				: ((m = w({}, d, { params: h(d.params) })), (g.params = h(g.params)))
			let E = e.resolve(m, g)
			const P = d.hash || ''
			process.env.NODE_ENV !== 'production' &&
				P &&
				!P.startsWith('#') &&
				R(`A \`hash\` should always start with the character "#". Replace "${P}" with "#${P}".`),
				(E.params = a(f(E.params)))
			const I = dn(s, w({}, d, { hash: ns(P), path: E.path }))
			let O = r.createHref(I)
			return (
				process.env.NODE_ENV !== 'production' &&
					(O.startsWith('//')
						? R(`Location "${d}" resolved to "${O}". A resolved location cannot start with multiple slashes.`)
						: E.matched.length || R(`No match found for location with path "${'path' in d ? d.path : d}"`)),
				w({ fullPath: I, hash: P, query: s === Ot ? as(d.query) : d.query }, E, { redirectedFrom: void 0, href: O })
			)
		}
		function _(d) {
			return typeof d == 'string' ? Se(n, d, c.value.path) : w({}, d)
		}
		function x(d, g) {
			if (u !== d) return Z(8, { from: g, to: d })
		}
		function D(d) {
			return ae(d)
		}
		function X(d) {
			return D(w(_(d), { replace: !0 }))
		}
		function L(d) {
			const g = d.matched[d.matched.length - 1]
			if (g && g.redirect) {
				const { redirect: m } = g
				let E = typeof m == 'function' ? m(d) : m
				if (
					(typeof E == 'string' &&
						((E = E.includes('?') || E.includes('#') ? (E = _(E)) : { path: E }), (E.params = {})),
					process.env.NODE_ENV !== 'production' && !('path' in E) && !('name' in E))
				)
					throw (
						(R(`Invalid redirect found:
${JSON.stringify(E, null, 2)}
 when navigating to "${d.fullPath}". A redirect must contain a name or path. This will break in production.`),
						new Error('Invalid redirect'))
					)
				return w({ query: d.query, hash: d.hash, params: d.params }, E)
			}
		}
		function ae(d, g) {
			const m = (u = T(d)),
				E = c.value,
				P = d.state,
				I = d.force,
				O = d.replace === !0,
				S = L(m)
			if (S) return ae(w(_(S), { state: P, force: I, replace: O }), g || m)
			const k = m
			k.redirectedFrom = g
			let Q
			return (
				!I && it(s, E, m) && ((Q = Z(16, { to: k, from: E })), Vt(E, E, !0, !1)),
				(Q ? Promise.resolve(Q) : kt(k, E))
					.catch($ => (q($) ? $ : xe($, k, E)))
					.then($ => {
						if ($) {
							if (q($, 2))
								return process.env.NODE_ENV !== 'production' &&
									it(s, T($.to), k) &&
									g &&
									(g._count = g._count ? g._count + 1 : 1) > 10
									? (R(
											`Detected an infinite redirection in a navigation guard when going from "${E.fullPath}" to "${k.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`
									  ),
									  Promise.reject(new Error('Infinite redirect in navigation guard')))
									: ae(w(_($.to), { state: P, force: I, replace: O }), g || k)
						} else $ = Dt(k, E, !0, O, P)
						return xt(k, E, $), $
					})
			)
		}
		function ks(d, g) {
			const m = x(d, g)
			return m ? Promise.reject(m) : Promise.resolve()
		}
		function kt(d, g) {
			let m
			const [E, P, I] = ws(d, g)
			m = Ce(E.reverse(), 'beforeRouteLeave', d, g)
			for (const S of E)
				S.leaveGuards.forEach(k => {
					m.push(Y(k, d, g))
				})
			const O = ks.bind(null, d, g)
			return (
				m.push(O),
				ee(m)
					.then(() => {
						m = []
						for (const S of i.list()) m.push(Y(S, d, g))
						return m.push(O), ee(m)
					})
					.then(() => {
						m = Ce(P, 'beforeRouteUpdate', d, g)
						for (const S of P)
							S.updateGuards.forEach(k => {
								m.push(Y(k, d, g))
							})
						return m.push(O), ee(m)
					})
					.then(() => {
						m = []
						for (const S of d.matched)
							if (S.beforeEnter && !g.matched.includes(S))
								if (Array.isArray(S.beforeEnter)) for (const k of S.beforeEnter) m.push(Y(k, d, g))
								else m.push(Y(S.beforeEnter, d, g))
						return m.push(O), ee(m)
					})
					.then(
						() => (
							d.matched.forEach(S => (S.enterCallbacks = {})), (m = Ce(I, 'beforeRouteEnter', d, g)), m.push(O), ee(m)
						)
					)
					.then(() => {
						m = []
						for (const S of o.list()) m.push(Y(S, d, g))
						return m.push(O), ee(m)
					})
					.catch(S => (q(S, 8) ? S : Promise.reject(S)))
			)
		}
		function xt(d, g, m) {
			for (const E of l.list()) E(d, g, m)
		}
		function Dt(d, g, m, E, P) {
			const I = x(d, g)
			if (I) return I
			const O = g === W,
				S = F ? history.state : {}
			m && (E || O ? r.replace(d.fullPath, w({ scroll: O && S && S.scroll }, P)) : r.push(d.fullPath, P)),
				(c.value = d),
				Vt(d, g, m, O),
				$t()
		}
		let jt
		function xs() {
			jt = r.listen((d, g, m) => {
				let E = T(d)
				const P = L(E)
				if (P) {
					ae(w(P, { replace: !0 }), E).catch(te)
					return
				}
				u = E
				const I = c.value
				F && On(ct(I.fullPath, m.delta), he()),
					kt(E, I)
						.catch(O =>
							q(O, 12)
								? O
								: q(O, 2)
								? (ae(O.to, E)
										.then(S => {
											q(S, 20) && !m.delta && m.type === ne.pop && r.go(-1, !1)
										})
										.catch(te),
								  Promise.reject())
								: (m.delta && r.go(-m.delta, !1), xe(O, E, I))
						)
						.then(O => {
							;(O = O || Dt(E, I, !1)),
								O && (m.delta ? r.go(-m.delta, !1) : m.type === ne.pop && q(O, 20) && r.go(-1, !1)),
								xt(E, I, O)
						})
						.catch(te)
			})
		}
		let ke = ie(),
			Mt = ie(),
			de
		function xe(d, g, m) {
			$t(d)
			const E = Mt.list()
			return (
				E.length
					? E.forEach(P => P(d, g, m))
					: (process.env.NODE_ENV !== 'production' && R('uncaught error during route navigation:'), console.error(d)),
				Promise.reject(d)
			)
		}
		function Ds() {
			return de && c.value !== W
				? Promise.resolve()
				: new Promise((d, g) => {
						ke.add([d, g])
				  })
		}
		function $t(d) {
			de || ((de = !0), xs(), ke.list().forEach(([g, m]) => (d ? m(d) : g())), ke.reset())
		}
		function Vt(d, g, m, E) {
			const { scrollBehavior: P } = t
			if (!F || !P) return Promise.resolve()
			let I = (!m && Tn(ct(d.fullPath, 0))) || ((E || !m) && history.state && history.state.scroll) || null
			return v
				.nextTick()
				.then(() => P(d, g, I))
				.then(O => O && bn(O))
				.catch(O => xe(O, d, g))
		}
		const De = d => r.go(d)
		let je
		const Me = new Set()
		return {
			currentRoute: c,
			addRoute: p,
			removeRoute: y,
			hasRoute: A,
			getRoutes: N,
			resolve: T,
			options: t,
			push: D,
			replace: X,
			go: De,
			back: () => De(-1),
			forward: () => De(1),
			beforeEach: i.add,
			beforeResolve: o.add,
			afterEach: l.add,
			onError: Mt.add,
			isReady: Ds,
			install(d) {
				const g = this
				d.component('RouterLink', ls),
					d.component('RouterView', ps),
					(d.config.globalProperties.$router = g),
					Object.defineProperty(d.config.globalProperties, '$route', { enumerable: !0, get: () => v.unref(c) }),
					F &&
						!je &&
						c.value === W &&
						((je = !0),
						D(r.location).catch(P => {
							process.env.NODE_ENV !== 'production' && R('Unexpected error when starting the router:', P)
						}))
				const m = {}
				for (let P in W) m[P] = v.computed(() => c.value[P])
				d.provide(Oe, g), d.provide(st, v.reactive(m)), d.provide(Te, c)
				let E = d.unmount
				Me.add(d),
					(d.unmount = function () {
						Me.delete(d), Me.size < 1 && (jt(), (c.value = W), (je = !1), (de = !1)), E()
					}),
					(process.env.NODE_ENV !== 'production' || !1) && F && ys(d, g, e)
			},
		}
	}
	function ee(t) {
		return t.reduce((e, n) => e.then(() => n()), Promise.resolve())
	}
	function ws(t, e) {
		const n = [],
			s = [],
			r = [],
			i = Math.max(e.matched.length, t.matched.length)
		for (let o = 0; o < i; o++) {
			const l = e.matched[o]
			l && (t.matched.find(u => U(u, l)) ? s.push(l) : n.push(l))
			const c = t.matched[o]
			c && (e.matched.find(u => U(u, c)) || r.push(c))
		}
		return [n, s, r]
	}
	const Ns = [
			{ path: '/', component: { template: '<div><br>Login</div>' }, props: !0 },
			{ path: '/home', component: '<div><h1>HOME</h1></div>', props: !0 },
			{ path: '/404', component: { template: '<h1>404</h1>' } },
			{ path: '/:table', component: '<div><h1>TABLE</h1></div>' },
			{ path: '/:table/:id', component: '<div><h1>FORM</h1></div>' },
		],
		As = Ps({ history: Pn(), routes: Ns })
	class Cs {
		constructor(e = void 0) {
			e === void 0 ||
				import(resolve(e)).then(n => {
					console.log(n)
				})
		}
		loadRoutes() {}
		loadEvents() {}
		loadClient() {}
		loadCustomComponents() {}
	}
	function Is(t, e) {
		const n = tn(r),
			s = rn(n)
		t.use(s), t.use(As)
		const r = new Cs()
	}
	return { install: Is }
})
