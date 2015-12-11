(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define(factory);
	} else if (typeof exports === 'object') {
		module.exports = factory();
	} else {
		root.Animator = factory();
	}
}(this, function () {
	/**
	 * Provides a functionality for synchronous animation of a set of components
	 *
	 * Each component should provide a callback which will be called for each animation frame.
	 *
	 * Example of usage:
	 *
	 *      var animator = new Animator();
	 *
	 *      animator.addCallback(callback1);
	 *      animator.addCallback(callback2);
	 *      animator.addCallback(callback3);
	 *
	 *      animator.setDuration(500);
	 *
	 *      animator.startAnimation();
	 *
	 * @property {Number} _duration
	 * @property {Array} _callbacks
	 * @property {Number|null} _animationStartTime
	 * @property {Number|null} _requestAnimationFrameID
	 * @constructor
	 */
	function Animator() {
		this._duration = 200;
		this._callbacks = [];
		this._animationStartTime = null;
		this._requestAnimationFrameID = null;

		this._animationFrame = this._animationFrame.bind(this);
	}

	/**
	 * Add callback for animation
	 *
	 * Each callback will be called during an animation
	 * with current coefficient of its completion.
	 *
	 * @param {Function} callback
	 */
	Animator.prototype.addCallback = function(callback) {
		this._callbacks.push(callback);
	};

	/**
	 * Sets duration of further animation
	 *
	 * @param {Number} duration
	 */
	Animator.prototype.setDuration = function(duration) {
		this._duration = duration;
	};

	/**
	 * Start animation
	 *
	 * Method is using window.requestAnimationFrame.
	 */
	Animator.prototype.startAnimation = function() {
		this._animationStartTime = Date.now();
		this._requestAnimationFrameID = window.requestAnimationFrame(this._animationFrame);
	};

	/**
	 * Calculates a coefficient of completion of an animation
	 *
	 * @returns {Number} From 0 to 1.
	 * @private
	 */
	Animator.prototype._getAnimationCompletionCoefficient = function() {
		var coefficient = (Date.now() - this._animationStartTime) / this._duration;

		return Math.min(coefficient, 1);
	};

	/**
	 * Calls all callbacks with a current coefficient of completion of the animation
	 *
	 * If current animation frame is not last frame of an animation,
	 * this method calls window.requestAnimationFrame for next frame.
	 *
	 * @private
	 */
	Animator.prototype._animationFrame = function() {
		var coefficient = this._getAnimationCompletionCoefficient();

		this._callbacks.forEach(function(callback) {
			callback(coefficient);
		});

		this._afterAnimationFrame(coefficient);
	};

	/**
	 * Called after each animation frame and requests next animation frame
	 *
	 * If animation is completed, clears properties which will be used in animation.
	 *
	 * @param {Number} coefficient
	 * @private
	 */
	Animator.prototype._afterAnimationFrame = function(coefficient) {
		if(coefficient === 1) {
			this._animationStartTime = null;
			this._requestAnimationFrameID = null;
		} else {
			this._requestAnimationFrameID = window.requestAnimationFrame(this._animationFrame);
		}
	};

	return Animator;
}));
