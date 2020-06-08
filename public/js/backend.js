(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/backend"],{

/***/ "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js":
/*!***************************************************************************!*\
  !*** ./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * Datepicker for Bootstrap v1.9.0 (https://github.com/uxsolutions/bootstrap-datepicker)
 *
 * Licensed under the Apache License v2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */

(function(factory){
    if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    } else {}
}(function($, undefined){
	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getFullYear(), today.getMonth(), today.getDate());
	}
	function isUTCEquals(date1, date2) {
		return (
			date1.getUTCFullYear() === date2.getUTCFullYear() &&
			date1.getUTCMonth() === date2.getUTCMonth() &&
			date1.getUTCDate() === date2.getUTCDate()
		);
	}
	function alias(method, deprecationMsg){
		return function(){
			if (deprecationMsg !== undefined) {
				$.fn.datepicker.deprecated(deprecationMsg);
			}

			return this[method].apply(this, arguments);
		};
	}
	function isValidDate(d) {
		return d && !isNaN(d.getTime());
	}

	var DateArray = (function(){
		var extras = {
			get: function(i){
				return this.slice(i)[0];
			},
			contains: function(d){
				// Array.indexOf is not cross-browser;
				// $.inArray doesn't work with Dates
				var val = d && d.valueOf();
				for (var i=0, l=this.length; i < l; i++)
          // Use date arithmetic to allow dates with different times to match
          if (0 <= this[i].valueOf() - val && this[i].valueOf() - val < 1000*60*60*24)
						return i;
				return -1;
			},
			remove: function(i){
				this.splice(i,1);
			},
			replace: function(new_array){
				if (!new_array)
					return;
				if (!$.isArray(new_array))
					new_array = [new_array];
				this.clear();
				this.push.apply(this, new_array);
			},
			clear: function(){
				this.length = 0;
			},
			copy: function(){
				var a = new DateArray();
				a.replace(this);
				return a;
			}
		};

		return function(){
			var a = [];
			a.push.apply(a, arguments);
			$.extend(a, extras);
			return a;
		};
	})();


	// Picker object

	var Datepicker = function(element, options){
		$.data(element, 'datepicker', this);

		this._events = [];
		this._secondaryEvents = [];

		this._process_options(options);

		this.dates = new DateArray();
		this.viewDate = this.o.defaultViewDate;
		this.focusDate = null;

		this.element = $(element);
		this.isInput = this.element.is('input');
		this.inputField = this.isInput ? this.element : this.element.find('input');
		this.component = this.element.hasClass('date') ? this.element.find('.add-on, .input-group-addon, .input-group-append, .input-group-prepend, .btn') : false;
		if (this.component && this.component.length === 0)
			this.component = false;
		this.isInline = !this.component && this.element.is('div');

		this.picker = $(DPGlobal.template);

		// Checking templates and inserting
		if (this._check_template(this.o.templates.leftArrow)) {
			this.picker.find('.prev').html(this.o.templates.leftArrow);
		}

		if (this._check_template(this.o.templates.rightArrow)) {
			this.picker.find('.next').html(this.o.templates.rightArrow);
		}

		this._buildEvents();
		this._attachEvents();

		if (this.isInline){
			this.picker.addClass('datepicker-inline').appendTo(this.element);
		}
		else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}

		if (this.o.rtl){
			this.picker.addClass('datepicker-rtl');
		}

		if (this.o.calendarWeeks) {
			this.picker.find('.datepicker-days .datepicker-switch, thead .datepicker-title, tfoot .today, tfoot .clear')
				.attr('colspan', function(i, val){
					return Number(val) + 1;
				});
		}

		this._process_options({
			startDate: this._o.startDate,
			endDate: this._o.endDate,
			daysOfWeekDisabled: this.o.daysOfWeekDisabled,
			daysOfWeekHighlighted: this.o.daysOfWeekHighlighted,
			datesDisabled: this.o.datesDisabled
		});

		this._allow_update = false;
		this.setViewMode(this.o.startView);
		this._allow_update = true;

		this.fillDow();
		this.fillMonths();

		this.update();

		if (this.isInline){
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_resolveViewName: function(view){
			$.each(DPGlobal.viewModes, function(i, viewMode){
				if (view === i || $.inArray(view, viewMode.names) !== -1){
					view = i;
					return false;
				}
			});

			return view;
		},

		_resolveDaysOfWeek: function(daysOfWeek){
			if (!$.isArray(daysOfWeek))
				daysOfWeek = daysOfWeek.split(/[,\s]*/);
			return $.map(daysOfWeek, Number);
		},

		_check_template: function(tmp){
			try {
				// If empty
				if (tmp === undefined || tmp === "") {
					return false;
				}
				// If no html, everything ok
				if ((tmp.match(/[<>]/g) || []).length <= 0) {
					return true;
				}
				// Checking if html is fine
				var jDom = $(tmp);
				return jDom.length > 0;
			}
			catch (ex) {
				return false;
			}
		},

		_process_options: function(opts){
			// Store raw options for reference
			this._o = $.extend({}, this._o, opts);
			// Processed options
			var o = this.o = $.extend({}, this._o);

			// Check if "de-DE" style date is available, if not language should
			// fallback to 2 letter code eg "de"
			var lang = o.language;
			if (!dates[lang]){
				lang = lang.split('-')[0];
				if (!dates[lang])
					lang = defaults.language;
			}
			o.language = lang;

			// Retrieve view index from any aliases
			o.startView = this._resolveViewName(o.startView);
			o.minViewMode = this._resolveViewName(o.minViewMode);
			o.maxViewMode = this._resolveViewName(o.maxViewMode);

			// Check view is between min and max
			o.startView = Math.max(this.o.minViewMode, Math.min(this.o.maxViewMode, o.startView));

			// true, false, or Number > 0
			if (o.multidate !== true){
				o.multidate = Number(o.multidate) || false;
				if (o.multidate !== false)
					o.multidate = Math.max(0, o.multidate);
			}
			o.multidateSeparator = String(o.multidateSeparator);

			o.weekStart %= 7;
			o.weekEnd = (o.weekStart + 6) % 7;

			var format = DPGlobal.parseFormat(o.format);
			if (o.startDate !== -Infinity){
				if (!!o.startDate){
					if (o.startDate instanceof Date)
						o.startDate = this._local_to_utc(this._zero_time(o.startDate));
					else
						o.startDate = DPGlobal.parseDate(o.startDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.startDate = -Infinity;
				}
			}
			if (o.endDate !== Infinity){
				if (!!o.endDate){
					if (o.endDate instanceof Date)
						o.endDate = this._local_to_utc(this._zero_time(o.endDate));
					else
						o.endDate = DPGlobal.parseDate(o.endDate, format, o.language, o.assumeNearbyYear);
				}
				else {
					o.endDate = Infinity;
				}
			}

			o.daysOfWeekDisabled = this._resolveDaysOfWeek(o.daysOfWeekDisabled||[]);
			o.daysOfWeekHighlighted = this._resolveDaysOfWeek(o.daysOfWeekHighlighted||[]);

			o.datesDisabled = o.datesDisabled||[];
			if (!$.isArray(o.datesDisabled)) {
				o.datesDisabled = o.datesDisabled.split(',');
			}
			o.datesDisabled = $.map(o.datesDisabled, function(d){
				return DPGlobal.parseDate(d, format, o.language, o.assumeNearbyYear);
			});

			var plc = String(o.orientation).toLowerCase().split(/\s+/g),
				_plc = o.orientation.toLowerCase();
			plc = $.grep(plc, function(word){
				return /^auto|left|right|top|bottom$/.test(word);
			});
			o.orientation = {x: 'auto', y: 'auto'};
			if (!_plc || _plc === 'auto')
				; // no action
			else if (plc.length === 1){
				switch (plc[0]){
					case 'top':
					case 'bottom':
						o.orientation.y = plc[0];
						break;
					case 'left':
					case 'right':
						o.orientation.x = plc[0];
						break;
				}
			}
			else {
				_plc = $.grep(plc, function(word){
					return /^left|right$/.test(word);
				});
				o.orientation.x = _plc[0] || 'auto';

				_plc = $.grep(plc, function(word){
					return /^top|bottom$/.test(word);
				});
				o.orientation.y = _plc[0] || 'auto';
			}
			if (o.defaultViewDate instanceof Date || typeof o.defaultViewDate === 'string') {
				o.defaultViewDate = DPGlobal.parseDate(o.defaultViewDate, format, o.language, o.assumeNearbyYear);
			} else if (o.defaultViewDate) {
				var year = o.defaultViewDate.year || new Date().getFullYear();
				var month = o.defaultViewDate.month || 0;
				var day = o.defaultViewDate.day || 1;
				o.defaultViewDate = UTCDate(year, month, day);
			} else {
				o.defaultViewDate = UTCToday();
			}
		},
		_applyEvents: function(evs){
			for (var i=0, el, ch, ev; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.on(ev, ch);
			}
		},
		_unapplyEvents: function(evs){
			for (var i=0, el, ev, ch; i < evs.length; i++){
				el = evs[i][0];
				if (evs[i].length === 2){
					ch = undefined;
					ev = evs[i][1];
				} else if (evs[i].length === 3){
					ch = evs[i][1];
					ev = evs[i][2];
				}
				el.off(ev, ch);
			}
		},
		_buildEvents: function(){
            var events = {
                keyup: $.proxy(function(e){
                    if ($.inArray(e.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1)
                        this.update();
                }, this),
                keydown: $.proxy(this.keydown, this),
                paste: $.proxy(this.paste, this)
            };

            if (this.o.showOnFocus === true) {
                events.focus = $.proxy(this.show, this);
            }

            if (this.isInput) { // single input
                this._events = [
                    [this.element, events]
                ];
            }
            // component: input + button
            else if (this.component && this.inputField.length) {
                this._events = [
                    // For components that are not readonly, allow keyboard nav
                    [this.inputField, events],
                    [this.component, {
                        click: $.proxy(this.show, this)
                    }]
                ];
            }
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this),
						keydown: $.proxy(this.keydown, this)
					}]
				];
			}
			this._events.push(
				// Component: listen for blur on element descendants
				[this.element, '*', {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}],
				// Input: listen for blur on element
				[this.element, {
					blur: $.proxy(function(e){
						this._focused_from = e.target;
					}, this)
				}]
			);

			if (this.o.immediateUpdates) {
				// Trigger input updates immediately on changed year/month
				this._events.push([this.element, {
					'changeYear changeMonth': $.proxy(function(e){
						this.update(e.date);
					}, this)
				}]);
			}

			this._secondaryEvents = [
				[this.picker, {
					click: $.proxy(this.click, this)
				}],
				[this.picker, '.prev, .next', {
					click: $.proxy(this.navArrowsClick, this)
				}],
				[this.picker, '.day:not(.disabled)', {
					click: $.proxy(this.dayCellClick, this)
				}],
				[$(window), {
					resize: $.proxy(this.place, this)
				}],
				[$(document), {
					'mousedown touchstart': $.proxy(function(e){
						// Clicked outside the datepicker, hide it
						if (!(
							this.element.is(e.target) ||
							this.element.find(e.target).length ||
							this.picker.is(e.target) ||
							this.picker.find(e.target).length ||
							this.isInline
						)){
							this.hide();
						}
					}, this)
				}]
			];
		},
		_attachEvents: function(){
			this._detachEvents();
			this._applyEvents(this._events);
		},
		_detachEvents: function(){
			this._unapplyEvents(this._events);
		},
		_attachSecondaryEvents: function(){
			this._detachSecondaryEvents();
			this._applyEvents(this._secondaryEvents);
		},
		_detachSecondaryEvents: function(){
			this._unapplyEvents(this._secondaryEvents);
		},
		_trigger: function(event, altdate){
			var date = altdate || this.dates.get(-1),
				local_date = this._utc_to_local(date);

			this.element.trigger({
				type: event,
				date: local_date,
				viewMode: this.viewMode,
				dates: $.map(this.dates, this._utc_to_local),
				format: $.proxy(function(ix, format){
					if (arguments.length === 0){
						ix = this.dates.length - 1;
						format = this.o.format;
					} else if (typeof ix === 'string'){
						format = ix;
						ix = this.dates.length - 1;
					}
					format = format || this.o.format;
					var date = this.dates.get(ix);
					return DPGlobal.formatDate(date, format, this.o.language);
				}, this)
			});
		},

		show: function(){
			if (this.inputField.is(':disabled') || (this.inputField.prop('readonly') && this.o.enableOnReadonly === false))
				return;
			if (!this.isInline)
				this.picker.appendTo(this.o.container);
			this.place();
			this.picker.show();
			this._attachSecondaryEvents();
			this._trigger('show');
			if ((window.navigator.msMaxTouchPoints || 'ontouchstart' in document) && this.o.disableTouchKeyboard) {
				$(this.element).blur();
			}
			return this;
		},

		hide: function(){
			if (this.isInline || !this.picker.is(':visible'))
				return this;
			this.focusDate = null;
			this.picker.hide().detach();
			this._detachSecondaryEvents();
			this.setViewMode(this.o.startView);

			if (this.o.forceParse && this.inputField.val())
				this.setValue();
			this._trigger('hide');
			return this;
		},

		destroy: function(){
			this.hide();
			this._detachEvents();
			this._detachSecondaryEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
			if (!this.isInput){
				delete this.element.data().date;
			}
			return this;
		},

		paste: function(e){
			var dateString;
			if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.types
				&& $.inArray('text/plain', e.originalEvent.clipboardData.types) !== -1) {
				dateString = e.originalEvent.clipboardData.getData('text/plain');
			} else if (window.clipboardData) {
				dateString = window.clipboardData.getData('Text');
			} else {
				return;
			}
			this.setDate(dateString);
			this.update();
			e.preventDefault();
		},

		_utc_to_local: function(utc){
			if (!utc) {
				return utc;
			}

			var local = new Date(utc.getTime() + (utc.getTimezoneOffset() * 60000));

			if (local.getTimezoneOffset() !== utc.getTimezoneOffset()) {
				local = new Date(utc.getTime() + (local.getTimezoneOffset() * 60000));
			}

			return local;
		},
		_local_to_utc: function(local){
			return local && new Date(local.getTime() - (local.getTimezoneOffset()*60000));
		},
		_zero_time: function(local){
			return local && new Date(local.getFullYear(), local.getMonth(), local.getDate());
		},
		_zero_utc_time: function(utc){
			return utc && UTCDate(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
		},

		getDates: function(){
			return $.map(this.dates, this._utc_to_local);
		},

		getUTCDates: function(){
			return $.map(this.dates, function(d){
				return new Date(d);
			});
		},

		getDate: function(){
			return this._utc_to_local(this.getUTCDate());
		},

		getUTCDate: function(){
			var selected_date = this.dates.get(-1);
			if (selected_date !== undefined) {
				return new Date(selected_date);
			} else {
				return null;
			}
		},

		clearDates: function(){
			this.inputField.val('');
			this.update();
			this._trigger('changeDate');

			if (this.o.autoclose) {
				this.hide();
			}
		},

		setDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.update.apply(this, args);
			this._trigger('changeDate');
			this.setValue();
			return this;
		},

		setUTCDates: function(){
			var args = $.isArray(arguments[0]) ? arguments[0] : arguments;
			this.setDates.apply(this, $.map(args, this._utc_to_local));
			return this;
		},

		setDate: alias('setDates'),
		setUTCDate: alias('setUTCDates'),
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead'),

		setValue: function(){
			var formatted = this.getFormattedDate();
			this.inputField.val(formatted);
			return this;
		},

		getFormattedDate: function(format){
			if (format === undefined)
				format = this.o.format;

			var lang = this.o.language;
			return $.map(this.dates, function(d){
				return DPGlobal.formatDate(d, format, lang);
			}).join(this.o.multidateSeparator);
		},

		getStartDate: function(){
			return this.o.startDate;
		},

		setStartDate: function(startDate){
			this._process_options({startDate: startDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		getEndDate: function(){
			return this.o.endDate;
		},

		setEndDate: function(endDate){
			this._process_options({endDate: endDate});
			this.update();
			this.updateNavArrows();
			return this;
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this._process_options({daysOfWeekDisabled: daysOfWeekDisabled});
			this.update();
			return this;
		},

		setDaysOfWeekHighlighted: function(daysOfWeekHighlighted){
			this._process_options({daysOfWeekHighlighted: daysOfWeekHighlighted});
			this.update();
			return this;
		},

		setDatesDisabled: function(datesDisabled){
			this._process_options({datesDisabled: datesDisabled});
			this.update();
			return this;
		},

		place: function(){
			if (this.isInline)
				return this;
			var calendarWidth = this.picker.outerWidth(),
				calendarHeight = this.picker.outerHeight(),
				visualPadding = 10,
				container = $(this.o.container),
				windowWidth = container.width(),
				scrollTop = this.o.container === 'body' ? $(document).scrollTop() : container.scrollTop(),
				appendOffset = container.offset();

			var parentsZindex = [0];
			this.element.parents().each(function(){
				var itemZIndex = $(this).css('z-index');
				if (itemZIndex !== 'auto' && Number(itemZIndex) !== 0) parentsZindex.push(Number(itemZIndex));
			});
			var zIndex = Math.max.apply(Math, parentsZindex) + this.o.zIndexOffset;
			var offset = this.component ? this.component.parent().offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(false);
			var width = this.component ? this.component.outerWidth(true) : this.element.outerWidth(false);
			var left = offset.left - appendOffset.left;
			var top = offset.top - appendOffset.top;

			if (this.o.container !== 'body') {
				top += scrollTop;
			}

			this.picker.removeClass(
				'datepicker-orient-top datepicker-orient-bottom '+
				'datepicker-orient-right datepicker-orient-left'
			);

			if (this.o.orientation.x !== 'auto'){
				this.picker.addClass('datepicker-orient-' + this.o.orientation.x);
				if (this.o.orientation.x === 'right')
					left -= calendarWidth - width;
			}
			// auto x orientation is best-placement: if it crosses a window
			// edge, fudge it sideways
			else {
				if (offset.left < 0) {
					// component is outside the window on the left side. Move it into visible range
					this.picker.addClass('datepicker-orient-left');
					left -= offset.left - visualPadding;
				} else if (left + calendarWidth > windowWidth) {
					// the calendar passes the widow right edge. Align it to component right side
					this.picker.addClass('datepicker-orient-right');
					left += width - calendarWidth;
				} else {
					if (this.o.rtl) {
						// Default to right
						this.picker.addClass('datepicker-orient-right');
					} else {
						// Default to left
						this.picker.addClass('datepicker-orient-left');
					}
				}
			}

			// auto y orientation is best-situation: top or bottom, no fudging,
			// decision based on which shows more of the calendar
			var yorient = this.o.orientation.y,
				top_overflow;
			if (yorient === 'auto'){
				top_overflow = -scrollTop + top - calendarHeight;
				yorient = top_overflow < 0 ? 'bottom' : 'top';
			}

			this.picker.addClass('datepicker-orient-' + yorient);
			if (yorient === 'top')
				top -= calendarHeight + parseInt(this.picker.css('padding-top'));
			else
				top += height;

			if (this.o.rtl) {
				var right = windowWidth - (left + width);
				this.picker.css({
					top: top,
					right: right,
					zIndex: zIndex
				});
			} else {
				this.picker.css({
					top: top,
					left: left,
					zIndex: zIndex
				});
			}
			return this;
		},

		_allow_update: true,
		update: function(){
			if (!this._allow_update)
				return this;

			var oldDates = this.dates.copy(),
				dates = [],
				fromArgs = false;
			if (arguments.length){
				$.each(arguments, $.proxy(function(i, date){
					if (date instanceof Date)
						date = this._local_to_utc(date);
					dates.push(date);
				}, this));
				fromArgs = true;
			} else {
				dates = this.isInput
						? this.element.val()
						: this.element.data('date') || this.inputField.val();
				if (dates && this.o.multidate)
					dates = dates.split(this.o.multidateSeparator);
				else
					dates = [dates];
				delete this.element.data().date;
			}

			dates = $.map(dates, $.proxy(function(date){
				return DPGlobal.parseDate(date, this.o.format, this.o.language, this.o.assumeNearbyYear);
			}, this));
			dates = $.grep(dates, $.proxy(function(date){
				return (
					!this.dateWithinRange(date) ||
					!date
				);
			}, this), true);
			this.dates.replace(dates);

			if (this.o.updateViewDate) {
				if (this.dates.length)
					this.viewDate = new Date(this.dates.get(-1));
				else if (this.viewDate < this.o.startDate)
					this.viewDate = new Date(this.o.startDate);
				else if (this.viewDate > this.o.endDate)
					this.viewDate = new Date(this.o.endDate);
				else
					this.viewDate = this.o.defaultViewDate;
			}

			if (fromArgs){
				// setting date by clicking
				this.setValue();
				this.element.change();
			}
			else if (this.dates.length){
				// setting date by typing
				if (String(oldDates) !== String(this.dates) && fromArgs) {
					this._trigger('changeDate');
					this.element.change();
				}
			}
			if (!this.dates.length && oldDates.length) {
				this._trigger('clearDate');
				this.element.change();
			}

			this.fill();
			return this;
		},

		fillDow: function(){
      if (this.o.showWeekDays) {
			var dowCnt = this.o.weekStart,
				html = '<tr>';
			if (this.o.calendarWeeks){
				html += '<th class="cw">&#160;</th>';
			}
			while (dowCnt < this.o.weekStart + 7){
				html += '<th class="dow';
        if ($.inArray(dowCnt, this.o.daysOfWeekDisabled) !== -1)
          html += ' disabled';
        html += '">'+dates[this.o.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
      }
		},

		fillMonths: function(){
      var localDate = this._utc_to_local(this.viewDate);
			var html = '';
			var focused;
			for (var i = 0; i < 12; i++){
				focused = localDate && localDate.getMonth() === i ? ' focused' : '';
				html += '<span class="month' + focused + '">' + dates[this.o.language].monthsShort[i] + '</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		setRange: function(range){
			if (!range || !range.length)
				delete this.range;
			else
				this.range = $.map(range, function(d){
					return d.valueOf();
				});
			this.fill();
		},

		getClassNames: function(date){
			var cls = [],
				year = this.viewDate.getUTCFullYear(),
				month = this.viewDate.getUTCMonth(),
				today = UTCToday();
			if (date.getUTCFullYear() < year || (date.getUTCFullYear() === year && date.getUTCMonth() < month)){
				cls.push('old');
			} else if (date.getUTCFullYear() > year || (date.getUTCFullYear() === year && date.getUTCMonth() > month)){
				cls.push('new');
			}
			if (this.focusDate && date.valueOf() === this.focusDate.valueOf())
				cls.push('focused');
			// Compare internal UTC date with UTC today, not local today
			if (this.o.todayHighlight && isUTCEquals(date, today)) {
				cls.push('today');
			}
			if (this.dates.contains(date) !== -1)
				cls.push('active');
			if (!this.dateWithinRange(date)){
				cls.push('disabled');
			}
			if (this.dateIsDisabled(date)){
				cls.push('disabled', 'disabled-date');
			}
			if ($.inArray(date.getUTCDay(), this.o.daysOfWeekHighlighted) !== -1){
				cls.push('highlighted');
			}

			if (this.range){
				if (date > this.range[0] && date < this.range[this.range.length-1]){
					cls.push('range');
				}
				if ($.inArray(date.valueOf(), this.range) !== -1){
					cls.push('selected');
				}
				if (date.valueOf() === this.range[0]){
          cls.push('range-start');
        }
        if (date.valueOf() === this.range[this.range.length-1]){
          cls.push('range-end');
        }
			}
			return cls;
		},

		_fill_yearsView: function(selector, cssClass, factor, year, startYear, endYear, beforeFn){
			var html = '';
			var step = factor / 10;
			var view = this.picker.find(selector);
			var startVal = Math.floor(year / factor) * factor;
			var endVal = startVal + step * 9;
			var focusedVal = Math.floor(this.viewDate.getFullYear() / step) * step;
			var selected = $.map(this.dates, function(d){
				return Math.floor(d.getUTCFullYear() / step) * step;
			});

			var classes, tooltip, before;
			for (var currVal = startVal - step; currVal <= endVal + step; currVal += step) {
				classes = [cssClass];
				tooltip = null;

				if (currVal === startVal - step) {
					classes.push('old');
				} else if (currVal === endVal + step) {
					classes.push('new');
				}
				if ($.inArray(currVal, selected) !== -1) {
					classes.push('active');
				}
				if (currVal < startYear || currVal > endYear) {
					classes.push('disabled');
				}
				if (currVal === focusedVal) {
				  classes.push('focused');
        }

				if (beforeFn !== $.noop) {
					before = beforeFn(new Date(currVal, 0, 1));
					if (before === undefined) {
						before = {};
					} else if (typeof before === 'boolean') {
						before = {enabled: before};
					} else if (typeof before === 'string') {
						before = {classes: before};
					}
					if (before.enabled === false) {
						classes.push('disabled');
					}
					if (before.classes) {
						classes = classes.concat(before.classes.split(/\s+/));
					}
					if (before.tooltip) {
						tooltip = before.tooltip;
					}
				}

				html += '<span class="' + classes.join(' ') + '"' + (tooltip ? ' title="' + tooltip + '"' : '') + '>' + currVal + '</span>';
			}

			view.find('.datepicker-switch').text(startVal + '-' + endVal);
			view.find('td').html(html);
		},

		fill: function(){
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				todaytxt = dates[this.o.language].today || dates['en'].today || '',
				cleartxt = dates[this.o.language].clear || dates['en'].clear || '',
        titleFormat = dates[this.o.language].titleFormat || dates['en'].titleFormat,
        todayDate = UTCToday(),
        titleBtnVisible = (this.o.todayBtn === true || this.o.todayBtn === 'linked') && todayDate >= this.o.startDate && todayDate <= this.o.endDate && !this.weekOfDateIsDisabled(todayDate),
				tooltip,
				before;
			if (isNaN(year) || isNaN(month))
				return;
			this.picker.find('.datepicker-days .datepicker-switch')
						.text(DPGlobal.formatDate(d, titleFormat, this.o.language));
			this.picker.find('tfoot .today')
						.text(todaytxt)
            .css('display', titleBtnVisible ? 'table-cell' : 'none');
			this.picker.find('tfoot .clear')
						.text(cleartxt)
						.css('display', this.o.clearBtn === true ? 'table-cell' : 'none');
			this.picker.find('thead .datepicker-title')
						.text(this.o.title)
						.css('display', typeof this.o.title === 'string' && this.o.title !== '' ? 'table-cell' : 'none');
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month, 0),
				day = prevMonth.getUTCDate();
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.o.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			if (prevMonth.getUTCFullYear() < 100){
        nextMonth.setUTCFullYear(prevMonth.getUTCFullYear());
      }
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var weekDay, clsName;
			while (prevMonth.valueOf() < nextMonth){
				weekDay = prevMonth.getUTCDay();
				if (weekDay === this.o.weekStart){
					html.push('<tr>');
					if (this.o.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.o.weekStart - weekDay - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(Number(ws) + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(Number(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay()) % 7 * 864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek = (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');
					}
				}
				clsName = this.getClassNames(prevMonth);
				clsName.push('day');

				var content = prevMonth.getUTCDate();

				if (this.o.beforeShowDay !== $.noop){
					before = this.o.beforeShowDay(this._utc_to_local(prevMonth));
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false)
						clsName.push('disabled');
					if (before.classes)
						clsName = clsName.concat(before.classes.split(/\s+/));
					if (before.tooltip)
						tooltip = before.tooltip;
					if (before.content)
						content = before.content;
				}

				//Check if uniqueSort exists (supported by jquery >=1.12 and >=2.2)
				//Fallback to unique function for older jquery versions
				if ($.isFunction($.uniqueSort)) {
					clsName = $.uniqueSort(clsName);
				} else {
					clsName = $.unique(clsName);
				}

				html.push('<td class="'+clsName.join(' ')+'"' + (tooltip ? ' title="'+tooltip+'"' : '') + ' data-date="' + prevMonth.getTime().toString() + '">' + content + '</td>');
				tooltip = null;
				if (weekDay === this.o.weekEnd){
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
			}
			this.picker.find('.datepicker-days tbody').html(html.join(''));

			var monthsTitle = dates[this.o.language].monthsTitle || dates['en'].monthsTitle || 'Months';
			var months = this.picker.find('.datepicker-months')
						.find('.datepicker-switch')
							.text(this.o.maxViewMode < 2 ? monthsTitle : year)
							.end()
						.find('tbody span').removeClass('active');

			$.each(this.dates, function(i, d){
				if (d.getUTCFullYear() === year)
					months.eq(d.getUTCMonth()).addClass('active');
			});

			if (year < startYear || year > endYear){
				months.addClass('disabled');
			}
			if (year === startYear){
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year === endYear){
				months.slice(endMonth+1).addClass('disabled');
			}

			if (this.o.beforeShowMonth !== $.noop){
				var that = this;
				$.each(months, function(i, month){
          var moDate = new Date(year, i, 1);
          var before = that.o.beforeShowMonth(moDate);
					if (before === undefined)
						before = {};
					else if (typeof before === 'boolean')
						before = {enabled: before};
					else if (typeof before === 'string')
						before = {classes: before};
					if (before.enabled === false && !$(month).hasClass('disabled'))
					    $(month).addClass('disabled');
					if (before.classes)
					    $(month).addClass(before.classes);
					if (before.tooltip)
					    $(month).prop('title', before.tooltip);
				});
			}

			// Generating decade/years picker
			this._fill_yearsView(
				'.datepicker-years',
				'year',
				10,
				year,
				startYear,
				endYear,
				this.o.beforeShowYear
			);

			// Generating century/decades picker
			this._fill_yearsView(
				'.datepicker-decades',
				'decade',
				100,
				year,
				startYear,
				endYear,
				this.o.beforeShowDecade
			);

			// Generating millennium/centuries picker
			this._fill_yearsView(
				'.datepicker-centuries',
				'century',
				1000,
				year,
				startYear,
				endYear,
				this.o.beforeShowCentury
			);
		},

		updateNavArrows: function(){
			if (!this._allow_update)
				return;

			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
				endYear = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
				endMonth = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
				prevIsDisabled,
				nextIsDisabled,
				factor = 1;
			switch (this.viewMode){
				case 4:
					factor *= 10;
					/* falls through */
				case 3:
					factor *= 10;
					/* falls through */
				case 2:
					factor *= 10;
					/* falls through */
				case 1:
					prevIsDisabled = Math.floor(year / factor) * factor <= startYear;
					nextIsDisabled = Math.floor(year / factor) * factor + factor > endYear;
					break;
				case 0:
					prevIsDisabled = year <= startYear && month <= startMonth;
					nextIsDisabled = year >= endYear && month >= endMonth;
					break;
			}

			this.picker.find('.prev').toggleClass('disabled', prevIsDisabled);
			this.picker.find('.next').toggleClass('disabled', nextIsDisabled);
		},

		click: function(e){
			e.preventDefault();
			e.stopPropagation();

			var target, dir, day, year, month;
			target = $(e.target);

			// Clicked on the switch
			if (target.hasClass('datepicker-switch') && this.viewMode !== this.o.maxViewMode){
				this.setViewMode(this.viewMode + 1);
			}

			// Clicked on today button
			if (target.hasClass('today') && !target.hasClass('day')){
				this.setViewMode(0);
				this._setDate(UTCToday(), this.o.todayBtn === 'linked' ? null : 'view');
			}

			// Clicked on clear button
			if (target.hasClass('clear')){
				this.clearDates();
			}

			if (!target.hasClass('disabled')){
				// Clicked on a month, year, decade, century
				if (target.hasClass('month')
						|| target.hasClass('year')
						|| target.hasClass('decade')
						|| target.hasClass('century')) {
					this.viewDate.setUTCDate(1);

					day = 1;
					if (this.viewMode === 1){
						month = target.parent().find('span').index(target);
						year = this.viewDate.getUTCFullYear();
						this.viewDate.setUTCMonth(month);
					} else {
						month = 0;
						year = Number(target.text());
						this.viewDate.setUTCFullYear(year);
					}

					this._trigger(DPGlobal.viewModes[this.viewMode - 1].e, this.viewDate);

					if (this.viewMode === this.o.minViewMode){
						this._setDate(UTCDate(year, month, day));
					} else {
						this.setViewMode(this.viewMode - 1);
						this.fill();
					}
				}
			}

			if (this.picker.is(':visible') && this._focused_from){
				this._focused_from.focus();
			}
			delete this._focused_from;
		},

		dayCellClick: function(e){
			var $target = $(e.currentTarget);
			var timestamp = $target.data('date');
			var date = new Date(timestamp);

			if (this.o.updateViewDate) {
				if (date.getUTCFullYear() !== this.viewDate.getUTCFullYear()) {
					this._trigger('changeYear', this.viewDate);
				}

				if (date.getUTCMonth() !== this.viewDate.getUTCMonth()) {
					this._trigger('changeMonth', this.viewDate);
				}
			}
			this._setDate(date);
		},

		// Clicked on prev or next
		navArrowsClick: function(e){
			var $target = $(e.currentTarget);
			var dir = $target.hasClass('prev') ? -1 : 1;
			if (this.viewMode !== 0){
				dir *= DPGlobal.viewModes[this.viewMode].navStep * 12;
			}
			this.viewDate = this.moveMonth(this.viewDate, dir);
			this._trigger(DPGlobal.viewModes[this.viewMode].e, this.viewDate);
			this.fill();
		},

		_toggle_multidate: function(date){
			var ix = this.dates.contains(date);
			if (!date){
				this.dates.clear();
			}

			if (ix !== -1){
				if (this.o.multidate === true || this.o.multidate > 1 || this.o.toggleActive){
					this.dates.remove(ix);
				}
			} else if (this.o.multidate === false) {
				this.dates.clear();
				this.dates.push(date);
			}
			else {
				this.dates.push(date);
			}

			if (typeof this.o.multidate === 'number')
				while (this.dates.length > this.o.multidate)
					this.dates.remove(0);
		},

		_setDate: function(date, which){
			if (!which || which === 'date')
				this._toggle_multidate(date && new Date(date));
			if ((!which && this.o.updateViewDate) || which === 'view')
				this.viewDate = date && new Date(date);

			this.fill();
			this.setValue();
			if (!which || which !== 'view') {
				this._trigger('changeDate');
			}
			this.inputField.trigger('change');
			if (this.o.autoclose && (!which || which === 'date')){
				this.hide();
			}
		},

		moveDay: function(date, dir){
			var newDate = new Date(date);
			newDate.setUTCDate(date.getUTCDate() + dir);

			return newDate;
		},

		moveWeek: function(date, dir){
			return this.moveDay(date, dir * 7);
		},

		moveMonth: function(date, dir){
			if (!isValidDate(date))
				return this.o.defaultViewDate;
			if (!dir)
				return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag === 1){
				test = dir === -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){
						return new_date.getUTCMonth() === month;
					}
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){
						return new_date.getUTCMonth() !== new_month;
					};
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				new_month = (new_month + 12) % 12;
			}
			else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i < mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){
					return new_month !== new_date.getUTCMonth();
				};
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		moveAvailableDate: function(date, dir, fn){
			do {
				date = this[fn](date, dir);

				if (!this.dateWithinRange(date))
					return false;

				fn = 'moveDay';
			}
			while (this.dateIsDisabled(date));

			return date;
		},

		weekOfDateIsDisabled: function(date){
			return $.inArray(date.getUTCDay(), this.o.daysOfWeekDisabled) !== -1;
		},

		dateIsDisabled: function(date){
			return (
				this.weekOfDateIsDisabled(date) ||
				$.grep(this.o.datesDisabled, function(d){
					return isUTCEquals(date, d);
				}).length > 0
			);
		},

		dateWithinRange: function(date){
			return date >= this.o.startDate && date <= this.o.endDate;
		},

		keydown: function(e){
			if (!this.picker.is(':visible')){
				if (e.keyCode === 40 || e.keyCode === 27) { // allow down to re-show picker
					this.show();
					e.stopPropagation();
        }
				return;
			}
			var dateChanged = false,
				dir, newViewDate,
				focusDate = this.focusDate || this.viewDate;
			switch (e.keyCode){
				case 27: // escape
					if (this.focusDate){
						this.focusDate = null;
						this.viewDate = this.dates.get(-1) || this.viewDate;
						this.fill();
					}
					else
						this.hide();
					e.preventDefault();
					e.stopPropagation();
					break;
				case 37: // left
				case 38: // up
				case 39: // right
				case 40: // down
					if (!this.o.keyboardNavigation || this.o.daysOfWeekDisabled.length === 7)
						break;
					dir = e.keyCode === 37 || e.keyCode === 38 ? -1 : 1;
          if (this.viewMode === 0) {
  					if (e.ctrlKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');

  						if (newViewDate)
  							this._trigger('changeYear', this.viewDate);
  					} else if (e.shiftKey){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');

  						if (newViewDate)
  							this._trigger('changeMonth', this.viewDate);
  					} else if (e.keyCode === 37 || e.keyCode === 39){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveDay');
  					} else if (!this.weekOfDateIsDisabled(focusDate)){
  						newViewDate = this.moveAvailableDate(focusDate, dir, 'moveWeek');
  					}
          } else if (this.viewMode === 1) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveMonth');
          } else if (this.viewMode === 2) {
            if (e.keyCode === 38 || e.keyCode === 40) {
              dir = dir * 4;
            }
            newViewDate = this.moveAvailableDate(focusDate, dir, 'moveYear');
          }
					if (newViewDate){
						this.focusDate = this.viewDate = newViewDate;
						this.setValue();
						this.fill();
						e.preventDefault();
					}
					break;
				case 13: // enter
					if (!this.o.forceParse)
						break;
					focusDate = this.focusDate || this.dates.get(-1) || this.viewDate;
					if (this.o.keyboardNavigation) {
						this._toggle_multidate(focusDate);
						dateChanged = true;
					}
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.setValue();
					this.fill();
					if (this.picker.is(':visible')){
						e.preventDefault();
						e.stopPropagation();
						if (this.o.autoclose)
							this.hide();
					}
					break;
				case 9: // tab
					this.focusDate = null;
					this.viewDate = this.dates.get(-1) || this.viewDate;
					this.fill();
					this.hide();
					break;
			}
			if (dateChanged){
				if (this.dates.length)
					this._trigger('changeDate');
				else
					this._trigger('clearDate');
				this.inputField.trigger('change');
			}
		},

		setViewMode: function(viewMode){
			this.viewMode = viewMode;
			this.picker
				.children('div')
				.hide()
				.filter('.datepicker-' + DPGlobal.viewModes[this.viewMode].clsName)
					.show();
			this.updateNavArrows();
      this._trigger('changeViewMode', new Date(this.viewDate));
		}
	};

	var DateRangePicker = function(element, options){
		$.data(element, 'datepicker', this);
		this.element = $(element);
		this.inputs = $.map(options.inputs, function(i){
			return i.jquery ? i[0] : i;
		});
		delete options.inputs;

		this.keepEmptyValues = options.keepEmptyValues;
		delete options.keepEmptyValues;

		datepickerPlugin.call($(this.inputs), options)
			.on('changeDate', $.proxy(this.dateUpdated, this));

		this.pickers = $.map(this.inputs, function(i){
			return $.data(i, 'datepicker');
		});
		this.updateDates();
	};
	DateRangePicker.prototype = {
		updateDates: function(){
			this.dates = $.map(this.pickers, function(i){
				return i.getUTCDate();
			});
			this.updateRanges();
		},
		updateRanges: function(){
			var range = $.map(this.dates, function(d){
				return d.valueOf();
			});
			$.each(this.pickers, function(i, p){
				p.setRange(range);
			});
		},
		clearDates: function(){
			$.each(this.pickers, function(i, p){
				p.clearDates();
			});
		},
		dateUpdated: function(e){
			// `this.updating` is a workaround for preventing infinite recursion
			// between `changeDate` triggering and `setUTCDate` calling.  Until
			// there is a better mechanism.
			if (this.updating)
				return;
			this.updating = true;

			var dp = $.data(e.target, 'datepicker');

			if (dp === undefined) {
				return;
			}

			var new_date = dp.getUTCDate(),
				keep_empty_values = this.keepEmptyValues,
				i = $.inArray(e.target, this.inputs),
				j = i - 1,
				k = i + 1,
				l = this.inputs.length;
			if (i === -1)
				return;

			$.each(this.pickers, function(i, p){
				if (!p.getUTCDate() && (p === dp || !keep_empty_values))
					p.setUTCDate(new_date);
			});

			if (new_date < this.dates[j]){
				// Date being moved earlier/left
				while (j >= 0 && new_date < this.dates[j]){
					this.pickers[j--].setUTCDate(new_date);
				}
			} else if (new_date > this.dates[k]){
				// Date being moved later/right
				while (k < l && new_date > this.dates[k]){
					this.pickers[k++].setUTCDate(new_date);
				}
			}
			this.updateDates();

			delete this.updating;
		},
		destroy: function(){
			$.map(this.pickers, function(p){ p.destroy(); });
			$(this.inputs).off('changeDate', this.dateUpdated);
			delete this.element.data().datepicker;
		},
		remove: alias('destroy', 'Method `remove` is deprecated and will be removed in version 2.0. Use `destroy` instead')
	};

	function opts_from_el(el, prefix){
		// Derive options from element data-attrs
		var data = $(el).data(),
			out = {}, inkey,
			replace = new RegExp('^' + prefix.toLowerCase() + '([A-Z])');
		prefix = new RegExp('^' + prefix.toLowerCase());
		function re_lower(_,a){
			return a.toLowerCase();
		}
		for (var key in data)
			if (prefix.test(key)){
				inkey = key.replace(replace, re_lower);
				out[inkey] = data[key];
			}
		return out;
	}

	function opts_from_locale(lang){
		// Derive options from locale plugins
		var out = {};
		// Check if "de-DE" style date is available, if not language should
		// fallback to 2 letter code eg "de"
		if (!dates[lang]){
			lang = lang.split('-')[0];
			if (!dates[lang])
				return;
		}
		var d = dates[lang];
		$.each(locale_opts, function(i,k){
			if (k in d)
				out[k] = d[k];
		});
		return out;
	}

	var old = $.fn.datepicker;
	var datepickerPlugin = function(option){
		var args = Array.apply(null, arguments);
		args.shift();
		var internal_return;
		this.each(function(){
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option === 'object' && option;
			if (!data){
				var elopts = opts_from_el(this, 'date'),
					// Preliminary otions
					xopts = $.extend({}, defaults, elopts, options),
					locopts = opts_from_locale(xopts.language),
					// Options priority: js args, data-attrs, locales, defaults
					opts = $.extend({}, defaults, locopts, elopts, options);
				if ($this.hasClass('input-daterange') || opts.inputs){
					$.extend(opts, {
						inputs: opts.inputs || $this.find('input').toArray()
					});
					data = new DateRangePicker(this, opts);
				}
				else {
					data = new Datepicker(this, opts);
				}
				$this.data('datepicker', data);
			}
			if (typeof option === 'string' && typeof data[option] === 'function'){
				internal_return = data[option].apply(data, args);
			}
		});

		if (
			internal_return === undefined ||
			internal_return instanceof Datepicker ||
			internal_return instanceof DateRangePicker
		)
			return this;

		if (this.length > 1)
			throw new Error('Using only allowed for the collection of a single element (' + option + ' function)');
		else
			return internal_return;
	};
	$.fn.datepicker = datepickerPlugin;

	var defaults = $.fn.datepicker.defaults = {
		assumeNearbyYear: false,
		autoclose: false,
		beforeShowDay: $.noop,
		beforeShowMonth: $.noop,
		beforeShowYear: $.noop,
		beforeShowDecade: $.noop,
		beforeShowCentury: $.noop,
		calendarWeeks: false,
		clearBtn: false,
		toggleActive: false,
		daysOfWeekDisabled: [],
		daysOfWeekHighlighted: [],
		datesDisabled: [],
		endDate: Infinity,
		forceParse: true,
		format: 'mm/dd/yyyy',
		keepEmptyValues: false,
		keyboardNavigation: true,
		language: 'en',
		minViewMode: 0,
		maxViewMode: 4,
		multidate: false,
		multidateSeparator: ',',
		orientation: "auto",
		rtl: false,
		startDate: -Infinity,
		startView: 0,
		todayBtn: false,
		todayHighlight: false,
		updateViewDate: true,
		weekStart: 0,
		disableTouchKeyboard: false,
		enableOnReadonly: true,
		showOnFocus: true,
		zIndexOffset: 10,
		container: 'body',
		immediateUpdates: false,
		title: '',
		templates: {
			leftArrow: '&#x00AB;',
			rightArrow: '&#x00BB;'
		},
    showWeekDays: true
	};
	var locale_opts = $.fn.datepicker.locale_opts = [
		'format',
		'rtl',
		'weekStart'
	];
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Today",
			clear: "Clear",
			titleFormat: "MM yyyy"
		}
	};

	var DPGlobal = {
		viewModes: [
			{
				names: ['days', 'month'],
				clsName: 'days',
				e: 'changeMonth'
			},
			{
				names: ['months', 'year'],
				clsName: 'months',
				e: 'changeYear',
				navStep: 1
			},
			{
				names: ['years', 'decade'],
				clsName: 'years',
				e: 'changeDecade',
				navStep: 10
			},
			{
				names: ['decades', 'century'],
				clsName: 'decades',
				e: 'changeCentury',
				navStep: 100
			},
			{
				names: ['centuries', 'millennium'],
				clsName: 'centuries',
				e: 'changeMillennium',
				navStep: 1000
			}
		],
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\u5e74\u6708\u65e5\[-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			if (typeof format.toValue === 'function' && typeof format.toDisplay === 'function')
                return format;
            // IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language, assumeNearby){
			if (!date)
				return undefined;
			if (date instanceof Date)
				return date;
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toValue)
				return format.toValue(date, format, language);
			var fn_map = {
					d: 'moveDay',
					m: 'moveMonth',
					w: 'moveWeek',
					y: 'moveYear'
				},
				dateAliases = {
					yesterday: '-1d',
					today: '+0d',
					tomorrow: '+1d'
				},
				parts, part, dir, i, fn;
			if (date in dateAliases){
				date = dateAliases[date];
			}
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/i.test(date)){
				parts = date.match(/([\-+]\d+)([dmwy])/gi);
				date = new Date();
				for (i=0; i < parts.length; i++){
					part = parts[i].match(/([\-+]\d+)([dmwy])/i);
					dir = Number(part[1]);
					fn = fn_map[part[2].toLowerCase()];
					date = Datepicker.prototype[fn](date, dir);
				}
				return Datepicker.prototype._zero_utc_time(date);
			}

			parts = date && date.match(this.nonpunctuation) || [];

			function applyNearbyYear(year, threshold){
				if (threshold === true)
					threshold = 10;

				// if year is 2 digits or less, than the user most likely is trying to get a recent century
				if (year < 100){
					year += 2000;
					// if the new year is more than threshold years in advance, use last century
					if (year > ((new Date()).getFullYear()+threshold)){
						year -= 100;
					}
				}

				return year;
			}

			var parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){
						return d.setUTCFullYear(assumeNearby ? applyNearbyYear(v, assumeNearby) : v);
					},
					m: function(d,v){
						if (isNaN(d))
							return d;
						v -= 1;
						while (v < 0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() !== v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){
						return d.setUTCDate(v);
					}
				},
				val, filtered;
			setters_map['yy'] = setters_map['yyyy'];
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCToday();
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length !== fparts.length){
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			function match_part(){
				var m = this.slice(0, parts[i].length),
					p = parts[i].slice(0, m.length);
				return m.toLowerCase() === p.toLowerCase();
			}
			if (parts.length === fparts.length){
				var cnt;
				for (i=0, cnt = fparts.length; i < cnt; i++){
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)){
						switch (part){
							case 'MM':
								filtered = $(dates[language].months).filter(match_part);
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(match_part);
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				var _date, s;
				for (i=0; i < setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s])){
						_date = new Date(date);
						setters_map[s](_date, parsed[s]);
						if (!isNaN(_date))
							date = _date;
					}
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			if (!date)
				return '';
			if (typeof format === 'string')
				format = DPGlobal.parseFormat(format);
			if (format.toDisplay)
                return format.toDisplay(date, format, language);
            var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			date = [];
			var seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i <= cnt; i++){
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
			              '<tr>'+
			                '<th colspan="7" class="datepicker-title"></th>'+
			              '</tr>'+
							'<tr>'+
								'<th class="prev">'+defaults.templates.leftArrow+'</th>'+
								'<th colspan="5" class="datepicker-switch"></th>'+
								'<th class="next">'+defaults.templates.rightArrow+'</th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot>'+
							'<tr>'+
								'<th colspan="7" class="today"></th>'+
							'</tr>'+
							'<tr>'+
								'<th colspan="7" class="clear"></th>'+
							'</tr>'+
						'</tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-decades">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-centuries">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;


	/* DATEPICKER NO CONFLICT
	* =================== */

	$.fn.datepicker.noConflict = function(){
		$.fn.datepicker = old;
		return this;
	};

	/* DATEPICKER VERSION
	 * =================== */
	$.fn.datepicker.version = '1.9.0';

	$.fn.datepicker.deprecated = function(msg){
		var console = window.console;
		if (console && console.warn) {
			console.warn('DEPRECATED: ' + msg);
		}
	};


	/* DATEPICKER DATA-API
	* ================== */

	$(document).on(
		'focus.datepicker.data-api click.datepicker.data-api',
		'[data-provide="datepicker"]',
		function(e){
			var $this = $(this);
			if ($this.data('datepicker'))
				return;
			e.preventDefault();
			// component click requires us to explicitly show it
			datepickerPlugin.call($this, 'show');
		}
	);
	$(function(){
		datepickerPlugin.call($('[data-provide="datepicker-inline"]'));
	});

}));


/***/ }),

/***/ "./node_modules/jquery.placeholder/jquery.placeholder.js":
/*!***************************************************************!*\
  !*** ./node_modules/jquery.placeholder/jquery.placeholder.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*! http://mths.be/placeholder v2.0.8 by @mathias */
var jQuery = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

;(function(window, document, $) {

	// Opera Mini v7 doesn’t support placeholder although its DOM seems to indicate so
	var isOperaMini = Object.prototype.toString.call(window.operamini) == '[object OperaMini]';
	var isInputSupported = 'placeholder' in document.createElement('input') && !isOperaMini;
	var isTextareaSupported = 'placeholder' in document.createElement('textarea') && !isOperaMini;
	var prototype = $.fn;
	var valHooks = $.valHooks;
	var propHooks = $.propHooks;
	var hooks;
	var placeholder;

	if (isInputSupported && isTextareaSupported) {

		placeholder = prototype.placeholder = function() {
			return this;
		};

		placeholder.input = placeholder.textarea = true;

	} else {

		placeholder = prototype.placeholder = function() {
			var $this = this;
			$this
				.filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
				.not('.placeholder')
				.bind({
					'focus.placeholder': clearPlaceholder,
					'blur.placeholder': setPlaceholder
				})
				.data('placeholder-enabled', true)
				.trigger('blur.placeholder');
			return $this;
		};

		placeholder.input = isInputSupported;
		placeholder.textarea = isTextareaSupported;

		hooks = {
			'get': function(element) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value;
				}

				return $element.data('placeholder-enabled') && $element.hasClass('placeholder') ? '' : element.value;
			},
			'set': function(element, value) {
				var $element = $(element);

				var $passwordInput = $element.data('placeholder-password');
				if ($passwordInput) {
					return $passwordInput[0].value = value;
				}

				if (!$element.data('placeholder-enabled')) {
					return element.value = value;
				}
				if (value == '') {
					element.value = value;
					// Issue #56: Setting the placeholder causes problems if the element continues to have focus.
					if (element != safeActiveElement()) {
						// We can't use `triggerHandler` here because of dummy text/password inputs :(
						setPlaceholder.call(element);
					}
				} else if ($element.hasClass('placeholder')) {
					clearPlaceholder.call(element, true, value) || (element.value = value);
				} else {
					element.value = value;
				}
				// `set` can not return `undefined`; see http://jsapi.info/jquery/1.7.1/val#L2363
				return $element;
			}
		};

		if (!isInputSupported) {
			valHooks.input = hooks;
			propHooks.value = hooks;
		}
		if (!isTextareaSupported) {
			valHooks.textarea = hooks;
			propHooks.value = hooks;
		}

		$(function() {
			// Look for forms
			$(document).delegate('form', 'submit.placeholder', function() {
				// Clear the placeholder values so they don't get submitted
				var $inputs = $('.placeholder', this).each(clearPlaceholder);
				setTimeout(function() {
					$inputs.each(setPlaceholder);
				}, 10);
			});
		});

		// Clear placeholder values upon page reload
		$(window).bind('beforeunload.placeholder', function() {
			$('.placeholder').each(function() {
				this.value = '';
			});
		});

	}

	function args(elem) {
		// Return an object of element attributes
		var newAttrs = {};
		var rinlinejQuery = /^jQuery\d+$/;
		$.each(elem.attributes, function(i, attr) {
			if (attr.specified && !rinlinejQuery.test(attr.name)) {
				newAttrs[attr.name] = attr.value;
			}
		});
		return newAttrs;
	}

	function clearPlaceholder(event, value) {
		var input = this;
		var $input = $(input);
		if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
			if ($input.data('placeholder-password')) {
				$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
				// If `clearPlaceholder` was called from `$.valHooks.input.set`
				if (event === true) {
					return $input[0].value = value;
				}
				$input.focus();
			} else {
				input.value = '';
				$input.removeClass('placeholder');
				input == safeActiveElement() && input.select();
			}
		}
	}

	function setPlaceholder() {
		var $replacement;
		var input = this;
		var $input = $(input);
		var id = this.id;
		if (input.value == '') {
			if (input.type == 'password') {
				if (!$input.data('placeholder-textinput')) {
					try {
						$replacement = $input.clone().attr({ 'type': 'text' });
					} catch(e) {
						$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
					}
					$replacement
						.removeAttr('name')
						.data({
							'placeholder-password': $input,
							'placeholder-id': id
						})
						.bind('focus.placeholder', clearPlaceholder);
					$input
						.data({
							'placeholder-textinput': $replacement,
							'placeholder-id': id
						})
						.before($replacement);
				}
				$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
				// Note: `$input[0] != input` now!
			}
			$input.addClass('placeholder');
			$input[0].value = $input.attr('placeholder');
		} else {
			$input.removeClass('placeholder');
		}
	}

	function safeActiveElement() {
		// Avoid IE9 `document.activeElement` of death
		// https://github.com/mathiasbynens/jquery-placeholder/pull/99
		try {
			return document.activeElement;
		} catch (exception) {}
	}

}(this, document, jQuery));


/***/ }),

/***/ "./node_modules/magnific-popup/dist/jquery.magnific-popup.js":
/*!*******************************************************************!*\
  !*** ./node_modules/magnific-popup/dist/jquery.magnific-popup.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! Magnific Popup - v1.1.0 - 2016-02-20
* http://dimsemenov.com/plugins/magnific-popup/
* Copyright (c) 2016 Dmitry Semenov; */
;(function (factory) { 
if (true) { 
 // AMD. Register as an anonymous module. 
 !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); 
 } else {} 
 }(function($) { 

/*>>core*/
/**
 * 
 * Magnific Popup Core JS file
 * 
 */


/**
 * Private static constants
 */
var CLOSE_EVENT = 'Close',
	BEFORE_CLOSE_EVENT = 'BeforeClose',
	AFTER_CLOSE_EVENT = 'AfterClose',
	BEFORE_APPEND_EVENT = 'BeforeAppend',
	MARKUP_PARSE_EVENT = 'MarkupParse',
	OPEN_EVENT = 'Open',
	CHANGE_EVENT = 'Change',
	NS = 'mfp',
	EVENT_NS = '.' + NS,
	READY_CLASS = 'mfp-ready',
	REMOVING_CLASS = 'mfp-removing',
	PREVENT_CLOSE_CLASS = 'mfp-prevent-close';


/**
 * Private vars 
 */
/*jshint -W079 */
var mfp, // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
	MagnificPopup = function(){},
	_isJQ = !!(window.jQuery),
	_prevStatus,
	_window = $(window),
	_document,
	_prevContentType,
	_wrapClasses,
	_currPopupType;


/**
 * Private functions
 */
var _mfpOn = function(name, f) {
		mfp.ev.on(NS + name + EVENT_NS, f);
	},
	_getEl = function(className, appendTo, html, raw) {
		var el = document.createElement('div');
		el.className = 'mfp-'+className;
		if(html) {
			el.innerHTML = html;
		}
		if(!raw) {
			el = $(el);
			if(appendTo) {
				el.appendTo(appendTo);
			}
		} else if(appendTo) {
			appendTo.appendChild(el);
		}
		return el;
	},
	_mfpTrigger = function(e, data) {
		mfp.ev.triggerHandler(NS + e, data);

		if(mfp.st.callbacks) {
			// converts "mfpEventName" to "eventName" callback and triggers it if it's present
			e = e.charAt(0).toLowerCase() + e.slice(1);
			if(mfp.st.callbacks[e]) {
				mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
			}
		}
	},
	_getCloseBtn = function(type) {
		if(type !== _currPopupType || !mfp.currTemplate.closeBtn) {
			mfp.currTemplate.closeBtn = $( mfp.st.closeMarkup.replace('%title%', mfp.st.tClose ) );
			_currPopupType = type;
		}
		return mfp.currTemplate.closeBtn;
	},
	// Initialize Magnific Popup only when called at least once
	_checkInstance = function() {
		if(!$.magnificPopup.instance) {
			/*jshint -W020 */
			mfp = new MagnificPopup();
			mfp.init();
			$.magnificPopup.instance = mfp;
		}
	},
	// CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
	supportsTransitions = function() {
		var s = document.createElement('p').style, // 's' for style. better to create an element if body yet to exist
			v = ['ms','O','Moz','Webkit']; // 'v' for vendor

		if( s['transition'] !== undefined ) {
			return true; 
		}
			
		while( v.length ) {
			if( v.pop() + 'Transition' in s ) {
				return true;
			}
		}
				
		return false;
	};



/**
 * Public functions
 */
MagnificPopup.prototype = {

	constructor: MagnificPopup,

	/**
	 * Initializes Magnific Popup plugin. 
	 * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
	 */
	init: function() {
		var appVersion = navigator.appVersion;
		mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
		mfp.isAndroid = (/android/gi).test(appVersion);
		mfp.isIOS = (/iphone|ipad|ipod/gi).test(appVersion);
		mfp.supportsTransition = supportsTransitions();

		// We disable fixed positioned lightbox on devices that don't handle it nicely.
		// If you know a better way of detecting this - let me know.
		mfp.probablyMobile = (mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent) );
		_document = $(document);

		mfp.popupsCache = {};
	},

	/**
	 * Opens popup
	 * @param  data [description]
	 */
	open: function(data) {

		var i;

		if(data.isObj === false) { 
			// convert jQuery collection to array to avoid conflicts later
			mfp.items = data.items.toArray();

			mfp.index = 0;
			var items = data.items,
				item;
			for(i = 0; i < items.length; i++) {
				item = items[i];
				if(item.parsed) {
					item = item.el[0];
				}
				if(item === data.el[0]) {
					mfp.index = i;
					break;
				}
			}
		} else {
			mfp.items = $.isArray(data.items) ? data.items : [data.items];
			mfp.index = data.index || 0;
		}

		// if popup is already opened - we just update the content
		if(mfp.isOpen) {
			mfp.updateItemHTML();
			return;
		}
		
		mfp.types = []; 
		_wrapClasses = '';
		if(data.mainEl && data.mainEl.length) {
			mfp.ev = data.mainEl.eq(0);
		} else {
			mfp.ev = _document;
		}

		if(data.key) {
			if(!mfp.popupsCache[data.key]) {
				mfp.popupsCache[data.key] = {};
			}
			mfp.currTemplate = mfp.popupsCache[data.key];
		} else {
			mfp.currTemplate = {};
		}



		mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data ); 
		mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

		if(mfp.st.modal) {
			mfp.st.closeOnContentClick = false;
			mfp.st.closeOnBgClick = false;
			mfp.st.showCloseBtn = false;
			mfp.st.enableEscapeKey = false;
		}
		

		// Building markup
		// main containers are created only once
		if(!mfp.bgOverlay) {

			// Dark overlay
			mfp.bgOverlay = _getEl('bg').on('click'+EVENT_NS, function() {
				mfp.close();
			});

			mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click'+EVENT_NS, function(e) {
				if(mfp._checkIfClose(e.target)) {
					mfp.close();
				}
			});

			mfp.container = _getEl('container', mfp.wrap);
		}

		mfp.contentContainer = _getEl('content');
		if(mfp.st.preloader) {
			mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
		}


		// Initializing modules
		var modules = $.magnificPopup.modules;
		for(i = 0; i < modules.length; i++) {
			var n = modules[i];
			n = n.charAt(0).toUpperCase() + n.slice(1);
			mfp['init'+n].call(mfp);
		}
		_mfpTrigger('BeforeOpen');


		if(mfp.st.showCloseBtn) {
			// Close button
			if(!mfp.st.closeBtnInside) {
				mfp.wrap.append( _getCloseBtn() );
			} else {
				_mfpOn(MARKUP_PARSE_EVENT, function(e, template, values, item) {
					values.close_replaceWith = _getCloseBtn(item.type);
				});
				_wrapClasses += ' mfp-close-btn-in';
			}
		}

		if(mfp.st.alignTop) {
			_wrapClasses += ' mfp-align-top';
		}

	

		if(mfp.fixedContentPos) {
			mfp.wrap.css({
				overflow: mfp.st.overflowY,
				overflowX: 'hidden',
				overflowY: mfp.st.overflowY
			});
		} else {
			mfp.wrap.css({ 
				top: _window.scrollTop(),
				position: 'absolute'
			});
		}
		if( mfp.st.fixedBgPos === false || (mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) ) {
			mfp.bgOverlay.css({
				height: _document.height(),
				position: 'absolute'
			});
		}

		

		if(mfp.st.enableEscapeKey) {
			// Close on ESC key
			_document.on('keyup' + EVENT_NS, function(e) {
				if(e.keyCode === 27) {
					mfp.close();
				}
			});
		}

		_window.on('resize' + EVENT_NS, function() {
			mfp.updateSize();
		});


		if(!mfp.st.closeOnContentClick) {
			_wrapClasses += ' mfp-auto-cursor';
		}
		
		if(_wrapClasses)
			mfp.wrap.addClass(_wrapClasses);


		// this triggers recalculation of layout, so we get it once to not to trigger twice
		var windowHeight = mfp.wH = _window.height();

		
		var windowStyles = {};

		if( mfp.fixedContentPos ) {
            if(mfp._hasScrollBar(windowHeight)){
                var s = mfp._getScrollbarSize();
                if(s) {
                    windowStyles.marginRight = s;
                }
            }
        }

		if(mfp.fixedContentPos) {
			if(!mfp.isIE7) {
				windowStyles.overflow = 'hidden';
			} else {
				// ie7 double-scroll bug
				$('body, html').css('overflow', 'hidden');
			}
		}

		
		
		var classesToadd = mfp.st.mainClass;
		if(mfp.isIE7) {
			classesToadd += ' mfp-ie7';
		}
		if(classesToadd) {
			mfp._addClassToMFP( classesToadd );
		}

		// add content
		mfp.updateItemHTML();

		_mfpTrigger('BuildControls');

		// remove scrollbar, add margin e.t.c
		$('html').css(windowStyles);
		
		// add everything to DOM
		mfp.bgOverlay.add(mfp.wrap).prependTo( mfp.st.prependTo || $(document.body) );

		// Save last focused element
		mfp._lastFocusedEl = document.activeElement;
		
		// Wait for next cycle to allow CSS transition
		setTimeout(function() {
			
			if(mfp.content) {
				mfp._addClassToMFP(READY_CLASS);
				mfp._setFocus();
			} else {
				// if content is not defined (not loaded e.t.c) we add class only for BG
				mfp.bgOverlay.addClass(READY_CLASS);
			}
			
			// Trap the focus in popup
			_document.on('focusin' + EVENT_NS, mfp._onFocusIn);

		}, 16);

		mfp.isOpen = true;
		mfp.updateSize(windowHeight);
		_mfpTrigger(OPEN_EVENT);

		return data;
	},

	/**
	 * Closes the popup
	 */
	close: function() {
		if(!mfp.isOpen) return;
		_mfpTrigger(BEFORE_CLOSE_EVENT);

		mfp.isOpen = false;
		// for CSS3 animation
		if(mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition )  {
			mfp._addClassToMFP(REMOVING_CLASS);
			setTimeout(function() {
				mfp._close();
			}, mfp.st.removalDelay);
		} else {
			mfp._close();
		}
	},

	/**
	 * Helper for close() function
	 */
	_close: function() {
		_mfpTrigger(CLOSE_EVENT);

		var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';

		mfp.bgOverlay.detach();
		mfp.wrap.detach();
		mfp.container.empty();

		if(mfp.st.mainClass) {
			classesToRemove += mfp.st.mainClass + ' ';
		}

		mfp._removeClassFromMFP(classesToRemove);

		if(mfp.fixedContentPos) {
			var windowStyles = {marginRight: ''};
			if(mfp.isIE7) {
				$('body, html').css('overflow', '');
			} else {
				windowStyles.overflow = '';
			}
			$('html').css(windowStyles);
		}
		
		_document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);
		mfp.ev.off(EVENT_NS);

		// clean up DOM elements that aren't removed
		mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
		mfp.bgOverlay.attr('class', 'mfp-bg');
		mfp.container.attr('class', 'mfp-container');

		// remove close button from target element
		if(mfp.st.showCloseBtn &&
		(!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
			if(mfp.currTemplate.closeBtn)
				mfp.currTemplate.closeBtn.detach();
		}


		if(mfp.st.autoFocusLast && mfp._lastFocusedEl) {
			$(mfp._lastFocusedEl).focus(); // put tab focus back
		}
		mfp.currItem = null;	
		mfp.content = null;
		mfp.currTemplate = null;
		mfp.prevHeight = 0;

		_mfpTrigger(AFTER_CLOSE_EVENT);
	},
	
	updateSize: function(winHeight) {

		if(mfp.isIOS) {
			// fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
			var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
			var height = window.innerHeight * zoomLevel;
			mfp.wrap.css('height', height);
			mfp.wH = height;
		} else {
			mfp.wH = winHeight || _window.height();
		}
		// Fixes #84: popup incorrectly positioned with position:relative on body
		if(!mfp.fixedContentPos) {
			mfp.wrap.css('height', mfp.wH);
		}

		_mfpTrigger('Resize');

	},

	/**
	 * Set content of popup based on current index
	 */
	updateItemHTML: function() {
		var item = mfp.items[mfp.index];

		// Detach and perform modifications
		mfp.contentContainer.detach();

		if(mfp.content)
			mfp.content.detach();

		if(!item.parsed) {
			item = mfp.parseEl( mfp.index );
		}

		var type = item.type;

		_mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]);
		// BeforeChange event works like so:
		// _mfpOn('BeforeChange', function(e, prevType, newType) { });

		mfp.currItem = item;

		if(!mfp.currTemplate[type]) {
			var markup = mfp.st[type] ? mfp.st[type].markup : false;

			// allows to modify markup
			_mfpTrigger('FirstMarkupParse', markup);

			if(markup) {
				mfp.currTemplate[type] = $(markup);
			} else {
				// if there is no markup found we just define that template is parsed
				mfp.currTemplate[type] = true;
			}
		}

		if(_prevContentType && _prevContentType !== item.type) {
			mfp.container.removeClass('mfp-'+_prevContentType+'-holder');
		}

		var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
		mfp.appendContent(newContent, type);

		item.preloaded = true;

		_mfpTrigger(CHANGE_EVENT, item);
		_prevContentType = item.type;

		// Append container back after its content changed
		mfp.container.prepend(mfp.contentContainer);

		_mfpTrigger('AfterChange');
	},


	/**
	 * Set HTML content of popup
	 */
	appendContent: function(newContent, type) {
		mfp.content = newContent;

		if(newContent) {
			if(mfp.st.showCloseBtn && mfp.st.closeBtnInside &&
				mfp.currTemplate[type] === true) {
				// if there is no markup, we just append close button element inside
				if(!mfp.content.find('.mfp-close').length) {
					mfp.content.append(_getCloseBtn());
				}
			} else {
				mfp.content = newContent;
			}
		} else {
			mfp.content = '';
		}

		_mfpTrigger(BEFORE_APPEND_EVENT);
		mfp.container.addClass('mfp-'+type+'-holder');

		mfp.contentContainer.append(mfp.content);
	},


	/**
	 * Creates Magnific Popup data object based on given data
	 * @param  {int} index Index of item to parse
	 */
	parseEl: function(index) {
		var item = mfp.items[index],
			type;

		if(item.tagName) {
			item = { el: $(item) };
		} else {
			type = item.type;
			item = { data: item, src: item.src };
		}

		if(item.el) {
			var types = mfp.types;

			// check for 'mfp-TYPE' class
			for(var i = 0; i < types.length; i++) {
				if( item.el.hasClass('mfp-'+types[i]) ) {
					type = types[i];
					break;
				}
			}

			item.src = item.el.attr('data-mfp-src');
			if(!item.src) {
				item.src = item.el.attr('href');
			}
		}

		item.type = type || mfp.st.type || 'inline';
		item.index = index;
		item.parsed = true;
		mfp.items[index] = item;
		_mfpTrigger('ElementParse', item);

		return mfp.items[index];
	},


	/**
	 * Initializes single popup or a group of popups
	 */
	addGroup: function(el, options) {
		var eHandler = function(e) {
			e.mfpEl = this;
			mfp._openClick(e, el, options);
		};

		if(!options) {
			options = {};
		}

		var eName = 'click.magnificPopup';
		options.mainEl = el;

		if(options.items) {
			options.isObj = true;
			el.off(eName).on(eName, eHandler);
		} else {
			options.isObj = false;
			if(options.delegate) {
				el.off(eName).on(eName, options.delegate , eHandler);
			} else {
				options.items = el;
				el.off(eName).on(eName, eHandler);
			}
		}
	},
	_openClick: function(e, el, options) {
		var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;


		if(!midClick && ( e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey ) ) {
			return;
		}

		var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

		if(disableOn) {
			if($.isFunction(disableOn)) {
				if( !disableOn.call(mfp) ) {
					return true;
				}
			} else { // else it's number
				if( _window.width() < disableOn ) {
					return true;
				}
			}
		}

		if(e.type) {
			e.preventDefault();

			// This will prevent popup from closing if element is inside and popup is already opened
			if(mfp.isOpen) {
				e.stopPropagation();
			}
		}

		options.el = $(e.mfpEl);
		if(options.delegate) {
			options.items = el.find(options.delegate);
		}
		mfp.open(options);
	},


	/**
	 * Updates text on preloader
	 */
	updateStatus: function(status, text) {

		if(mfp.preloader) {
			if(_prevStatus !== status) {
				mfp.container.removeClass('mfp-s-'+_prevStatus);
			}

			if(!text && status === 'loading') {
				text = mfp.st.tLoading;
			}

			var data = {
				status: status,
				text: text
			};
			// allows to modify status
			_mfpTrigger('UpdateStatus', data);

			status = data.status;
			text = data.text;

			mfp.preloader.html(text);

			mfp.preloader.find('a').on('click', function(e) {
				e.stopImmediatePropagation();
			});

			mfp.container.addClass('mfp-s-'+status);
			_prevStatus = status;
		}
	},


	/*
		"Private" helpers that aren't private at all
	 */
	// Check to close popup or not
	// "target" is an element that was clicked
	_checkIfClose: function(target) {

		if($(target).hasClass(PREVENT_CLOSE_CLASS)) {
			return;
		}

		var closeOnContent = mfp.st.closeOnContentClick;
		var closeOnBg = mfp.st.closeOnBgClick;

		if(closeOnContent && closeOnBg) {
			return true;
		} else {

			// We close the popup if click is on close button or on preloader. Or if there is no content.
			if(!mfp.content || $(target).hasClass('mfp-close') || (mfp.preloader && target === mfp.preloader[0]) ) {
				return true;
			}

			// if click is outside the content
			if(  (target !== mfp.content[0] && !$.contains(mfp.content[0], target))  ) {
				if(closeOnBg) {
					// last check, if the clicked element is in DOM, (in case it's removed onclick)
					if( $.contains(document, target) ) {
						return true;
					}
				}
			} else if(closeOnContent) {
				return true;
			}

		}
		return false;
	},
	_addClassToMFP: function(cName) {
		mfp.bgOverlay.addClass(cName);
		mfp.wrap.addClass(cName);
	},
	_removeClassFromMFP: function(cName) {
		this.bgOverlay.removeClass(cName);
		mfp.wrap.removeClass(cName);
	},
	_hasScrollBar: function(winHeight) {
		return (  (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height()) );
	},
	_setFocus: function() {
		(mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
	},
	_onFocusIn: function(e) {
		if( e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target) ) {
			mfp._setFocus();
			return false;
		}
	},
	_parseMarkup: function(template, values, item) {
		var arr;
		if(item.data) {
			values = $.extend(item.data, values);
		}
		_mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item] );

		$.each(values, function(key, value) {
			if(value === undefined || value === false) {
				return true;
			}
			arr = key.split('_');
			if(arr.length > 1) {
				var el = template.find(EVENT_NS + '-'+arr[0]);

				if(el.length > 0) {
					var attr = arr[1];
					if(attr === 'replaceWith') {
						if(el[0] !== value[0]) {
							el.replaceWith(value);
						}
					} else if(attr === 'img') {
						if(el.is('img')) {
							el.attr('src', value);
						} else {
							el.replaceWith( $('<img>').attr('src', value).attr('class', el.attr('class')) );
						}
					} else {
						el.attr(arr[1], value);
					}
				}

			} else {
				template.find(EVENT_NS + '-'+key).html(value);
			}
		});
	},

	_getScrollbarSize: function() {
		// thx David
		if(mfp.scrollbarSize === undefined) {
			var scrollDiv = document.createElement("div");
			scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
			document.body.appendChild(scrollDiv);
			mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
			document.body.removeChild(scrollDiv);
		}
		return mfp.scrollbarSize;
	}

}; /* MagnificPopup core prototype end */




/**
 * Public static functions
 */
$.magnificPopup = {
	instance: null,
	proto: MagnificPopup.prototype,
	modules: [],

	open: function(options, index) {
		_checkInstance();

		if(!options) {
			options = {};
		} else {
			options = $.extend(true, {}, options);
		}

		options.isObj = true;
		options.index = index || 0;
		return this.instance.open(options);
	},

	close: function() {
		return $.magnificPopup.instance && $.magnificPopup.instance.close();
	},

	registerModule: function(name, module) {
		if(module.options) {
			$.magnificPopup.defaults[name] = module.options;
		}
		$.extend(this.proto, module.proto);
		this.modules.push(name);
	},

	defaults: {

		// Info about options is in docs:
		// http://dimsemenov.com/plugins/magnific-popup/documentation.html#options

		disableOn: 0,

		key: null,

		midClick: false,

		mainClass: '',

		preloader: true,

		focus: '', // CSS selector of input to focus after popup is opened

		closeOnContentClick: false,

		closeOnBgClick: true,

		closeBtnInside: true,

		showCloseBtn: true,

		enableEscapeKey: true,

		modal: false,

		alignTop: false,

		removalDelay: 0,

		prependTo: null,

		fixedContentPos: 'auto',

		fixedBgPos: 'auto',

		overflowY: 'auto',

		closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',

		tClose: 'Close (Esc)',

		tLoading: 'Loading...',

		autoFocusLast: true

	}
};



$.fn.magnificPopup = function(options) {
	_checkInstance();

	var jqEl = $(this);

	// We call some API method of first param is a string
	if (typeof options === "string" ) {

		if(options === 'open') {
			var items,
				itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
				index = parseInt(arguments[1], 10) || 0;

			if(itemOpts.items) {
				items = itemOpts.items[index];
			} else {
				items = jqEl;
				if(itemOpts.delegate) {
					items = items.find(itemOpts.delegate);
				}
				items = items.eq( index );
			}
			mfp._openClick({mfpEl:items}, jqEl, itemOpts);
		} else {
			if(mfp.isOpen)
				mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
		}

	} else {
		// clone options obj
		options = $.extend(true, {}, options);

		/*
		 * As Zepto doesn't support .data() method for objects
		 * and it works only in normal browsers
		 * we assign "options" object directly to the DOM element. FTW!
		 */
		if(_isJQ) {
			jqEl.data('magnificPopup', options);
		} else {
			jqEl[0].magnificPopup = options;
		}

		mfp.addGroup(jqEl, options);

	}
	return jqEl;
};

/*>>core*/

/*>>inline*/

var INLINE_NS = 'inline',
	_hiddenClass,
	_inlinePlaceholder,
	_lastInlineElement,
	_putInlineElementsBack = function() {
		if(_lastInlineElement) {
			_inlinePlaceholder.after( _lastInlineElement.addClass(_hiddenClass) ).detach();
			_lastInlineElement = null;
		}
	};

$.magnificPopup.registerModule(INLINE_NS, {
	options: {
		hiddenClass: 'hide', // will be appended with `mfp-` prefix
		markup: '',
		tNotFound: 'Content not found'
	},
	proto: {

		initInline: function() {
			mfp.types.push(INLINE_NS);

			_mfpOn(CLOSE_EVENT+'.'+INLINE_NS, function() {
				_putInlineElementsBack();
			});
		},

		getInline: function(item, template) {

			_putInlineElementsBack();

			if(item.src) {
				var inlineSt = mfp.st.inline,
					el = $(item.src);

				if(el.length) {

					// If target element has parent - we replace it with placeholder and put it back after popup is closed
					var parent = el[0].parentNode;
					if(parent && parent.tagName) {
						if(!_inlinePlaceholder) {
							_hiddenClass = inlineSt.hiddenClass;
							_inlinePlaceholder = _getEl(_hiddenClass);
							_hiddenClass = 'mfp-'+_hiddenClass;
						}
						// replace target inline element with placeholder
						_lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
					}

					mfp.updateStatus('ready');
				} else {
					mfp.updateStatus('error', inlineSt.tNotFound);
					el = $('<div>');
				}

				item.inlineElement = el;
				return el;
			}

			mfp.updateStatus('ready');
			mfp._parseMarkup(template, {}, item);
			return template;
		}
	}
});

/*>>inline*/

/*>>ajax*/
var AJAX_NS = 'ajax',
	_ajaxCur,
	_removeAjaxCursor = function() {
		if(_ajaxCur) {
			$(document.body).removeClass(_ajaxCur);
		}
	},
	_destroyAjaxRequest = function() {
		_removeAjaxCursor();
		if(mfp.req) {
			mfp.req.abort();
		}
	};

$.magnificPopup.registerModule(AJAX_NS, {

	options: {
		settings: null,
		cursor: 'mfp-ajax-cur',
		tError: '<a href="%url%">The content</a> could not be loaded.'
	},

	proto: {
		initAjax: function() {
			mfp.types.push(AJAX_NS);
			_ajaxCur = mfp.st.ajax.cursor;

			_mfpOn(CLOSE_EVENT+'.'+AJAX_NS, _destroyAjaxRequest);
			_mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
		},
		getAjax: function(item) {

			if(_ajaxCur) {
				$(document.body).addClass(_ajaxCur);
			}

			mfp.updateStatus('loading');

			var opts = $.extend({
				url: item.src,
				success: function(data, textStatus, jqXHR) {
					var temp = {
						data:data,
						xhr:jqXHR
					};

					_mfpTrigger('ParseAjax', temp);

					mfp.appendContent( $(temp.data), AJAX_NS );

					item.finished = true;

					_removeAjaxCursor();

					mfp._setFocus();

					setTimeout(function() {
						mfp.wrap.addClass(READY_CLASS);
					}, 16);

					mfp.updateStatus('ready');

					_mfpTrigger('AjaxContentAdded');
				},
				error: function() {
					_removeAjaxCursor();
					item.finished = item.loadError = true;
					mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
				}
			}, mfp.st.ajax.settings);

			mfp.req = $.ajax(opts);

			return '';
		}
	}
});

/*>>ajax*/

/*>>image*/
var _imgInterval,
	_getTitle = function(item) {
		if(item.data && item.data.title !== undefined)
			return item.data.title;

		var src = mfp.st.image.titleSrc;

		if(src) {
			if($.isFunction(src)) {
				return src.call(mfp, item);
			} else if(item.el) {
				return item.el.attr(src) || '';
			}
		}
		return '';
	};

$.magnificPopup.registerModule('image', {

	options: {
		markup: '<div class="mfp-figure">'+
					'<div class="mfp-close"></div>'+
					'<figure>'+
						'<div class="mfp-img"></div>'+
						'<figcaption>'+
							'<div class="mfp-bottom-bar">'+
								'<div class="mfp-title"></div>'+
								'<div class="mfp-counter"></div>'+
							'</div>'+
						'</figcaption>'+
					'</figure>'+
				'</div>',
		cursor: 'mfp-zoom-out-cur',
		titleSrc: 'title',
		verticalFit: true,
		tError: '<a href="%url%">The image</a> could not be loaded.'
	},

	proto: {
		initImage: function() {
			var imgSt = mfp.st.image,
				ns = '.image';

			mfp.types.push('image');

			_mfpOn(OPEN_EVENT+ns, function() {
				if(mfp.currItem.type === 'image' && imgSt.cursor) {
					$(document.body).addClass(imgSt.cursor);
				}
			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(imgSt.cursor) {
					$(document.body).removeClass(imgSt.cursor);
				}
				_window.off('resize' + EVENT_NS);
			});

			_mfpOn('Resize'+ns, mfp.resizeImage);
			if(mfp.isLowIE) {
				_mfpOn('AfterChange', mfp.resizeImage);
			}
		},
		resizeImage: function() {
			var item = mfp.currItem;
			if(!item || !item.img) return;

			if(mfp.st.image.verticalFit) {
				var decr = 0;
				// fix box-sizing in ie7/8
				if(mfp.isLowIE) {
					decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'),10);
				}
				item.img.css('max-height', mfp.wH-decr);
			}
		},
		_onImageHasSize: function(item) {
			if(item.img) {

				item.hasSize = true;

				if(_imgInterval) {
					clearInterval(_imgInterval);
				}

				item.isCheckingImgSize = false;

				_mfpTrigger('ImageHasSize', item);

				if(item.imgHidden) {
					if(mfp.content)
						mfp.content.removeClass('mfp-loading');

					item.imgHidden = false;
				}

			}
		},

		/**
		 * Function that loops until the image has size to display elements that rely on it asap
		 */
		findImageSize: function(item) {

			var counter = 0,
				img = item.img[0],
				mfpSetInterval = function(delay) {

					if(_imgInterval) {
						clearInterval(_imgInterval);
					}
					// decelerating interval that checks for size of an image
					_imgInterval = setInterval(function() {
						if(img.naturalWidth > 0) {
							mfp._onImageHasSize(item);
							return;
						}

						if(counter > 200) {
							clearInterval(_imgInterval);
						}

						counter++;
						if(counter === 3) {
							mfpSetInterval(10);
						} else if(counter === 40) {
							mfpSetInterval(50);
						} else if(counter === 100) {
							mfpSetInterval(500);
						}
					}, delay);
				};

			mfpSetInterval(1);
		},

		getImage: function(item, template) {

			var guard = 0,

				// image load complete handler
				onLoadComplete = function() {
					if(item) {
						if (item.img[0].complete) {
							item.img.off('.mfploader');

							if(item === mfp.currItem){
								mfp._onImageHasSize(item);

								mfp.updateStatus('ready');
							}

							item.hasSize = true;
							item.loaded = true;

							_mfpTrigger('ImageLoadComplete');

						}
						else {
							// if image complete check fails 200 times (20 sec), we assume that there was an error.
							guard++;
							if(guard < 200) {
								setTimeout(onLoadComplete,100);
							} else {
								onLoadError();
							}
						}
					}
				},

				// image error handler
				onLoadError = function() {
					if(item) {
						item.img.off('.mfploader');
						if(item === mfp.currItem){
							mfp._onImageHasSize(item);
							mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
						}

						item.hasSize = true;
						item.loaded = true;
						item.loadError = true;
					}
				},
				imgSt = mfp.st.image;


			var el = template.find('.mfp-img');
			if(el.length) {
				var img = document.createElement('img');
				img.className = 'mfp-img';
				if(item.el && item.el.find('img').length) {
					img.alt = item.el.find('img').attr('alt');
				}
				item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
				img.src = item.src;

				// without clone() "error" event is not firing when IMG is replaced by new IMG
				// TODO: find a way to avoid such cloning
				if(el.is('img')) {
					item.img = item.img.clone();
				}

				img = item.img[0];
				if(img.naturalWidth > 0) {
					item.hasSize = true;
				} else if(!img.width) {
					item.hasSize = false;
				}
			}

			mfp._parseMarkup(template, {
				title: _getTitle(item),
				img_replaceWith: item.img
			}, item);

			mfp.resizeImage();

			if(item.hasSize) {
				if(_imgInterval) clearInterval(_imgInterval);

				if(item.loadError) {
					template.addClass('mfp-loading');
					mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src) );
				} else {
					template.removeClass('mfp-loading');
					mfp.updateStatus('ready');
				}
				return template;
			}

			mfp.updateStatus('loading');
			item.loading = true;

			if(!item.hasSize) {
				item.imgHidden = true;
				template.addClass('mfp-loading');
				mfp.findImageSize(item);
			}

			return template;
		}
	}
});

/*>>image*/

/*>>zoom*/
var hasMozTransform,
	getHasMozTransform = function() {
		if(hasMozTransform === undefined) {
			hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
		}
		return hasMozTransform;
	};

$.magnificPopup.registerModule('zoom', {

	options: {
		enabled: false,
		easing: 'ease-in-out',
		duration: 300,
		opener: function(element) {
			return element.is('img') ? element : element.find('img');
		}
	},

	proto: {

		initZoom: function() {
			var zoomSt = mfp.st.zoom,
				ns = '.zoom',
				image;

			if(!zoomSt.enabled || !mfp.supportsTransition) {
				return;
			}

			var duration = zoomSt.duration,
				getElToAnimate = function(image) {
					var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
						transition = 'all '+(zoomSt.duration/1000)+'s ' + zoomSt.easing,
						cssObj = {
							position: 'fixed',
							zIndex: 9999,
							left: 0,
							top: 0,
							'-webkit-backface-visibility': 'hidden'
						},
						t = 'transition';

					cssObj['-webkit-'+t] = cssObj['-moz-'+t] = cssObj['-o-'+t] = cssObj[t] = transition;

					newImg.css(cssObj);
					return newImg;
				},
				showMainContent = function() {
					mfp.content.css('visibility', 'visible');
				},
				openTimeout,
				animatedImg;

			_mfpOn('BuildControls'+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);
					mfp.content.css('visibility', 'hidden');

					// Basically, all code below does is clones existing image, puts in on top of the current one and animated it

					image = mfp._getItemToZoom();

					if(!image) {
						showMainContent();
						return;
					}

					animatedImg = getElToAnimate(image);

					animatedImg.css( mfp._getOffset() );

					mfp.wrap.append(animatedImg);

					openTimeout = setTimeout(function() {
						animatedImg.css( mfp._getOffset( true ) );
						openTimeout = setTimeout(function() {

							showMainContent();

							setTimeout(function() {
								animatedImg.remove();
								image = animatedImg = null;
								_mfpTrigger('ZoomAnimationEnded');
							}, 16); // avoid blink when switching images

						}, duration); // this timeout equals animation duration

					}, 16); // by adding this timeout we avoid short glitch at the beginning of animation


					// Lots of timeouts...
				}
			});
			_mfpOn(BEFORE_CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {

					clearTimeout(openTimeout);

					mfp.st.removalDelay = duration;

					if(!image) {
						image = mfp._getItemToZoom();
						if(!image) {
							return;
						}
						animatedImg = getElToAnimate(image);
					}

					animatedImg.css( mfp._getOffset(true) );
					mfp.wrap.append(animatedImg);
					mfp.content.css('visibility', 'hidden');

					setTimeout(function() {
						animatedImg.css( mfp._getOffset() );
					}, 16);
				}

			});

			_mfpOn(CLOSE_EVENT+ns, function() {
				if(mfp._allowZoom()) {
					showMainContent();
					if(animatedImg) {
						animatedImg.remove();
					}
					image = null;
				}
			});
		},

		_allowZoom: function() {
			return mfp.currItem.type === 'image';
		},

		_getItemToZoom: function() {
			if(mfp.currItem.hasSize) {
				return mfp.currItem.img;
			} else {
				return false;
			}
		},

		// Get element postion relative to viewport
		_getOffset: function(isLarge) {
			var el;
			if(isLarge) {
				el = mfp.currItem.img;
			} else {
				el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
			}

			var offset = el.offset();
			var paddingTop = parseInt(el.css('padding-top'),10);
			var paddingBottom = parseInt(el.css('padding-bottom'),10);
			offset.top -= ( $(window).scrollTop() - paddingTop );


			/*

			Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.

			 */
			var obj = {
				width: el.width(),
				// fix Zepto height+padding issue
				height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
			};

			// I hate to do this, but there is no another option
			if( getHasMozTransform() ) {
				obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
			} else {
				obj.left = offset.left;
				obj.top = offset.top;
			}
			return obj;
		}

	}
});



/*>>zoom*/

/*>>iframe*/

var IFRAME_NS = 'iframe',
	_emptyPage = '//about:blank',

	_fixIframeBugs = function(isShowing) {
		if(mfp.currTemplate[IFRAME_NS]) {
			var el = mfp.currTemplate[IFRAME_NS].find('iframe');
			if(el.length) {
				// reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
				if(!isShowing) {
					el[0].src = _emptyPage;
				}

				// IE8 black screen bug fix
				if(mfp.isIE8) {
					el.css('display', isShowing ? 'block' : 'none');
				}
			}
		}
	};

$.magnificPopup.registerModule(IFRAME_NS, {

	options: {
		markup: '<div class="mfp-iframe-scaler">'+
					'<div class="mfp-close"></div>'+
					'<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>'+
				'</div>',

		srcAction: 'iframe_src',

		// we don't care and support only one default type of URL by default
		patterns: {
			youtube: {
				index: 'youtube.com',
				id: 'v=',
				src: '//www.youtube.com/embed/%id%?autoplay=1'
			},
			vimeo: {
				index: 'vimeo.com/',
				id: '/',
				src: '//player.vimeo.com/video/%id%?autoplay=1'
			},
			gmaps: {
				index: '//maps.google.',
				src: '%id%&output=embed'
			}
		}
	},

	proto: {
		initIframe: function() {
			mfp.types.push(IFRAME_NS);

			_mfpOn('BeforeChange', function(e, prevType, newType) {
				if(prevType !== newType) {
					if(prevType === IFRAME_NS) {
						_fixIframeBugs(); // iframe if removed
					} else if(newType === IFRAME_NS) {
						_fixIframeBugs(true); // iframe is showing
					}
				}// else {
					// iframe source is switched, don't do anything
				//}
			});

			_mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function() {
				_fixIframeBugs();
			});
		},

		getIframe: function(item, template) {
			var embedSrc = item.src;
			var iframeSt = mfp.st.iframe;

			$.each(iframeSt.patterns, function() {
				if(embedSrc.indexOf( this.index ) > -1) {
					if(this.id) {
						if(typeof this.id === 'string') {
							embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id)+this.id.length, embedSrc.length);
						} else {
							embedSrc = this.id.call( this, embedSrc );
						}
					}
					embedSrc = this.src.replace('%id%', embedSrc );
					return false; // break;
				}
			});

			var dataObj = {};
			if(iframeSt.srcAction) {
				dataObj[iframeSt.srcAction] = embedSrc;
			}
			mfp._parseMarkup(template, dataObj, item);

			mfp.updateStatus('ready');

			return template;
		}
	}
});



/*>>iframe*/

/*>>gallery*/
/**
 * Get looped index depending on number of slides
 */
var _getLoopedId = function(index) {
		var numSlides = mfp.items.length;
		if(index > numSlides - 1) {
			return index - numSlides;
		} else  if(index < 0) {
			return numSlides + index;
		}
		return index;
	},
	_replaceCurrTotal = function(text, curr, total) {
		return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
	};

$.magnificPopup.registerModule('gallery', {

	options: {
		enabled: false,
		arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
		preload: [0,2],
		navigateByImgClick: true,
		arrows: true,

		tPrev: 'Previous (Left arrow key)',
		tNext: 'Next (Right arrow key)',
		tCounter: '%curr% of %total%'
	},

	proto: {
		initGallery: function() {

			var gSt = mfp.st.gallery,
				ns = '.mfp-gallery';

			mfp.direction = true; // true - next, false - prev

			if(!gSt || !gSt.enabled ) return false;

			_wrapClasses += ' mfp-gallery';

			_mfpOn(OPEN_EVENT+ns, function() {

				if(gSt.navigateByImgClick) {
					mfp.wrap.on('click'+ns, '.mfp-img', function() {
						if(mfp.items.length > 1) {
							mfp.next();
							return false;
						}
					});
				}

				_document.on('keydown'+ns, function(e) {
					if (e.keyCode === 37) {
						mfp.prev();
					} else if (e.keyCode === 39) {
						mfp.next();
					}
				});
			});

			_mfpOn('UpdateStatus'+ns, function(e, data) {
				if(data.text) {
					data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
				}
			});

			_mfpOn(MARKUP_PARSE_EVENT+ns, function(e, element, values, item) {
				var l = mfp.items.length;
				values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
			});

			_mfpOn('BuildControls' + ns, function() {
				if(mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
					var markup = gSt.arrowMarkup,
						arrowLeft = mfp.arrowLeft = $( markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left') ).addClass(PREVENT_CLOSE_CLASS),
						arrowRight = mfp.arrowRight = $( markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right') ).addClass(PREVENT_CLOSE_CLASS);

					arrowLeft.click(function() {
						mfp.prev();
					});
					arrowRight.click(function() {
						mfp.next();
					});

					mfp.container.append(arrowLeft.add(arrowRight));
				}
			});

			_mfpOn(CHANGE_EVENT+ns, function() {
				if(mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);

				mfp._preloadTimeout = setTimeout(function() {
					mfp.preloadNearbyImages();
					mfp._preloadTimeout = null;
				}, 16);
			});


			_mfpOn(CLOSE_EVENT+ns, function() {
				_document.off(ns);
				mfp.wrap.off('click'+ns);
				mfp.arrowRight = mfp.arrowLeft = null;
			});

		},
		next: function() {
			mfp.direction = true;
			mfp.index = _getLoopedId(mfp.index + 1);
			mfp.updateItemHTML();
		},
		prev: function() {
			mfp.direction = false;
			mfp.index = _getLoopedId(mfp.index - 1);
			mfp.updateItemHTML();
		},
		goTo: function(newIndex) {
			mfp.direction = (newIndex >= mfp.index);
			mfp.index = newIndex;
			mfp.updateItemHTML();
		},
		preloadNearbyImages: function() {
			var p = mfp.st.gallery.preload,
				preloadBefore = Math.min(p[0], mfp.items.length),
				preloadAfter = Math.min(p[1], mfp.items.length),
				i;

			for(i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
				mfp._preloadItem(mfp.index+i);
			}
			for(i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
				mfp._preloadItem(mfp.index-i);
			}
		},
		_preloadItem: function(index) {
			index = _getLoopedId(index);

			if(mfp.items[index].preloaded) {
				return;
			}

			var item = mfp.items[index];
			if(!item.parsed) {
				item = mfp.parseEl( index );
			}

			_mfpTrigger('LazyLoad', item);

			if(item.type === 'image') {
				item.img = $('<img class="mfp-img" />').on('load.mfploader', function() {
					item.hasSize = true;
				}).on('error.mfploader', function() {
					item.hasSize = true;
					item.loadError = true;
					_mfpTrigger('LazyLoadError', item);
				}).attr('src', item.src);
			}


			item.preloaded = true;
		}
	}
});

/*>>gallery*/

/*>>retina*/

var RETINA_NS = 'retina';

$.magnificPopup.registerModule(RETINA_NS, {
	options: {
		replaceSrc: function(item) {
			return item.src.replace(/\.\w+$/, function(m) { return '@2x' + m; });
		},
		ratio: 1 // Function or number.  Set to 1 to disable.
	},
	proto: {
		initRetina: function() {
			if(window.devicePixelRatio > 1) {

				var st = mfp.st.retina,
					ratio = st.ratio;

				ratio = !isNaN(ratio) ? ratio : ratio();

				if(ratio > 1) {
					_mfpOn('ImageHasSize' + '.' + RETINA_NS, function(e, item) {
						item.img.css({
							'max-width': item.img[0].naturalWidth / ratio,
							'width': '100%'
						});
					});
					_mfpOn('ElementParse' + '.' + RETINA_NS, function(e, item) {
						item.src = st.replaceSrc(item, ratio);
					});
				}
			}

		}
	}
});

/*>>retina*/
 _checkInstance(); }));

/***/ }),

/***/ "./node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js":
/*!**************************************************************************!*\
  !*** ./node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! nanoScrollerJS - v0.8.7 - 2015
* http://jamesflorentino.github.com/nanoScrollerJS/
* Copyright (c) 2015 James Florentino; Licensed MIT */
(function(factory) {
  if (true) {
    return !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js")], __WEBPACK_AMD_DEFINE_RESULT__ = (function($) {
      return factory($, window, document);
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(function($, window, document) {
  "use strict";
  var BROWSER_IS_IE7, BROWSER_SCROLLBAR_WIDTH, DOMSCROLL, DOWN, DRAG, ENTER, KEYDOWN, KEYUP, MOUSEDOWN, MOUSEENTER, MOUSEMOVE, MOUSEUP, MOUSEWHEEL, NanoScroll, PANEDOWN, RESIZE, SCROLL, SCROLLBAR, TOUCHMOVE, UP, WHEEL, cAF, defaults, getBrowserScrollbarWidth, hasTransform, isFFWithBuggyScrollbar, rAF, transform, _elementStyle, _prefixStyle, _vendor;
  defaults = {

    /**
      a classname for the pane element.
      @property paneClass
      @type String
      @default 'nano-pane'
     */
    paneClass: 'nano-pane',

    /**
      a classname for the slider element.
      @property sliderClass
      @type String
      @default 'nano-slider'
     */
    sliderClass: 'nano-slider',

    /**
      a classname for the content element.
      @property contentClass
      @type String
      @default 'nano-content'
     */
    contentClass: 'nano-content',

    /**
      a setting to enable native scrolling in iOS devices.
      @property iOSNativeScrolling
      @type Boolean
      @default false
     */
    iOSNativeScrolling: false,

    /**
      a setting to prevent the rest of the page being
      scrolled when user scrolls the `.content` element.
      @property preventPageScrolling
      @type Boolean
      @default false
     */
    preventPageScrolling: false,

    /**
      a setting to disable binding to the resize event.
      @property disableResize
      @type Boolean
      @default false
     */
    disableResize: false,

    /**
      a setting to make the scrollbar always visible.
      @property alwaysVisible
      @type Boolean
      @default false
     */
    alwaysVisible: false,

    /**
      a default timeout for the `flash()` method.
      @property flashDelay
      @type Number
      @default 1500
     */
    flashDelay: 1500,

    /**
      a minimum height for the `.slider` element.
      @property sliderMinHeight
      @type Number
      @default 20
     */
    sliderMinHeight: 20,

    /**
      a maximum height for the `.slider` element.
      @property sliderMaxHeight
      @type Number
      @default null
     */
    sliderMaxHeight: null,

    /**
      an alternate document context.
      @property documentContext
      @type Document
      @default null
     */
    documentContext: null,

    /**
      an alternate window context.
      @property windowContext
      @type Window
      @default null
     */
    windowContext: null
  };

  /**
    @property SCROLLBAR
    @type String
    @static
    @final
    @private
   */
  SCROLLBAR = 'scrollbar';

  /**
    @property SCROLL
    @type String
    @static
    @final
    @private
   */
  SCROLL = 'scroll';

  /**
    @property MOUSEDOWN
    @type String
    @final
    @private
   */
  MOUSEDOWN = 'mousedown';

  /**
    @property MOUSEENTER
    @type String
    @final
    @private
   */
  MOUSEENTER = 'mouseenter';

  /**
    @property MOUSEMOVE
    @type String
    @static
    @final
    @private
   */
  MOUSEMOVE = 'mousemove';

  /**
    @property MOUSEWHEEL
    @type String
    @final
    @private
   */
  MOUSEWHEEL = 'mousewheel';

  /**
    @property MOUSEUP
    @type String
    @static
    @final
    @private
   */
  MOUSEUP = 'mouseup';

  /**
    @property RESIZE
    @type String
    @final
    @private
   */
  RESIZE = 'resize';

  /**
    @property DRAG
    @type String
    @static
    @final
    @private
   */
  DRAG = 'drag';

  /**
    @property ENTER
    @type String
    @static
    @final
    @private
   */
  ENTER = 'enter';

  /**
    @property UP
    @type String
    @static
    @final
    @private
   */
  UP = 'up';

  /**
    @property PANEDOWN
    @type String
    @static
    @final
    @private
   */
  PANEDOWN = 'panedown';

  /**
    @property DOMSCROLL
    @type String
    @static
    @final
    @private
   */
  DOMSCROLL = 'DOMMouseScroll';

  /**
    @property DOWN
    @type String
    @static
    @final
    @private
   */
  DOWN = 'down';

  /**
    @property WHEEL
    @type String
    @static
    @final
    @private
   */
  WHEEL = 'wheel';

  /**
    @property KEYDOWN
    @type String
    @static
    @final
    @private
   */
  KEYDOWN = 'keydown';

  /**
    @property KEYUP
    @type String
    @static
    @final
    @private
   */
  KEYUP = 'keyup';

  /**
    @property TOUCHMOVE
    @type String
    @static
    @final
    @private
   */
  TOUCHMOVE = 'touchmove';

  /**
    @property BROWSER_IS_IE7
    @type Boolean
    @static
    @final
    @private
   */
  BROWSER_IS_IE7 = window.navigator.appName === 'Microsoft Internet Explorer' && /msie 7./i.test(window.navigator.appVersion) && window.ActiveXObject;

  /**
    @property BROWSER_SCROLLBAR_WIDTH
    @type Number
    @static
    @default null
    @private
   */
  BROWSER_SCROLLBAR_WIDTH = null;
  rAF = window.requestAnimationFrame;
  cAF = window.cancelAnimationFrame;
  _elementStyle = document.createElement('div').style;
  _vendor = (function() {
    var i, transform, vendor, vendors, _i, _len;
    vendors = ['t', 'webkitT', 'MozT', 'msT', 'OT'];
    for (i = _i = 0, _len = vendors.length; _i < _len; i = ++_i) {
      vendor = vendors[i];
      transform = vendors[i] + 'ransform';
      if (transform in _elementStyle) {
        return vendors[i].substr(0, vendors[i].length - 1);
      }
    }
    return false;
  })();
  _prefixStyle = function(style) {
    if (_vendor === false) {
      return false;
    }
    if (_vendor === '') {
      return style;
    }
    return _vendor + style.charAt(0).toUpperCase() + style.substr(1);
  };
  transform = _prefixStyle('transform');
  hasTransform = transform !== false;

  /**
    Returns browser's native scrollbar width
    @method getBrowserScrollbarWidth
    @return {Number} the scrollbar width in pixels
    @static
    @private
   */
  getBrowserScrollbarWidth = function() {
    var outer, outerStyle, scrollbarWidth;
    outer = document.createElement('div');
    outerStyle = outer.style;
    outerStyle.position = 'absolute';
    outerStyle.width = '100px';
    outerStyle.height = '100px';
    outerStyle.overflow = SCROLL;
    outerStyle.top = '-9999px';
    document.body.appendChild(outer);
    scrollbarWidth = outer.offsetWidth - outer.clientWidth;
    document.body.removeChild(outer);
    return scrollbarWidth;
  };
  isFFWithBuggyScrollbar = function() {
    var isOSXFF, ua, version;
    ua = window.navigator.userAgent;
    isOSXFF = /(?=.+Mac OS X)(?=.+Firefox)/.test(ua);
    if (!isOSXFF) {
      return false;
    }
    version = /Firefox\/\d{2}\./.exec(ua);
    if (version) {
      version = version[0].replace(/\D+/g, '');
    }
    return isOSXFF && +version > 23;
  };

  /**
    @class NanoScroll
    @param element {HTMLElement|Node} the main element
    @param options {Object} nanoScroller's options
    @constructor
   */
  NanoScroll = (function() {
    function NanoScroll(el, options) {
      this.el = el;
      this.options = options;
      BROWSER_SCROLLBAR_WIDTH || (BROWSER_SCROLLBAR_WIDTH = getBrowserScrollbarWidth());
      this.$el = $(this.el);
      this.doc = $(this.options.documentContext || document);
      this.win = $(this.options.windowContext || window);
      this.body = this.doc.find('body');
      this.$content = this.$el.children("." + this.options.contentClass);
      this.$content.attr('tabindex', this.options.tabIndex || 0);
      this.content = this.$content[0];
      this.previousPosition = 0;
      if (this.options.iOSNativeScrolling && (this.el.style.WebkitOverflowScrolling != null)) {
        this.nativeScrolling();
      } else {
        this.generate();
      }
      this.createEvents();
      this.addEvents();
      this.reset();
    }


    /**
      Prevents the rest of the page being scrolled
      when user scrolls the `.nano-content` element.
      @method preventScrolling
      @param event {Event}
      @param direction {String} Scroll direction (up or down)
      @private
     */

    NanoScroll.prototype.preventScrolling = function(e, direction) {
      if (!this.isActive) {
        return;
      }
      if (e.type === DOMSCROLL) {
        if (direction === DOWN && e.originalEvent.detail > 0 || direction === UP && e.originalEvent.detail < 0) {
          e.preventDefault();
        }
      } else if (e.type === MOUSEWHEEL) {
        if (!e.originalEvent || !e.originalEvent.wheelDelta) {
          return;
        }
        if (direction === DOWN && e.originalEvent.wheelDelta < 0 || direction === UP && e.originalEvent.wheelDelta > 0) {
          e.preventDefault();
        }
      }
    };


    /**
      Enable iOS native scrolling
      @method nativeScrolling
      @private
     */

    NanoScroll.prototype.nativeScrolling = function() {
      this.$content.css({
        WebkitOverflowScrolling: 'touch'
      });
      this.iOSNativeScrolling = true;
      this.isActive = true;
    };


    /**
      Updates those nanoScroller properties that
      are related to current scrollbar position.
      @method updateScrollValues
      @private
     */

    NanoScroll.prototype.updateScrollValues = function() {
      var content, direction;
      content = this.content;
      this.maxScrollTop = content.scrollHeight - content.clientHeight;
      this.prevScrollTop = this.contentScrollTop || 0;
      this.contentScrollTop = content.scrollTop;
      direction = this.contentScrollTop > this.previousPosition ? "down" : this.contentScrollTop < this.previousPosition ? "up" : "same";
      this.previousPosition = this.contentScrollTop;
      if (direction !== "same") {
        this.$el.trigger('update', {
          position: this.contentScrollTop,
          maximum: this.maxScrollTop,
          direction: direction
        });
      }
      if (!this.iOSNativeScrolling) {
        this.maxSliderTop = this.paneHeight - this.sliderHeight;
        this.sliderTop = this.maxScrollTop === 0 ? 0 : this.contentScrollTop * this.maxSliderTop / this.maxScrollTop;
      }
    };


    /**
      Updates CSS styles for current scroll position.
      Uses CSS 2d transfroms and `window.requestAnimationFrame` if available.
      @method setOnScrollStyles
      @private
     */

    NanoScroll.prototype.setOnScrollStyles = function() {
      var cssValue;
      if (hasTransform) {
        cssValue = {};
        cssValue[transform] = "translate(0, " + this.sliderTop + "px)";
      } else {
        cssValue = {
          top: this.sliderTop
        };
      }
      if (rAF) {
        if (cAF && this.scrollRAF) {
          cAF(this.scrollRAF);
        }
        this.scrollRAF = rAF((function(_this) {
          return function() {
            _this.scrollRAF = null;
            return _this.slider.css(cssValue);
          };
        })(this));
      } else {
        this.slider.css(cssValue);
      }
    };


    /**
      Creates event related methods
      @method createEvents
      @private
     */

    NanoScroll.prototype.createEvents = function() {
      this.events = {
        down: (function(_this) {
          return function(e) {
            _this.isBeingDragged = true;
            _this.offsetY = e.pageY - _this.slider.offset().top;
            if (!_this.slider.is(e.target)) {
              _this.offsetY = 0;
            }
            _this.pane.addClass('active');
            _this.doc.bind(MOUSEMOVE, _this.events[DRAG]).bind(MOUSEUP, _this.events[UP]);
            _this.body.bind(MOUSEENTER, _this.events[ENTER]);
            return false;
          };
        })(this),
        drag: (function(_this) {
          return function(e) {
            _this.sliderY = e.pageY - _this.$el.offset().top - _this.paneTop - (_this.offsetY || _this.sliderHeight * 0.5);
            _this.scroll();
            if (_this.contentScrollTop >= _this.maxScrollTop && _this.prevScrollTop !== _this.maxScrollTop) {
              _this.$el.trigger('scrollend');
            } else if (_this.contentScrollTop === 0 && _this.prevScrollTop !== 0) {
              _this.$el.trigger('scrolltop');
            }
            return false;
          };
        })(this),
        up: (function(_this) {
          return function(e) {
            _this.isBeingDragged = false;
            _this.pane.removeClass('active');
            _this.doc.unbind(MOUSEMOVE, _this.events[DRAG]).unbind(MOUSEUP, _this.events[UP]);
            _this.body.unbind(MOUSEENTER, _this.events[ENTER]);
            return false;
          };
        })(this),
        resize: (function(_this) {
          return function(e) {
            _this.reset();
          };
        })(this),
        panedown: (function(_this) {
          return function(e) {
            _this.sliderY = (e.offsetY || e.originalEvent.layerY) - (_this.sliderHeight * 0.5);
            _this.scroll();
            _this.events.down(e);
            return false;
          };
        })(this),
        scroll: (function(_this) {
          return function(e) {
            _this.updateScrollValues();
            if (_this.isBeingDragged) {
              return;
            }
            if (!_this.iOSNativeScrolling) {
              _this.sliderY = _this.sliderTop;
              _this.setOnScrollStyles();
            }
            if (e == null) {
              return;
            }
            if (_this.contentScrollTop >= _this.maxScrollTop) {
              if (_this.options.preventPageScrolling) {
                _this.preventScrolling(e, DOWN);
              }
              if (_this.prevScrollTop !== _this.maxScrollTop) {
                _this.$el.trigger('scrollend');
              }
            } else if (_this.contentScrollTop === 0) {
              if (_this.options.preventPageScrolling) {
                _this.preventScrolling(e, UP);
              }
              if (_this.prevScrollTop !== 0) {
                _this.$el.trigger('scrolltop');
              }
            }
          };
        })(this),
        wheel: (function(_this) {
          return function(e) {
            var delta;
            if (e == null) {
              return;
            }
            delta = e.delta || e.wheelDelta || (e.originalEvent && e.originalEvent.wheelDelta) || -e.detail || (e.originalEvent && -e.originalEvent.detail);
            if (delta) {
              _this.sliderY += -delta / 3;
            }
            _this.scroll();
            return false;
          };
        })(this),
        enter: (function(_this) {
          return function(e) {
            var _ref;
            if (!_this.isBeingDragged) {
              return;
            }
            if ((e.buttons || e.which) !== 1) {
              return (_ref = _this.events)[UP].apply(_ref, arguments);
            }
          };
        })(this)
      };
    };


    /**
      Adds event listeners with jQuery.
      @method addEvents
      @private
     */

    NanoScroll.prototype.addEvents = function() {
      var events;
      this.removeEvents();
      events = this.events;
      if (!this.options.disableResize) {
        this.win.bind(RESIZE, events[RESIZE]);
      }
      if (!this.iOSNativeScrolling) {
        this.slider.bind(MOUSEDOWN, events[DOWN]);
        this.pane.bind(MOUSEDOWN, events[PANEDOWN]).bind("" + MOUSEWHEEL + " " + DOMSCROLL, events[WHEEL]);
      }
      this.$content.bind("" + SCROLL + " " + MOUSEWHEEL + " " + DOMSCROLL + " " + TOUCHMOVE, events[SCROLL]);
    };


    /**
      Removes event listeners with jQuery.
      @method removeEvents
      @private
     */

    NanoScroll.prototype.removeEvents = function() {
      var events;
      events = this.events;
      this.win.unbind(RESIZE, events[RESIZE]);
      if (!this.iOSNativeScrolling) {
        this.slider.unbind();
        this.pane.unbind();
      }
      this.$content.unbind("" + SCROLL + " " + MOUSEWHEEL + " " + DOMSCROLL + " " + TOUCHMOVE, events[SCROLL]);
    };


    /**
      Generates nanoScroller's scrollbar and elements for it.
      @method generate
      @chainable
      @private
     */

    NanoScroll.prototype.generate = function() {
      var contentClass, cssRule, currentPadding, options, pane, paneClass, sliderClass;
      options = this.options;
      paneClass = options.paneClass, sliderClass = options.sliderClass, contentClass = options.contentClass;
      if (!(pane = this.$el.children("." + paneClass)).length && !pane.children("." + sliderClass).length) {
        this.$el.append("<div class=\"" + paneClass + "\"><div class=\"" + sliderClass + "\" /></div>");
      }
      this.pane = this.$el.children("." + paneClass);
      this.slider = this.pane.find("." + sliderClass);
      if (BROWSER_SCROLLBAR_WIDTH === 0 && isFFWithBuggyScrollbar()) {
        currentPadding = window.getComputedStyle(this.content, null).getPropertyValue('padding-right').replace(/[^0-9.]+/g, '');
        cssRule = {
          right: -14,
          paddingRight: +currentPadding + 14
        };
      } else if (BROWSER_SCROLLBAR_WIDTH) {
        cssRule = {
          right: -BROWSER_SCROLLBAR_WIDTH
        };
        this.$el.addClass('has-scrollbar');
      }
      if (cssRule != null) {
        this.$content.css(cssRule);
      }
      return this;
    };


    /**
      @method restore
      @private
     */

    NanoScroll.prototype.restore = function() {
      this.stopped = false;
      if (!this.iOSNativeScrolling) {
        this.pane.show();
      }
      this.addEvents();
    };


    /**
      Resets nanoScroller's scrollbar.
      @method reset
      @chainable
      @example
          $(".nano").nanoScroller();
     */

    NanoScroll.prototype.reset = function() {
      var content, contentHeight, contentPosition, contentStyle, contentStyleOverflowY, paneBottom, paneHeight, paneOuterHeight, paneTop, parentMaxHeight, right, sliderHeight;
      if (this.iOSNativeScrolling) {
        this.contentHeight = this.content.scrollHeight;
        return;
      }
      if (!this.$el.find("." + this.options.paneClass).length) {
        this.generate().stop();
      }
      if (this.stopped) {
        this.restore();
      }
      content = this.content;
      contentStyle = content.style;
      contentStyleOverflowY = contentStyle.overflowY;
      if (BROWSER_IS_IE7) {
        this.$content.css({
          height: this.$content.height()
        });
      }
      contentHeight = content.scrollHeight + BROWSER_SCROLLBAR_WIDTH;
      parentMaxHeight = parseInt(this.$el.css("max-height"), 10);
      if (parentMaxHeight > 0) {
        this.$el.height("");
        this.$el.height(content.scrollHeight > parentMaxHeight ? parentMaxHeight : content.scrollHeight);
      }
      paneHeight = this.pane.outerHeight(false);
      paneTop = parseInt(this.pane.css('top'), 10);
      paneBottom = parseInt(this.pane.css('bottom'), 10);
      paneOuterHeight = paneHeight + paneTop + paneBottom;
      sliderHeight = Math.round(paneOuterHeight / contentHeight * paneHeight);
      if (sliderHeight < this.options.sliderMinHeight) {
        sliderHeight = this.options.sliderMinHeight;
      } else if ((this.options.sliderMaxHeight != null) && sliderHeight > this.options.sliderMaxHeight) {
        sliderHeight = this.options.sliderMaxHeight;
      }
      if (contentStyleOverflowY === SCROLL && contentStyle.overflowX !== SCROLL) {
        sliderHeight += BROWSER_SCROLLBAR_WIDTH;
      }
      this.maxSliderTop = paneOuterHeight - sliderHeight;
      this.contentHeight = contentHeight;
      this.paneHeight = paneHeight;
      this.paneOuterHeight = paneOuterHeight;
      this.sliderHeight = sliderHeight;
      this.paneTop = paneTop;
      this.slider.height(sliderHeight);
      this.events.scroll();
      this.pane.show();
      this.isActive = true;
      if ((content.scrollHeight === content.clientHeight) || (this.pane.outerHeight(true) >= content.scrollHeight && contentStyleOverflowY !== SCROLL)) {
        this.pane.hide();
        this.isActive = false;
      } else if (this.el.clientHeight === content.scrollHeight && contentStyleOverflowY === SCROLL) {
        this.slider.hide();
      } else {
        this.slider.show();
      }
      this.pane.css({
        opacity: (this.options.alwaysVisible ? 1 : ''),
        visibility: (this.options.alwaysVisible ? 'visible' : '')
      });
      contentPosition = this.$content.css('position');
      if (contentPosition === 'static' || contentPosition === 'relative') {
        right = parseInt(this.$content.css('right'), 10);
        if (right) {
          this.$content.css({
            right: '',
            marginRight: right
          });
        }
      }
      return this;
    };


    /**
      @method scroll
      @private
      @example
          $(".nano").nanoScroller({ scroll: 'top' });
     */

    NanoScroll.prototype.scroll = function() {
      if (!this.isActive) {
        return;
      }
      this.sliderY = Math.max(0, this.sliderY);
      this.sliderY = Math.min(this.maxSliderTop, this.sliderY);
      this.$content.scrollTop(this.maxScrollTop * this.sliderY / this.maxSliderTop);
      if (!this.iOSNativeScrolling) {
        this.updateScrollValues();
        this.setOnScrollStyles();
      }
      return this;
    };


    /**
      Scroll at the bottom with an offset value
      @method scrollBottom
      @param offsetY {Number}
      @chainable
      @example
          $(".nano").nanoScroller({ scrollBottom: value });
     */

    NanoScroll.prototype.scrollBottom = function(offsetY) {
      if (!this.isActive) {
        return;
      }
      this.$content.scrollTop(this.contentHeight - this.$content.height() - offsetY).trigger(MOUSEWHEEL);
      this.stop().restore();
      return this;
    };


    /**
      Scroll at the top with an offset value
      @method scrollTop
      @param offsetY {Number}
      @chainable
      @example
          $(".nano").nanoScroller({ scrollTop: value });
     */

    NanoScroll.prototype.scrollTop = function(offsetY) {
      if (!this.isActive) {
        return;
      }
      this.$content.scrollTop(+offsetY).trigger(MOUSEWHEEL);
      this.stop().restore();
      return this;
    };


    /**
      Scroll to an element
      @method scrollTo
      @param node {Node} A node to scroll to.
      @chainable
      @example
          $(".nano").nanoScroller({ scrollTo: $('#a_node') });
     */

    NanoScroll.prototype.scrollTo = function(node) {
      if (!this.isActive) {
        return;
      }
      this.scrollTop(this.$el.find(node).get(0).offsetTop);
      return this;
    };


    /**
      To stop the operation.
      This option will tell the plugin to disable all event bindings and hide the gadget scrollbar from the UI.
      @method stop
      @chainable
      @example
          $(".nano").nanoScroller({ stop: true });
     */

    NanoScroll.prototype.stop = function() {
      if (cAF && this.scrollRAF) {
        cAF(this.scrollRAF);
        this.scrollRAF = null;
      }
      this.stopped = true;
      this.removeEvents();
      if (!this.iOSNativeScrolling) {
        this.pane.hide();
      }
      return this;
    };


    /**
      Destroys nanoScroller and restores browser's native scrollbar.
      @method destroy
      @chainable
      @example
          $(".nano").nanoScroller({ destroy: true });
     */

    NanoScroll.prototype.destroy = function() {
      if (!this.stopped) {
        this.stop();
      }
      if (!this.iOSNativeScrolling && this.pane.length) {
        this.pane.remove();
      }
      if (BROWSER_IS_IE7) {
        this.$content.height('');
      }
      this.$content.removeAttr('tabindex');
      if (this.$el.hasClass('has-scrollbar')) {
        this.$el.removeClass('has-scrollbar');
        this.$content.css({
          right: ''
        });
      }
      return this;
    };


    /**
      To flash the scrollbar gadget for an amount of time defined in plugin settings (defaults to 1,5s).
      Useful if you want to show the user (e.g. on pageload) that there is more content waiting for him.
      @method flash
      @chainable
      @example
          $(".nano").nanoScroller({ flash: true });
     */

    NanoScroll.prototype.flash = function() {
      if (this.iOSNativeScrolling) {
        return;
      }
      if (!this.isActive) {
        return;
      }
      this.reset();
      this.pane.addClass('flashed');
      setTimeout((function(_this) {
        return function() {
          _this.pane.removeClass('flashed');
        };
      })(this), this.options.flashDelay);
      return this;
    };

    return NanoScroll;

  })();
  $.fn.nanoScroller = function(settings) {
    return this.each(function() {
      var options, scrollbar;
      if (!(scrollbar = this.nanoscroller)) {
        options = $.extend({}, defaults, settings);
        this.nanoscroller = scrollbar = new NanoScroll(this, options);
      }
      if (settings && typeof settings === "object") {
        $.extend(scrollbar.options, settings);
        if (settings.scrollBottom != null) {
          return scrollbar.scrollBottom(settings.scrollBottom);
        }
        if (settings.scrollTop != null) {
          return scrollbar.scrollTop(settings.scrollTop);
        }
        if (settings.scrollTo) {
          return scrollbar.scrollTo(settings.scrollTo);
        }
        if (settings.scroll === 'bottom') {
          return scrollbar.scrollBottom(0);
        }
        if (settings.scroll === 'top') {
          return scrollbar.scrollTop(0);
        }
        if (settings.scroll && settings.scroll instanceof $) {
          return scrollbar.scrollTo(settings.scroll);
        }
        if (settings.stop) {
          return scrollbar.stop();
        }
        if (settings.destroy) {
          return scrollbar.destroy();
        }
        if (settings.flash) {
          return scrollbar.flash();
        }
      }
      return scrollbar.reset();
    });
  };
  $.fn.nanoScroller.Constructor = NanoScroll;
});

//# sourceMappingURL=jquery.nanoscroller.js.map


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./resources/js/backend/app.js":
/*!*************************************!*\
  !*** ./resources/js/backend/app.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

__webpack_require__(/*! ../vendor/jquery-browser-mobile/jquery.browser.mobile */ "./resources/js/vendor/jquery-browser-mobile/jquery.browser.mobile.js");

__webpack_require__(/*! popper.js */ "./node_modules/popper.js/dist/esm/popper.js");

__webpack_require__(/*! bootstrap */ "./node_modules/bootstrap/dist/js/bootstrap.js");

__webpack_require__(/*! bootstrap-datepicker/dist/js/bootstrap-datepicker */ "./node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.js");

__webpack_require__(/*! ../vendor/common/common */ "./resources/js/vendor/common/common.js");

__webpack_require__(/*! nanoscroller/bin/javascripts/jquery.nanoscroller */ "./node_modules/nanoscroller/bin/javascripts/jquery.nanoscroller.js");

__webpack_require__(/*! magnific-popup/dist/jquery.magnific-popup */ "./node_modules/magnific-popup/dist/jquery.magnific-popup.js");

__webpack_require__(/*! jquery.placeholder/jquery.placeholder */ "./node_modules/jquery.placeholder/jquery.placeholder.js");

__webpack_require__(/*! ./theme */ "./resources/js/backend/theme.js");

__webpack_require__(/*! ./custom */ "./resources/js/backend/custom.js");

__webpack_require__(/*! ./theme.init */ "./resources/js/backend/theme.init.js");

/***/ }),

/***/ "./resources/js/backend/custom.js":
/*!****************************************!*\
  !*** ./resources/js/backend/custom.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/* Add here all your JS customizations */

/***/ }),

/***/ "./resources/js/backend/theme.init.js":
/*!********************************************!*\
  !*** ./resources/js/backend/theme.init.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Animate
(function ($) {
  'use strict';

  if ($.isFunction($.fn['appear'])) {
    $(function () {
      $('[data-plugin-animate], [data-appear-animation]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginAnimate(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Carousel

(function ($) {
  'use strict';

  if ($.isFunction($.fn['owlCarousel'])) {
    $(function () {
      $('[data-plugin-carousel]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginCarousel(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Chart Circular

(function ($) {
  'use strict';

  if ($.isFunction($.fn['easyPieChart'])) {
    $(function () {
      $('[data-plugin-chart-circular], .circular-bar-chart:not(.manual)').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginChartCircular(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Codemirror

(function ($) {
  'use strict';

  if (typeof CodeMirror !== 'undefined') {
    $(function () {
      $('[data-plugin-codemirror]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginCodeMirror(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Colorpicker

(function ($) {
  'use strict';

  if ($.isFunction($.fn['colorpicker'])) {
    $(function () {
      $('[data-plugin-colorpicker]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginColorPicker(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Datepicker

(function ($) {
  'use strict';

  if ($.isFunction($.fn['bootstrapDP'])) {
    $(function () {
      $('[data-plugin-datepicker]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginDatePicker(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Header Menu Nav

(function (theme, $) {
  'use strict';

  if (typeof theme.Nav !== 'undefined') {
    theme.Nav.initialize();
  }
}).apply(this, [window.theme, jQuery]); // iosSwitcher

(function ($) {
  'use strict';

  if (typeof Switch !== 'undefined' && $.isFunction(Switch)) {
    $(function () {
      $('[data-plugin-ios-switch]').each(function () {
        var $this = $(this);
        $this.themePluginIOS7Switch();
      });
    });
  }
}).apply(this, [jQuery]); // Lightbox

(function ($) {
  'use strict';

  if ($.isFunction($.fn['magnificPopup'])) {
    $(function () {
      $('[data-plugin-lightbox], .lightbox:not(.manual)').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginLightbox(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Portlets

(function ($) {
  'use strict';

  if (typeof NProgress !== 'undefined' && $.isFunction(NProgress.configure)) {
    NProgress.configure({
      showSpinner: false,
      ease: 'ease',
      speed: 750
    });
  }
}).apply(this, [jQuery]); // Markdown

(function ($) {
  'use strict';

  if ($.isFunction($.fn['markdown'])) {
    $(function () {
      $('[data-plugin-markdown-editor]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginMarkdownEditor(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Masked Input

(function ($) {
  'use strict';

  if ($.isFunction($.fn['mask'])) {
    $(function () {
      $('[data-plugin-masked-input]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginMaskedInput(opts);
      });
    });
  }
}).apply(this, [jQuery]); // MaxLength

(function ($) {
  'use strict';

  if ($.isFunction($.fn['maxlength'])) {
    $(function () {
      $('[data-plugin-maxlength]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginMaxLength(opts);
      });
    });
  }
}).apply(this, [jQuery]); // MultiSelect

(function ($) {
  'use strict';

  if ($.isFunction($.fn['multiselect'])) {
    $(function () {
      $('[data-plugin-multiselect]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginMultiSelect(opts);
      });
    });
  }
}).apply(this, [jQuery]);
(function ($) {
  'use strict';

  if ($.isFunction($.fn['placeholder'])) {
    $('input[placeholder]').placeholder();
  }
}).apply(this, [jQuery]); // Popover

(function ($) {
  'use strict';

  if ($.isFunction($.fn['popover'])) {
    $('[data-toggle=popover]').popover();
  }
}).apply(this, [jQuery]); // Portlets

(function ($) {
  'use strict';

  $(function () {
    $('[data-plugin-portlet]').each(function () {
      var $this = $(this),
          opts = {};
      var pluginOptions = $this.data('plugin-options');
      if (pluginOptions) opts = pluginOptions;
      $this.themePluginPortlet(opts);
    });
  });
}).apply(this, [jQuery]); // Scroll to Top

(function (theme, $) {
  // Scroll to Top Button.
  if (typeof theme.PluginScrollToTop !== 'undefined') {
    theme.PluginScrollToTop.initialize();
  }
}).apply(this, [window.theme, jQuery]); // Scrollable

(function ($) {
  'use strict';

  if ($.isFunction($.fn['nanoScroller'])) {
    $(function () {
      $('[data-plugin-scrollable]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');

        if (pluginOptions) {
          opts = pluginOptions;
        }

        $this.themePluginScrollable(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Select2

(function ($) {
  'use strict';

  if ($.isFunction($.fn['select2'])) {
    $(function () {
      $('[data-plugin-selectTwo]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginSelect2(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Sidebar Widgets

(function ($) {
  'use strict';

  function expand(content) {
    content.children('.widget-content').slideDown('fast', function () {
      $(this).css('display', '');
      content.removeClass('widget-collapsed');
    });
  }

  function collapse(content) {
    content.children('.widget-content').slideUp('fast', function () {
      content.addClass('widget-collapsed');
      $(this).css('display', '');
    });
  }

  var $widgets = $('.sidebar-widget');
  $widgets.each(function () {
    var $widget = $(this),
        $toggler = $widget.find('.widget-toggle');
    $toggler.on('click.widget-toggler', function () {
      $widget.hasClass('widget-collapsed') ? expand($widget) : collapse($widget);
    });
  });
}).apply(this, [jQuery]); // Slider

(function ($) {
  'use strict';

  if ($.isFunction($.fn['slider'])) {
    $(function () {
      $('[data-plugin-slider]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');

        if (pluginOptions) {
          opts = pluginOptions;
        }

        $this.themePluginSlider(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Spinner

(function ($) {
  'use strict';

  if ($.isFunction($.fn['spinner'])) {
    $(function () {
      $('[data-plugin-spinner]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginSpinner(opts);
      });
    });
  }
}).apply(this, [jQuery]); // SummerNote

(function ($) {
  'use strict';

  if ($.isFunction($.fn['summernote'])) {
    $(function () {
      $('[data-plugin-summernote]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginSummerNote(opts);
      });
    });
  }
}).apply(this, [jQuery]); // TextArea AutoSize

(function ($) {
  'use strict';

  if (typeof autosize === 'function') {
    $(function () {
      $('[data-plugin-textarea-autosize]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginTextAreaAutoSize(opts);
      });
    });
  }
}).apply(this, [jQuery]); // TimePicker

(function ($) {
  'use strict';

  if ($.isFunction($.fn['timepicker'])) {
    $(function () {
      $('[data-plugin-timepicker]').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginTimePicker(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Toggle

(function ($) {
  'use strict';

  $(function () {
    $('[data-plugin-toggle]').each(function () {
      var $this = $(this),
          opts = {};
      var pluginOptions = $this.data('plugin-options');
      if (pluginOptions) opts = pluginOptions;
      $this.themePluginToggle(opts);
    });
  });
}).apply(this, [jQuery]); // Tooltip

(function ($) {
  'use strict';

  if ($.isFunction($.fn['tooltip'])) {
    $('[data-toggle=tooltip],[rel=tooltip]').tooltip({
      container: 'body'
    });
  }
}).apply(this, [jQuery]); // Widget - Todo

(function ($) {
  'use strict';

  if ($.isFunction($.fn['themePluginWidgetTodoList'])) {
    $(function () {
      $('[data-plugin-todo-list], ul.widget-todo-list').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginWidgetTodoList(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Widget - Toggle

(function ($) {
  'use strict';

  if ($.isFunction($.fn['themePluginWidgetToggleExpand'])) {
    $(function () {
      $('[data-plugin-toggle-expand], .widget-toggle-expand').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginWidgetToggleExpand(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Word Rotator

(function ($) {
  'use strict';

  if ($.isFunction($.fn['themePluginWordRotator'])) {
    $(function () {
      $('[data-plugin-wort-rotator], .wort-rotator:not(.manual)').each(function () {
        var $this = $(this),
            opts = {};
        var pluginOptions = $this.data('plugin-options');
        if (pluginOptions) opts = pluginOptions;
        $this.themePluginWordRotator(opts);
      });
    });
  }
}).apply(this, [jQuery]); // Base

(function (theme, $) {
  'use strict';

  theme = theme || {};
  theme.Skeleton.initialize();
}).apply(this, [window.theme, jQuery]); // Mailbox

(function ($) {
  'use strict';

  $(function () {
    $('[data-mailbox]').each(function () {
      var $this = $(this);
      $this.themeMailbox();
    });
  });
}).apply(this, [jQuery]);

/***/ }),

/***/ "./resources/js/backend/theme.js":
/*!***************************************!*\
  !*** ./resources/js/backend/theme.js ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
Name: 			Theme Base
Written by: 	Okler Themes - (http://www.okler.net)
Theme Version: 	2.2.0
*/
window.theme = {}; // Theme Common Functions

window.theme.fn = {
  getOptions: function getOptions(opts) {
    if (_typeof(opts) == 'object') {
      return opts;
    } else if (typeof opts == 'string') {
      try {
        return JSON.parse(opts.replace(/'/g, '"').replace(';', ''));
      } catch (e) {
        return {};
      }
    } else {
      return {};
    }
  }
}; // Animate

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__animate';

  var PluginAnimate = function PluginAnimate($el, opts) {
    return this.initialize($el, opts);
  };

  PluginAnimate.defaults = {
    accX: 0,
    accY: -150,
    delay: 1,
    duration: '1s'
  };
  PluginAnimate.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginAnimate.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      var self = this,
          $el = this.options.wrapper,
          delay = 0,
          duration = '1s',
          elTopDistance = $el.offset().top,
          windowTopDistance = $(window).scrollTop();
      $(document).ready(function () {
        $el.addClass('appear-animation animated');

        if (!$('html').hasClass('no-csstransitions') && $(window).width() > 767 && elTopDistance > windowTopDistance) {
          $el.appear(function () {
            $el.one('animation:show', function (ev) {
              delay = $el.attr('data-appear-animation-delay') ? $el.attr('data-appear-animation-delay') : self.options.delay;
              duration = $el.attr('data-appear-animation-duration') ? $el.attr('data-appear-animation-duration') : self.options.duration;

              if (duration != '1s') {
                $el.css('animation-duration', duration);
              }

              setTimeout(function () {
                $el.addClass($el.attr('data-appear-animation') + ' appear-animation-visible');
              }, delay);
            });
            $el.trigger('animation:show');
          }, {
            accX: self.options.accX,
            accY: self.options.accY
          });
        } else {
          $el.addClass('appear-animation-visible');
        }
      });
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginAnimate: PluginAnimate
  }); // jquery plugin

  $.fn.themePluginAnimate = function (opts) {
    return this.map(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginAnimate($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Bootstrap Toggle

(function ($) {
  'use strict';

  var $window = $(window);

  var toggleClass = function toggleClass($el) {
    if (!!$el.data('toggleClassBinded')) {
      return false;
    }

    var $target, className, eventName;
    $target = $($el.attr('data-target'));
    className = $el.attr('data-toggle-class');
    eventName = $el.attr('data-fire-event');
    $el.on('click.toggleClass', function (e) {
      e.preventDefault();
      $target.toggleClass(className);
      var hasClass = $target.hasClass(className);

      if (!!eventName) {
        $window.trigger(eventName, {
          added: hasClass,
          removed: !hasClass
        });
      }
    });
    $el.data('toggleClassBinded', true);
    return true;
  };

  $(function () {
    $('[data-toggle-class][data-target]').each(function () {
      toggleClass($(this));
    });
  });
}).apply(this, [jQuery]); // Cards

(function ($) {
  $(function () {
    $('.card').on('card:toggle', function () {
      var $this, direction;
      $this = $(this);
      direction = $this.hasClass('card-collapsed') ? 'Down' : 'Up';
      $this.find('.card-body, .card-footer')['slide' + direction](200, function () {
        $this[(direction === 'Up' ? 'add' : 'remove') + 'Class']('card-collapsed');
      });
    }).on('card:dismiss', function () {
      var $this = $(this);

      if (!!($this.parent('div').attr('class') || '').match(/col-(xs|sm|md|lg)/g) && $this.siblings().length === 0) {
        $row = $this.closest('.row');
        $this.parent('div').remove();

        if ($row.children().length === 0) {
          $row.remove();
        }
      } else {
        $this.remove();
      }
    }).on('click', '[data-card-toggle]', function (e) {
      e.preventDefault();
      $(this).closest('.card').trigger('card:toggle');
    }).on('click', '[data-card-dismiss]', function (e) {
      e.preventDefault();
      $(this).closest('.card').trigger('card:dismiss');
    })
    /* Deprecated */
    .on('click', '.card-actions a.fa-caret-up', function (e) {
      e.preventDefault();
      var $this = $(this);
      $this.removeClass('fa-caret-up').addClass('fa-caret-down');
      $this.closest('.card').trigger('card:toggle');
    }).on('click', '.card-actions a.fa-caret-down', function (e) {
      e.preventDefault();
      var $this = $(this);
      $this.removeClass('fa-caret-down').addClass('fa-caret-up');
      $this.closest('.card').trigger('card:toggle');
    }).on('click', '.card-actions a.fa-times', function (e) {
      e.preventDefault();
      var $this = $(this);
      $this.closest('.card').trigger('card:dismiss');
    });
  });
})(jQuery); // Carousel


(function (theme, $) {
  theme = theme || {};
  var initialized = false;
  var instanceName = '__carousel';

  var PluginCarousel = function PluginCarousel($el, opts) {
    return this.initialize($el, opts);
  };

  PluginCarousel.defaults = {
    navText: []
  };
  PluginCarousel.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginCarousel.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      this.options.wrapper.owlCarousel(this.options).addClass("owl-carousel-init");
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginCarousel: PluginCarousel
  }); // jquery plugin

  $.fn.themePluginCarousel = function (opts) {
    return this.map(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginCarousel($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Chart Circular

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__chartCircular';

  var PluginChartCircular = function PluginChartCircular($el, opts) {
    return this.initialize($el, opts);
  };

  PluginChartCircular.defaults = {
    accX: 0,
    accY: -150,
    delay: 1,
    barColor: '#0088CC',
    trackColor: '#f2f2f2',
    scaleColor: false,
    scaleLength: 5,
    lineCap: 'round',
    lineWidth: 13,
    size: 175,
    rotate: 0,
    animate: {
      duration: 2500,
      enabled: true
    }
  };
  PluginChartCircular.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginChartCircular.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      var self = this,
          $el = this.options.wrapper,
          value = $el.attr('data-percent') ? $el.attr('data-percent') : 0,
          percentEl = $el.find('.percent'),
          shouldAnimate,
          data;
      shouldAnimate = $.isFunction($.fn['appear']) && typeof $.browser !== 'undefined' && !$.browser.mobile;
      data = {
        accX: self.options.accX,
        accY: self.options.accY
      };
      $.extend(true, self.options, {
        onStep: function onStep(from, to, currentValue) {
          percentEl.html(parseInt(currentValue));
        }
      });
      $el.attr('data-percent', shouldAnimate ? 0 : value);
      $el.easyPieChart(this.options);

      if (shouldAnimate) {
        $el.appear(function () {
          setTimeout(function () {
            $el.data('easyPieChart').update(value);
            $el.attr('data-percent', value);
          }, self.options.delay);
        }, data);
      } else {
        $el.data('easyPieChart').update(value);
        $el.attr('data-percent', value);
      }

      return this;
    }
  }; // expose to scope

  $.extend(true, theme, {
    Chart: {
      PluginChartCircular: PluginChartCircular
    }
  }); // jquery plugin

  $.fn.themePluginChartCircular = function (opts) {
    return this.map(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginChartCircular($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Codemirror

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__codemirror';

  var PluginCodeMirror = function PluginCodeMirror($el, opts) {
    return this.initialize($el, opts);
  };

  PluginCodeMirror.defaults = {
    lineNumbers: true,
    styleActiveLine: true,
    matchBrackets: true,
    theme: 'monokai'
  };
  PluginCodeMirror.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginCodeMirror.defaults, opts);
      return this;
    },
    build: function build() {
      CodeMirror.fromTextArea(this.$el.get(0), this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginCodeMirror: PluginCodeMirror
  }); // jquery plugin

  $.fn.themePluginCodeMirror = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginCodeMirror($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Colorpicker

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__colorpicker';

  var PluginColorPicker = function PluginColorPicker($el, opts) {
    return this.initialize($el, opts);
  };

  PluginColorPicker.defaults = {};
  PluginColorPicker.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginColorPicker.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.colorpicker(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginColorPicker: PluginColorPicker
  }); // jquery plugin

  $.fn.themePluginColorPicker = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginColorPicker($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Data Tables - Config

(function ($) {
  'use strict'; // we overwrite initialize of all datatables here
  // because we want to use select2, give search input a bootstrap look
  // keep in mind if you overwrite this fnInitComplete somewhere,
  // you should run the code inside this function to keep functionality.
  //
  // there's no better way to do this at this time :(

  if ($.isFunction($.fn['dataTable'])) {
    $.extend(true, $.fn.dataTable.defaults, {
      oLanguage: {
        sLengthMenu: '_MENU_ records per page',
        sProcessing: '<i class="fas fa-spinner fa-spin"></i> Loading',
        sSearch: ''
      },
      fnInitComplete: function fnInitComplete(settings, json) {
        // select 2
        if ($.isFunction($.fn['select2'])) {
          $('.dataTables_length select', settings.nTableWrapper).select2({
            theme: 'bootstrap',
            minimumResultsForSearch: -1
          });
        }

        var options = $('table', settings.nTableWrapper).data('plugin-options') || {}; // search

        var $search = $('.dataTables_filter input', settings.nTableWrapper);
        $search.attr({
          placeholder: typeof options.searchPlaceholder !== 'undefined' ? options.searchPlaceholder : 'Search...'
        }).removeClass('form-control-sm').addClass('form-control pull-right');

        if ($.isFunction($.fn.placeholder)) {
          $search.placeholder();
        }
      }
    });
  }
}).apply(this, [jQuery]); // Datepicker

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__datepicker';

  var PluginDatePicker = function PluginDatePicker($el, opts) {
    return this.initialize($el, opts);
  };

  PluginDatePicker.defaults = {};
  PluginDatePicker.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setVars().setData().setOptions(opts).build();
      return this;
    },
    setVars: function setVars() {
      this.skin = this.$el.data('plugin-skin');
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginDatePicker.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.bootstrapDP(this.options);

      if (!!this.skin && typeof this.$el.data('datepicker').picker != 'undefined') {
        this.$el.data('datepicker').picker.addClass('datepicker-' + this.skin);
      }

      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginDatePicker: PluginDatePicker
  }); // jquery plugin

  $.fn.themePluginDatePicker = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginDatePicker($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Header Menu Nav

(function (theme, $) {
  'use strict';

  theme = theme || {};
  var initialized = false;
  $.extend(theme, {
    Nav: {
      defaults: {
        wrapper: $('#mainNav'),
        scrollDelay: 600,
        scrollAnimation: 'easeOutQuad'
      },
      initialize: function initialize($wrapper, opts) {
        if (initialized) {
          return this;
        }

        initialized = true;
        this.$wrapper = $wrapper || this.defaults.wrapper;
        this.setOptions(opts).build().events();
        return this;
      },
      setOptions: function setOptions(opts) {
        // this.options = $.extend(true, {}, this.defaults, opts, theme.fn.getOptions(this.$wrapper.data('plugin-options')));
        return this;
      },
      build: function build() {
        var self = this,
            $html = $('html'),
            $header = $('.header'),
            thumbInfoPreview; // Add Arrows

        $header.find('.dropdown-toggle:not(.notification-icon), .dropdown-submenu > a').append($('<i />').addClass('fas fa-caret-down')); // Preview Thumbs

        self.$wrapper.find('a[data-thumb-preview]').each(function () {
          thumbInfoPreview = $('<span />').addClass('thumb-info thumb-info-preview').append($('<span />').addClass('thumb-info-wrapper').append($('<span />').addClass('thumb-info-image').css('background-image', 'url(' + $(this).data('thumb-preview') + ')')));
          $(this).append(thumbInfoPreview);
        }); // Side Header Right (Reverse Dropdown)

        if ($html.hasClass('side-header-right')) {
          $header.find('.dropdown').addClass('dropdown-reverse');
        }

        return this;
      },
      events: function events() {
        var self = this,
            $header = $('.header'),
            $window = $(window);
        $header.find('a[href="#"]').on('click', function (e) {
          e.preventDefault();
        }); // Mobile Arrows

        $header.find('.dropdown-toggle[href="#"], .dropdown-submenu a[href="#"], .dropdown-toggle[href!="#"] .fa-caret-down, .dropdown-submenu a[href!="#"] .fa-caret-down').on('click', function (e) {
          e.preventDefault();

          if ($window.width() < 992) {
            $(this).closest('li').toggleClass('showed');
          }
        }); // Touch Devices with normal resolutions

        if ('ontouchstart' in document.documentElement) {
          $header.find('.dropdown-toggle:not([href="#"]), .dropdown-submenu > a:not([href="#"])').on('touchstart click', function (e) {
            if ($window.width() > 991) {
              e.stopPropagation();
              e.preventDefault();

              if (e.handled !== true) {
                var li = $(this).closest('li');

                if (li.hasClass('tapped')) {
                  location.href = $(this).attr('href');
                }

                li.addClass('tapped');
                e.handled = true;
              } else {
                return false;
              }

              return false;
            }
          }).on('blur', function (e) {
            $(this).closest('li').removeClass('tapped');
          });
        } // Collapse Nav


        $header.find('[data-collapse-nav]').on('click', function (e) {
          $(this).parents('.collapse').removeClass('in');
        }); // Anchors Position

        $('[data-hash]').each(function () {
          var target = $(this).attr('href'),
              offset = $(this).is("[data-hash-offset]") ? $(this).data('hash-offset') : 0;

          if ($(target).get(0)) {
            $(this).on('click', function (e) {
              e.preventDefault(); // Close Collapse if Opened

              $(this).parents('.collapse.in').removeClass('in');
              self.scrollToTarget(target, offset);
              return;
            });
          }
        });
        return this;
      },
      scrollToTarget: function scrollToTarget(target, offset) {
        var self = this;
        $('body').addClass('scrolling');
        $('html, body').animate({
          scrollTop: $(target).offset().top - offset
        }, self.options.scrollDelay, self.options.scrollAnimation, function () {
          $('body').removeClass('scrolling');
        });
        return this;
      }
    }
  });
}).apply(this, [window.theme, jQuery]); // iosSwitcher

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__IOS7Switch';

  var PluginIOS7Switch = function PluginIOS7Switch($el) {
    return this.initialize($el);
  };

  PluginIOS7Switch.prototype = {
    initialize: function initialize($el) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    build: function build() {
      var switcher = new Switch(this.$el.get(0));
      $(switcher.el).on('click', function (e) {
        e.preventDefault();
        switcher.toggle();
      });
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginIOS7Switch: PluginIOS7Switch
  }); // jquery plugin

  $.fn.themePluginIOS7Switch = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginIOS7Switch($this);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Form to Object

(function ($) {
  'use strict';

  $.fn.formToObject = function () {
    var arrayData, objectData;
    arrayData = this.serializeArray();
    objectData = {};
    $.each(arrayData, function () {
      var value;

      if (this.value != null) {
        value = this.value;
      } else {
        value = '';
      }

      if (objectData[this.name] != null) {
        if (!objectData[this.name].push) {
          objectData[this.name] = [objectData[this.name]];
        }

        objectData[this.name].push(value);
      } else {
        objectData[this.name] = value;
      }
    });
    return objectData;
  };
})(jQuery); // Lightbox


(function (theme, $) {
  theme = theme || {};
  var instanceName = '__lightbox';

  var PluginLightbox = function PluginLightbox($el, opts) {
    return this.initialize($el, opts);
  };

  PluginLightbox.defaults = {
    tClose: 'Close (Esc)',
    // Alt text on close button
    tLoading: 'Loading...',
    // Text that is displayed during loading. Can contain %curr% and %total% keys
    gallery: {
      tPrev: 'Previous (Left arrow key)',
      // Alt text on left arrow
      tNext: 'Next (Right arrow key)',
      // Alt text on right arrow
      tCounter: '%curr% of %total%' // Markup for "1 of 7" counter

    },
    image: {
      tError: '<a href="%url%">The image</a> could not be loaded.' // Error message when image could not be loaded

    },
    ajax: {
      tError: '<a href="%url%">The content</a> could not be loaded.' // Error message when ajax request failed

    }
  };
  PluginLightbox.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginLightbox.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      this.options.wrapper.magnificPopup(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginLightbox: PluginLightbox
  }); // jquery plugin

  $.fn.themePluginLightbox = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginLightbox($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Loading Overlay

(function (theme, $) {
  'use strict';

  theme = theme || {};
  var loadingOverlayTemplate = ['<div class="loading-overlay">', '<div class="bounce-loader"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>', '</div>'].join('');

  var LoadingOverlay = function LoadingOverlay($wrapper, options) {
    return this.initialize($wrapper, options);
  };

  LoadingOverlay.prototype = {
    options: {
      css: {}
    },
    initialize: function initialize($wrapper, options) {
      this.$wrapper = $wrapper;
      this.setVars().setOptions(options).build().events();
      this.$wrapper.data('loadingOverlay', this);
    },
    setVars: function setVars() {
      this.$overlay = this.$wrapper.find('.loading-overlay');
      return this;
    },
    setOptions: function setOptions(options) {
      if (!this.$overlay.get(0)) {
        this.matchProperties();
      }

      this.options = $.extend(true, {}, this.options, options);
      this.loaderClass = this.getLoaderClass(this.options.css.backgroundColor);
      return this;
    },
    build: function build() {
      if (!this.$overlay.closest(document.documentElement).get(0)) {
        if (!this.$cachedOverlay) {
          this.$overlay = $(loadingOverlayTemplate).clone();

          if (this.options.css) {
            this.$overlay.css(this.options.css);
            this.$overlay.find('.loader').addClass(this.loaderClass);
          }
        } else {
          this.$overlay = this.$cachedOverlay.clone();
        }

        this.$wrapper.append(this.$overlay);
      }

      if (!this.$cachedOverlay) {
        this.$cachedOverlay = this.$overlay.clone();
      }

      return this;
    },
    events: function events() {
      var _self = this;

      if (this.options.startShowing) {
        _self.show();
      }

      if (this.$wrapper.is('body') || this.options.hideOnWindowLoad) {
        $(window).on('load error', function () {
          _self.hide();
        });
      }

      if (this.options.listenOn) {
        $(this.options.listenOn).on('loading-overlay:show beforeSend.ic', function (e) {
          e.stopPropagation();

          _self.show();
        }).on('loading-overlay:hide complete.ic', function (e) {
          e.stopPropagation();

          _self.hide();
        });
      }

      this.$wrapper.on('loading-overlay:show beforeSend.ic', function (e) {
        if (e.target === _self.$wrapper.get(0)) {
          e.stopPropagation();

          _self.show();

          return true;
        }

        return false;
      }).on('loading-overlay:hide complete.ic', function (e) {
        if (e.target === _self.$wrapper.get(0)) {
          e.stopPropagation();

          _self.hide();

          return true;
        }

        return false;
      });
      return this;
    },
    show: function show() {
      this.build();
      this.position = this.$wrapper.css('position').toLowerCase();

      if (this.position != 'relative' || this.position != 'absolute' || this.position != 'fixed') {
        this.$wrapper.css({
          position: 'relative'
        });
      }

      this.$wrapper.addClass('loading-overlay-showing');
    },
    hide: function hide() {
      var _self = this;

      this.$wrapper.removeClass('loading-overlay-showing');
      setTimeout(function () {
        if (this.position != 'relative' || this.position != 'absolute' || this.position != 'fixed') {
          _self.$wrapper.css({
            position: ''
          });
        }
      }, 500);
    },
    matchProperties: function matchProperties() {
      var i, l, properties;
      properties = ['backgroundColor', 'borderRadius'];
      l = properties.length;

      for (i = 0; i < l; i++) {
        var obj = {};
        obj[properties[i]] = this.$wrapper.css(properties[i]);
        $.extend(this.options.css, obj);
      }
    },
    getLoaderClass: function getLoaderClass(backgroundColor) {
      if (!backgroundColor || backgroundColor === 'transparent' || backgroundColor === 'inherit') {
        return 'black';
      }

      var hexColor, r, g, b, yiq;

      var colorToHex = function colorToHex(color) {
        var hex, rgb;

        if (color.indexOf('#') > -1) {
          hex = color.replace('#', '');
        } else {
          rgb = color.match(/\d+/g);
          hex = ('0' + parseInt(rgb[0], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[1], 10).toString(16)).slice(-2) + ('0' + parseInt(rgb[2], 10).toString(16)).slice(-2);
        }

        if (hex.length === 3) {
          hex = hex + hex;
        }

        return hex;
      };

      hexColor = colorToHex(backgroundColor);
      r = parseInt(hexColor.substr(0, 2), 16);
      g = parseInt(hexColor.substr(2, 2), 16);
      b = parseInt(hexColor.substr(4, 2), 16);
      yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 128 ? 'black' : 'white';
    }
  }; // expose to scope

  $.extend(theme, {
    LoadingOverlay: LoadingOverlay
  }); // expose as a jquery plugin

  $.fn.loadingOverlay = function (opts) {
    return this.each(function () {
      var $this = $(this);
      var loadingOverlay = $this.data('loadingOverlay');

      if (loadingOverlay) {
        return loadingOverlay;
      } else {
        var options = opts || $this.data('loading-overlay-options') || {};
        return new LoadingOverlay($this, options);
      }
    });
  }; // auto init


  $('[data-loading-overlay]').loadingOverlay();
}).apply(this, [window.theme, jQuery]); // Lock Screen

(function ($) {
  'use strict';

  var LockScreen = {
    initialize: function initialize() {
      this.$body = $('body');
      this.build().events();
    },
    build: function build() {
      var lockHTML, userinfo;
      userinfo = this.getUserInfo();
      this.lockHTML = this.buildTemplate(userinfo);
      this.$lock = this.$body.children('#LockScreenInline');
      this.$userPicture = this.$lock.find('#LockUserPicture');
      this.$userName = this.$lock.find('#LockUserName');
      this.$userEmail = this.$lock.find('#LockUserEmail');
      return this;
    },
    events: function events() {
      var _self = this;

      this.$body.find('[data-lock-screen="true"]').on('click', function (e) {
        e.preventDefault();

        _self.show();
      });
      return this;
    },
    formEvents: function formEvents($form) {
      var _self = this;

      $form.on('submit', function (e) {
        e.preventDefault();

        _self.hide();
      });
    },
    show: function show() {
      var _self = this,
          userinfo = this.getUserInfo();

      this.$userPicture.attr('src', userinfo.picture);
      this.$userName.text(userinfo.username);
      this.$userEmail.text(userinfo.email);
      this.$body.addClass('show-lock-screen');
      $.magnificPopup.open({
        items: {
          src: this.lockHTML,
          type: 'inline'
        },
        modal: true,
        mainClass: 'mfp-lock-screen',
        callbacks: {
          change: function change() {
            _self.formEvents(this.content.find('form'));
          }
        }
      });
    },
    hide: function hide() {
      $.magnificPopup.close();
    },
    getUserInfo: function getUserInfo() {
      var $info, picture, name, email; // always search in case something is changed through ajax

      $info = $('#userbox');
      picture = $info.find('.profile-picture img').attr('data-lock-picture');
      name = $info.find('.profile-info').attr('data-lock-name');
      email = $info.find('.profile-info').attr('data-lock-email');
      return {
        picture: picture,
        username: name,
        email: email
      };
    },
    buildTemplate: function buildTemplate(userinfo) {
      return ['<section id="LockScreenInline" class="body-sign body-locked body-locked-inline">', '<div class="center-sign">', '<div class="panel card-sign">', '<div class="card-body">', '<form>', '<div class="current-user text-center">', '<img id="LockUserPicture" src="{{picture}}" alt="John Doe" class="rounded-circle user-image" />', '<h2 id="LockUserName" class="user-name text-dark m-0">{{username}}</h2>', '<p  id="LockUserEmail" class="user-email m-0">{{email}}</p>', '</div>', '<div class="form-group mb-lg">', '<div class="input-group">', '<input id="pwd" name="pwd" type="password" class="form-control form-control-lg" placeholder="Password" />', '<span class="input-group-append">', '<span class="input-group-text">', '<i class="fas fa-lock"></i>', '</span>', '</span>', '</div>', '</div>', '<div class="row">', '<div class="col-6">', '<p class="mt-xs mb-0">', '<a href="#">Not John Doe?</a>', '</p>', '</div>', '<div class="col-6">', '<button type="submit" class="btn btn-primary pull-right">Unlock</button>', '</div>', '</div>', '</form>', '</div>', '</div>', '</div>', '</section>'].join('').replace(/\{\{picture\}\}/, userinfo.picture).replace(/\{\{username\}\}/, userinfo.username).replace(/\{\{email\}\}/, userinfo.email);
    }
  };
  this.LockScreen = LockScreen;
  $(function () {
    LockScreen.initialize();
  });
}).apply(this, [jQuery]); // Map Builder

(function (theme, $) {
  'use strict'; // prevent undefined var

  theme = theme || {}; // internal var to check if reached limit

  var timeouts = 0; // instance

  var instanceName = '__gmapbuilder'; // private

  var roundNumber = function roundNumber(number, precision) {
    if (precision < 0) {
      precision = 0;
    } else if (precision > 10) {
      precision = 10;
    }

    var a = [1, 10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
    return Math.round(number * a[precision]) / a[precision];
  }; // definition


  var GMapBuilder = function GMapBuilder($wrapper, opts) {
    return this.initialize($wrapper, opts);
  };

  GMapBuilder.defaults = {
    mapSelector: '#gmap',
    markers: {
      modal: '#MarkerModal',
      list: '#MarkersList',
      removeAll: '#MarkerRemoveAll'
    },
    previewModal: '#ModalPreview',
    getCodeModal: '#ModalGetCode',
    mapOptions: {
      center: {
        lat: -38.908133,
        lng: -13.692628
      },
      panControl: true,
      zoom: 3
    }
  };
  GMapBuilder.prototype = {
    markers: [],
    initialize: function initialize($wrapper, opts) {
      this.$wrapper = $wrapper;
      this.setData().setOptions(opts).setVars().build().events();
      return this;
    },
    setData: function setData() {
      this.$wrapper.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, GMapBuilder.defaults, opts);
      return this;
    },
    setVars: function setVars() {
      this.$mapContainer = this.$wrapper.find(this.options.mapSelector);
      this.$previewModal = $(this.options.previewModal);
      this.$getCodeModal = $(this.options.getCodeModal);
      this.marker = {};
      this.marker.$modal = $(this.options.markers.modal);
      this.marker.$form = this.marker.$modal.find('form');
      this.marker.$list = $(this.options.markers.list);
      this.marker.$removeAll = $(this.options.markers.removeAll);
      return this;
    },
    build: function build() {
      var _self = this;

      if (!!window.SnazzyThemes) {
        var themeOpts = [];
        $.each(window.SnazzyThemes, function (i, theme) {
          themeOpts.push($('<option value="' + theme.id + '">' + theme.name + '</option>').data('json', theme.json));
        });
        this.$wrapper.find('[data-builder-field="maptheme"]').append(themeOpts);
      }

      this.geocoder = new google.maps.Geocoder();
      google.maps.event.addDomListener(window, 'load', function () {
        _self.options.mapOptions.center = new google.maps.LatLng(_self.options.mapOptions.center.lat, _self.options.mapOptions.center.lng);
        _self.map = new google.maps.Map(_self.$mapContainer.get(0), _self.options.mapOptions);

        _self.updateControl('latlng').updateControl('zoomlevel');

        _self.mapEvents();
      });
      return this;
    },
    events: function events() {
      var _self = this;

      this.$wrapper.find('[data-builder-field]').each(function () {
        var $this = $(this),
            field,
            value;
        field = $this.data('builder-field');
        $this.on('change', function () {
          if ($this.is('select')) {
            value = $this.children('option:selected').val().toLowerCase();
          } else {
            value = $this.val().toLowerCase();
          }

          _self.updateMap(field, value);
        });
      });
      this.marker.$form.on('submit', function (e) {
        e.preventDefault();

        _self.saveMarker(_self.marker.$form.formToObject());
      });
      this.marker.$removeAll.on('click', function (e) {
        e.preventDefault();

        _self.removeAllMarkers();
      }); // preview events

      this.$previewModal.on('shown.bs.modal', function () {
        _self.preview();
      });
      this.$previewModal.on('hidden.bs.modal', function () {
        _self.$previewModal.find('iframe').get(0).contentWindow.document.body.innerHTML = '';
      }); // get code events

      this.$getCodeModal.on('shown.bs.modal', function () {
        _self.getCode();
      });
      return this;
    },
    // MAP FUNCTIONS
    // -----------------------------------------------------------------------------
    mapEvents: function mapEvents() {
      var _self = this;

      google.maps.event.addDomListener(_self.map, 'resize', function () {
        google.maps.event.trigger(_self.map, 'resize');
      });
      google.maps.event.addListener(this.map, 'center_changed', function () {
        var coords = _self.map.getCenter();

        _self.updateControl('latlng', {
          lat: roundNumber(coords.lat(), 6),
          lng: roundNumber(coords.lng(), 6)
        });
      });
      google.maps.event.addListener(this.map, 'zoom_changed', function () {
        _self.updateControl('zoomlevel', _self.map.getZoom());
      });
      google.maps.event.addListener(this.map, 'maptypeid_changed', function () {
        _self.updateControl('maptype', _self.map.getMapTypeId());
      });
      return this;
    },
    updateMap: function updateMap(prop, value) {
      var updateFn;
      updateFn = this.updateMapProperty[prop];

      if ($.isFunction(updateFn)) {
        updateFn.apply(this, [value]);
      } else {
        console.info('missing update function for', prop);
      }

      return this;
    },
    updateMapProperty: {
      latlng: function latlng() {
        var lat, lng;
        lat = this.$wrapper.find('[data-builder-field][name="latitude"]').val();
        lng = this.$wrapper.find('[data-builder-field][name="longitude"]').val();

        if (lat.length > 0 && lng.length > 0) {
          this.map.setCenter(new google.maps.LatLng(lat, lng));
        }

        return this;
      },
      zoomlevel: function zoomlevel(value) {
        var value = arguments[0];
        this.map.setZoom(parseInt(value, 10));
        return this;
      },
      maptypecontrol: function maptypecontrol(value) {
        var options;
        options = {};

        if (value === 'false') {
          options.mapTypeControl = false;
        } else {
          options = {
            mapTypeControl: true,
            mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle[value.toUpperCase()]
            }
          };
        }

        this.map.setOptions(options);
        return this;
      },
      zoomcontrol: function zoomcontrol(value) {
        var options;
        options = {};

        if (value === 'false') {
          options.zoomControl = false;
        } else {
          options = {
            zoomControl: true,
            zoomControlOptions: {
              style: google.maps.ZoomControlStyle[value.toUpperCase()]
            }
          };
        }

        this.map.setOptions(options);
        return this;
      },
      scalecontrol: function scalecontrol(value) {
        var options;
        options = {};
        options.scaleControl = value !== 'false';
        this.map.setOptions(options);
        return this;
      },
      streetviewcontrol: function streetviewcontrol(value) {
        var options;
        options = {};
        options.streetViewControl = value !== 'false';
        this.map.setOptions(options);
        return this;
      },
      pancontrol: function pancontrol(value) {
        var options;
        options = {};
        options.panControl = value !== 'false';
        this.map.setOptions(options);
        return this;
      },
      overviewcontrol: function overviewcontrol(value) {
        var options;
        options = {};

        if (value === 'false') {
          options.overviewMapControl = false;
        } else {
          options = {
            overviewMapControl: true,
            overviewMapControlOptions: {
              opened: value === 'opened'
            }
          };
        }

        this.map.setOptions(options);
        return this;
      },
      draggablecontrol: function draggablecontrol(value) {
        var options;
        options = {};
        options.draggable = value !== 'false';
        this.map.setOptions(options);
        return this;
      },
      clicktozoomcontrol: function clicktozoomcontrol(value) {
        var options;
        options = {};
        options.disableDoubleClickZoom = value === 'false';
        this.map.setOptions(options);
        return this;
      },
      scrollwheelcontrol: function scrollwheelcontrol(value) {
        var options;
        options = {};
        options.scrollwheel = value !== 'false';
        this.map.setOptions(options);
        return this;
      },
      maptype: function maptype(value) {
        var options, mapStyles, mapType;
        mapStyles = this.$wrapper.find('[data-builder-field="maptheme"]').children('option').filter(':selected').data('json');
        mapType = google.maps.MapTypeId[value.toUpperCase()];
        options = {
          mapTypeId: mapType
        };

        if ($.inArray(google.maps.MapTypeId[value.toUpperCase()], ['terrain', 'roadmap']) > -1 && !!mapStyles) {
          options.styles = eval(mapStyles);
        } else {
          options.styles = false;
          this.updateControl('maptheme');
        }

        this.map.setOptions(options);
      },
      maptheme: function maptheme(value) {
        var json, mapType, options;
        mapType = google.maps.MapTypeId[this.map.getMapTypeId() === 'terrain' ? 'TERRAIN' : 'ROADMAP'];
        options = {};
        json = this.$wrapper.find('[data-builder-field="maptheme"]').children('option').filter(':selected').data('json');

        if (!json) {
          options = {
            mapTypeId: mapType,
            styles: false
          };
        } else {
          options = {
            mapTypeId: mapType,
            styles: eval(json)
          };
        }

        this.map.setOptions(options);
      }
    },
    // CONTROLS FUNCTIONS
    // -----------------------------------------------------------------------------
    updateControl: function updateControl(prop) {
      var updateFn;
      updateFn = this.updateControlValue[prop];

      if ($.isFunction(updateFn)) {
        updateFn.apply(this);
      } else {
        console.info('missing update function for', prop);
      }

      return this;
    },
    updateControlValue: {
      latlng: function latlng() {
        var center = this.map.getCenter();
        this.$wrapper.find('[data-builder-field][name="latitude"]').val(roundNumber(center.lat(), 6));
        this.$wrapper.find('[data-builder-field][name="longitude"]').val(roundNumber(center.lng(), 6));
      },
      zoomlevel: function zoomlevel() {
        var $control, level;
        level = this.map.getZoom();
        $control = this.$wrapper.find('[data-builder-field="zoomlevel"]');
        $control.children('option[value="' + level + '"]').prop('selected', true);

        if ($control.hasClass('select2-offscreen')) {
          $control.select2('val', level);
        }
      },
      maptype: function maptype() {
        var $control, mapType;
        mapType = this.map.getMapTypeId();
        $control = this.$wrapper.find('[data-builder-field="maptype"]');
        $control.children('option[value="' + mapType + '"]').prop('selected', true);

        if ($control.hasClass('select2-offscreen')) {
          $control.select2('val', mapType);
        }
      },
      maptheme: function maptheme() {
        var $control;
        $control = this.$wrapper.find('[data-builder-field="maptheme"]');
        $control.children('option[value="false"]').prop('selected', true);

        if ($control.hasClass('select2-offscreen')) {
          $control.select2('val', 'false');
        }
      }
    },
    // MARKERS FUNCTIONS
    // -----------------------------------------------------------------------------
    editMarker: function editMarker(marker) {
      this.currentMarker = marker;
      this.marker.$form.find('#MarkerLocation').val(marker.location);
      this.marker.$form.find('#MarkerTitle').val(marker.title);
      this.marker.$form.find('#MarkerDescription').val(marker.description);
      this.marker.$modal.modal('show');
    },
    removeMarker: function removeMarker(marker) {
      var i;

      marker._instance.setMap(null);

      marker._$html.remove();

      for (i = 0; i < this.markers.length; i++) {
        if (marker === this.markers[i]) {
          this.markers.splice(i, 1);
          break;
        }
      }

      if (this.markers.length === 0) {
        this.marker.$list.addClass('hidden');
      }
    },
    saveMarker: function saveMarker(marker) {
      this._geocode(marker);
    },
    removeAllMarkers: function removeAllMarkers() {
      var i = 0,
          l,
          marker;
      l = this.markers.length;

      for (; i < l; i++) {
        marker = this.markers[i];

        marker._instance.setMap(null);

        marker._$html.remove();
      }

      this.markers = [];
      this.marker.$list.addClass('hidden');
    },
    _geocode: function _geocode(marker) {
      var _self = this,
          status;

      this.geocoder.geocode({
        address: marker.location
      }, function (response, status) {
        _self._onGeocodeResult(marker, response, status);
      });
    },
    _onGeocodeResult: function _onGeocodeResult(marker, response, status) {
      var result;

      if (!response || status !== google.maps.GeocoderStatus.OK) {
        if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {// show notification
        } else {
          timeouts++;

          if (timeouts > 3) {// show notification reached limit of requests
          }
        }
      } else {
        timeouts = 0;

        if (this.currentMarker) {
          this.removeMarker(this.currentMarker);
          this.currentMarker = null;
        } // grab first result of the list


        result = response[0]; // get lat & lng and set to marker

        marker.lat = Math.round(result.geometry.location.lat() * 1000000) / 1000000;
        marker.lng = Math.round(result.geometry.location.lng() * 1000000) / 1000000;
        var opts = {
          position: new google.maps.LatLng(marker.lat, marker.lng),
          map: this.map
        };

        if (marker.title.length > 0) {
          opts.title = marker.title;
        }

        if (marker.description.length > 0) {
          opts.desc = marker.description;
        }

        marker.position = opts.position;
        marker._instance = new google.maps.Marker(opts);

        if (!!marker.title || !!marker.description) {
          this._bindMarkerClick(marker);
        }

        this.markers.push(marker); // append to markers list

        this._appendMarkerToList(marker); // hide modal and reset form


        this.marker.$form.get(0).reset();
        this.marker.$modal.modal('hide');
      }
    },
    _appendMarkerToList: function _appendMarkerToList(marker) {
      var _self = this,
          html;

      html = ['<li>', '<p>{location}</p>', '<a href="#" class="location-action location-center"><i class="fas fa-map-marker-alt"></i></a>', '<a href="#" class="location-action location-edit"><i class="fas fa-edit"></i></a>', '<a href="#" class="location-action location-remove text-danger"><i class="fas fa-times"></i></a>', '</li>'].join('');
      html = html.replace(/\{location\}/, !!marker.title ? marker.title : marker.location);
      marker._$html = $(html); // events

      marker._$html.find('.location-center').on('click', function (e) {
        _self.map.setCenter(marker.position);
      });

      marker._$html.find('.location-remove').on('click', function (e) {
        e.preventDefault();

        _self.removeMarker(marker);
      });

      marker._$html.find('.location-edit').on('click', function (e) {
        e.preventDefault();

        _self.editMarker(marker);
      });

      this.marker.$list.append(marker._$html).removeClass('hidden');
    },
    _bindMarkerClick: function _bindMarkerClick(marker) {
      var _self = this,
          html;

      html = ['<div style="background-color: #FFF; color: #000; padding: 5px; width: 150px;">', '{title}', '{description}', '</div>'].join('');
      html = html.replace(/\{title\}/, !!marker.title ? "<h4>" + marker.title + "</h4>" : "");
      html = html.replace(/\{description\}/, !!marker.description ? "<p>" + marker.description + "</p>" : "");
      marker._infoWindow = new google.maps.InfoWindow({
        content: html
      });
      google.maps.event.addListener(marker._instance, 'click', function () {
        if (marker._infoWindow.isOpened) {
          marker._infoWindow.close();

          marker._infoWindow.isOpened = false;
        } else {
          marker._infoWindow.open(_self.map, this);

          marker._infoWindow.isOpened = true;
        }
      });
    },
    preview: function preview() {
      var customScript, googleScript, iframe, previewHtml;
      previewHtml = ['<style>', 'html, body { margin: 0; padding: 0; }', '</style>', '<div id="' + this.$wrapper.find('[data-builder-field="mapid"]').val() + '" style="width: 100%; height: 100%;"></div>'];
      iframe = this.$previewModal.find('iframe').get(0).contentWindow.document;
      iframe.body.innerHTML = previewHtml.join('');
      customScript = iframe.createElement('script');
      customScript.type = 'text/javascript';
      customScript.text = "window.initialize = function() { " + this.generate() + " init(); }; ";
      iframe.body.appendChild(customScript);
      googleScript = iframe.createElement('script');
      googleScript.type = 'text/javascript';
      googleScript.text = 'function loadScript() { var script = document.createElement("script"); script.type = "text/javascript"; script.src = "//maps.googleapis.com/maps/api/js?key=&sensor=&callback=initialize"; document.body.appendChild(script); } loadScript()';
      iframe.body.appendChild(googleScript);
    },
    getCode: function getCode() {
      this.$getCodeModal.find('.modal-body pre').html(this.generate().replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    },
    // GENERATE CODE
    // -----------------------------------------------------------------------------
    generate: function generate() {
      var i, work;
      var output = ['    google.maps.event.addDomListener(window, "load", init);', '    var map;', '    function init() {', '        var mapOptions = {', '            center: new google.maps.LatLng({lat}, {lng}),', '            zoom: {zoom},', '            zoomControl: {zoomControl},', '            {zoomControlOptions}', '            disableDoubleClickZoom: {disableDoubleClickZoom},', '            mapTypeControl: {mapTypeControl},', '            {mapTypeControlOptions}', '            scaleControl: {scaleControl},', '            scrollwheel: {scrollwheel},', '            panControl: {panControl},', '            streetViewControl: {streetViewControl},', '            draggable : {draggable},', '            overviewMapControl: {overviewMapControl},', '            {overviewMapControlOptions}', '            mapTypeId: google.maps.MapTypeId.{mapTypeId}{styles}', '        };', '', '        var mapElement = document.getElementById("{mapid}");', '        var map = new google.maps.Map(mapElement, mapOptions);', '        {locations}', '    }'];
      output = output.join("\r\n");
      var zoomControl = this.$wrapper.find('[data-builder-field="zoomcontrol"] option:selected').val() !== 'false';
      var mapTypeControl = this.$wrapper.find('[data-builder-field="maptypecontrol"] option:selected').val() !== 'false';
      var overviewMapControl = this.$wrapper.find('[data-builder-field="overviewcontrol"] option:selected').val().toLowerCase();
      var $themeControl = this.$wrapper.find('[data-builder-field="maptheme"] option:selected').filter(':selected');
      output = output.replace(/\{mapid\}/, this.$wrapper.find('[data-builder-field="mapid"]').val()).replace(/\{lat\}/, this.$wrapper.find('[data-builder-field][name="latitude"]').val()).replace(/\{lng\}/, this.$wrapper.find('[data-builder-field][name="longitude"]').val()).replace(/\{zoom\}/, this.$wrapper.find('[data-builder-field="zoomlevel"] option:selected').val()).replace(/\{zoomControl\}/, zoomControl).replace(/\{disableDoubleClickZoom\}/, this.$wrapper.find('[data-builder-field="clicktozoomcontrol"] option:selected').val() === 'false').replace(/\{mapTypeControl\}/, mapTypeControl).replace(/\{scaleControl\}/, this.$wrapper.find('[data-builder-field="scalecontrol"] option:selected').val() !== 'false').replace(/\{scrollwheel\}/, this.$wrapper.find('[data-builder-field="scrollwheelcontrol"] option:selected').val() !== 'false').replace(/\{panControl\}/, this.$wrapper.find('[data-builder-field="pancontrol"] option:selected').val() !== 'false').replace(/\{streetViewControl\}/, this.$wrapper.find('[data-builder-field="streetviewcontrol"] option:selected').val() !== 'false').replace(/\{draggable\}/, this.$wrapper.find('[data-builder-field="draggablecontrol"] option:selected').val() !== 'false').replace(/\{overviewMapControl\}/, overviewMapControl !== 'false').replace(/\{mapTypeId\}/, this.$wrapper.find('[data-builder-field="maptype"] option:selected').val().toUpperCase());

      if (zoomControl) {
        work = {
          zoomControlOptions: {
            style: this.$wrapper.find('[data-builder-field="maptypecontrol"] option:selected').val().toUpperCase()
          }
        };
        output = output.replace(/\{zoomControlOptions\}/, "zoomControlOptions: {\r\n                style: google.maps.ZoomControlStyle." + this.$wrapper.find('[data-builder-field="zoomcontrol"] option:selected').val().toUpperCase() + "\r\n\            },");
      } else {
        output = output.replace(/\{zoomControlOptions\}/, '');
      }

      if (mapTypeControl) {
        work = {
          zoomControlOptions: {
            style: this.$wrapper.find('[data-builder-field="maptypecontrol"] option:selected').val().toUpperCase()
          }
        };
        output = output.replace(/\{mapTypeControlOptions\}/, "mapTypeControlOptions: {\r\n                style: google.maps.MapTypeControlStyle." + this.$wrapper.find('[data-builder-field="maptypecontrol"] option:selected').val().toUpperCase() + "\r\n\            },");
      } else {
        output = output.replace(/\{mapTypeControlOptions\}/, '');
      }

      if (overviewMapControl !== 'false') {
        output = output.replace(/\{overviewMapControlOptions\}/, "overviewMapControlOptions: {\r\n                opened: " + (overviewMapControl === 'opened') + "\r\n\            },");
      } else {
        output = output.replace(/\{overviewMapControlOptions\}/, '');
      }

      if ($themeControl.val() !== 'false') {
        output = output.replace(/\{styles\}/, ',\r\n            styles: ' + $themeControl.data('json').replace(/\r\n/g, ''));
      } else {
        output = output.replace(/\{styles\}/, '');
      }

      if (this.markers.length > 0) {
        var work = ['var locations = ['];
        var m, object;

        for (i = 0; i < this.markers.length; i++) {
          m = this.markers[i];
          object = '';
          object += '            { lat: ' + m.lat + ', lng: ' + m.lng;

          if (!!m.title) {
            object += ', title: "' + m.title + '"';
          }

          if (!!m.description) {
            object += ', description: "' + m.description + '"';
          }

          object += ' }';

          if (i + 1 < this.markers.length) {
            object += ',';
          }

          work.push(object);
        }

        work.push('        ];\r\n');
        work.push('        var opts = {};');
        work.push('        for (var i = 0; i < locations.length; i++) {');
        work.push('            opts.position = new google.maps.LatLng( locations[ i ].lat, locations[ i ].lng );');
        work.push('            opts.map = map;');
        work.push('            if ( !!locations[ i ] .title ) { opts.title = locations[ i ].title; }');
        work.push('            if ( !!locations[ i ] .description ) { opts.description = locations[ i ].description; }');
        work.push('            marker = new google.maps.Marker( opts );');
        work.push('');
        work.push('            (function() {');
        work.push('                var html = [');
        work.push('                	\'<div style="background-color: #FFF; color: #000; padding: 5px; width: 150px;">\',');
        work.push('                		\'{title}\',');
        work.push('                		\'{description}\',');
        work.push('                	\'</div>\'');
        work.push('                ].join(\'\');');
        work.push('');
        work.push('                html = html.replace(/\{title\}/, !!opts.title ?  ("<h4>" + opts.title + "</h4>") : "" );');
        work.push('                html = html.replace(/\{description\}/, !!opts.description ?  ("<p>" + opts.description + "</p>") : "" );');
        work.push('                var infoWindow = new google.maps.InfoWindow({ content: html });');
        work.push('                google.maps.event.addListener( marker, \'click\', function() {');
        work.push('                	if ( infoWindow.isOpened ) {');
        work.push('                		infoWindow.close();');
        work.push('                		infoWindow.isOpened = false;');
        work.push('                	} else {');
        work.push('                		infoWindow.open( map, this );');
        work.push('                		infoWindow.isOpened = true;');
        work.push('                	}');
        work.push('                });');
        work.push('            })();');
        work.push('        }');
        output = output.replace(/\{locations\}/, work.join('\r\n'));
      } else {
        output = output.replace(/\{locations\}/, '');
      }

      console.log(output);
      return output;
    }
  }; // expose

  $.extend(true, theme, {
    Maps: {
      GMapBuilder: GMapBuilder
    }
  }); // jQuery plugin

  $.fn.themeGMapBuilder = function (opts) {
    return this.map(function () {
      var $this = $(this),
          instance;
      instance = $this.data(instanceName);

      if (instance) {
        return instance;
      } else {
        return new GMapBuilder($this, opts);
      }
    });
  }; // auto initialize


  $(function () {
    $('[data-theme-gmap-builder]').each(function () {
      var $this = $(this);
      window.builder = $this.themeGMapBuilder();
    });
  });
}).apply(this, [window.theme, jQuery]); // Markdown

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__markdownEditor';

  var PluginMarkdownEditor = function PluginMarkdownEditor($el, opts) {
    return this.initialize($el, opts);
  };

  PluginMarkdownEditor.defaults = {
    iconlibrary: 'fa',
    buttons: [[{
      data: [{
        icon: {
          fa: 'fa fa-bold'
        }
      }, {
        icon: {
          fa: 'fa fa-italic'
        }
      }, {
        icon: {
          fa: 'fa fa-heading'
        }
      }]
    }, {
      data: [{
        icon: {
          fa: 'fa fa-link'
        }
      }, {
        icon: {
          fa: 'fa fa-image'
        }
      }]
    }, {
      data: [{
        icon: {
          fa: 'fa fa-list'
        }
      }, {
        icon: {
          fa: 'fa fa-list-ol'
        }
      }, {
        icon: {
          fa: 'fa fa-code'
        }
      }, {
        icon: {
          fa: 'fa fa-quote-left'
        }
      }]
    }, {
      data: [{
        icon: {
          fa: 'fa fa-search'
        }
      }]
    }]]
  };
  PluginMarkdownEditor.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginMarkdownEditor.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.markdown(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginMarkdownEditor: PluginMarkdownEditor
  }); // jquery plugin

  $.fn.themePluginMarkdownEditor = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginMarkdownEditor($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Masked Input

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__maskedInput';

  var PluginMaskedInput = function PluginMaskedInput($el, opts) {
    return this.initialize($el, opts);
  };

  PluginMaskedInput.defaults = {};
  PluginMaskedInput.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginMaskedInput.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.mask(this.$el.data('input-mask'), this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginMaskedInput: PluginMaskedInput
  }); // jquery plugin

  $.fn.themePluginMaskedInput = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginMaskedInput($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // MaxLength

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__maxlength';

  var PluginMaxLength = function PluginMaxLength($el, opts) {
    return this.initialize($el, opts);
  };

  PluginMaxLength.defaults = {
    alwaysShow: true,
    placement: 'bottom-left',
    warningClass: 'badge badge-success bottom-left',
    limitReachedClass: 'badge badge-danger bottom-left'
  };
  PluginMaxLength.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginMaxLength.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.maxlength(this.options);
      this.$el.on('blur', function () {
        $('.bootstrap-maxlength').remove();
      });
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginMaxLength: PluginMaxLength
  }); // jquery plugin

  $.fn.themePluginMaxLength = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginMaxLength($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // MultiSelect

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__multiselect';

  var PluginMultiSelect = function PluginMultiSelect($el, opts) {
    return this.initialize($el, opts);
  };

  PluginMultiSelect.defaults = {
    templates: {
      li: '<li><a class="dropdown-item" tabindex="0"><label style="display: block;"></label></a></li>',
      filter: '<div class="input-group"><span class="input-group-prepend"><span class="input-group-text"><i class="fas fa-search"></i></span></span><input class="form-control multiselect-search" type="text"></div>'
    }
  };
  PluginMultiSelect.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginMultiSelect.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.multiselect(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginMultiSelect: PluginMultiSelect
  }); // jquery plugin

  $.fn.themePluginMultiSelect = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginMultiSelect($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Notifications - Config

(function ($) {
  'use strict'; // use font awesome icons if available

  if (typeof PNotify != 'undefined') {
    PNotify.prototype.options.styling = "fontawesome";
    $.extend(true, PNotify.prototype.options, {
      shadow: false,
      stack: {
        spacing1: 15,
        spacing2: 15
      }
    });
    $.extend(PNotify.styling.fontawesome, {
      // classes
      container: "notification",
      notice: "notification-warning",
      info: "notification-info",
      success: "notification-success",
      error: "notification-danger",
      // icons
      notice_icon: "fas fa-exclamation",
      info_icon: "fas fa-info",
      success_icon: "fas fa-check",
      error_icon: "fas fa-times"
    });
  }
}).apply(this, [jQuery]); // Portlets

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__portlet',
      storageOrderKey = '__portletOrder',
      storageStateKey = '__portletState';

  var PluginPortlet = function PluginPortlet($el, opts) {
    return this.initialize($el, opts);
  };

  PluginPortlet.defaults = {
    connectWith: '[data-plugin-portlet]',
    items: '[data-portlet-item]',
    handle: '.portlet-handler',
    opacity: 0.7,
    placeholder: 'portlet-placeholder',
    cancel: 'portlet-cancel',
    forcePlaceholderSize: true,
    forceHelperSize: true,
    tolerance: 'pointer',
    helper: 'original',
    revert: 200
  };
  PluginPortlet.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      var _self = this;

      this.options = $.extend(true, {}, PluginPortlet.defaults, opts, {
        wrapper: this.$el,
        update: _self.onUpdate,
        create: _self.onLoad
      });
      return this;
    },
    onUpdate: function onUpdate(event, ui) {
      var key = storageOrderKey,
          data = store.get(key),
          $this = $(this),
          porletId = $this.prop('id');

      if (!data) {
        data = {};
      }

      if (!!porletId) {
        data[porletId] = $this.sortable('toArray');
        store.set(key, data);
      }
    },
    onLoad: function onLoad(event, ui) {
      var key = storageOrderKey,
          data = store.get(key),
          $this = $(this),
          porletId = $this.prop('id'),
          portlet = $('#' + porletId);

      if (!!data) {
        var cards = data[porletId];

        if (!!cards) {
          $.each(cards, function (index, panelId) {
            $('#' + panelId).appendTo(portlet);
          });
        }
      }
    },
    saveState: function saveState(panel) {
      var key = storageStateKey,
          data = store.get(key),
          panelId = panel.prop('id');

      if (!data) {
        data = {};
      }

      if (!panelId) {
        return this;
      }

      var collapse = panel.find('.card-actions').children('a.fa-caret-up, a.fa-caret-down'),
          isCollapsed = !!collapse.hasClass('fa-caret-up'),
          isRemoved = !panel.closest('body').get(0);

      if (isRemoved) {
        data[panelId] = 'removed';
      } else if (isCollapsed) {
        data[panelId] = 'collapsed';
      } else {
        delete data[panelId];
      }

      store.set(key, data);
      return this;
    },
    loadState: function loadState() {
      var key = storageStateKey,
          data = store.get(key);

      if (!!data) {
        $.each(data, function (panelId, state) {
          var panel = $('#' + panelId);

          if (!panel.data('portlet-state-loaded')) {
            if (state == 'collapsed') {
              panel.find('.card-actions a.fa-caret-down').trigger('click');
            } else if (state == 'removed') {
              panel.find('.card-actions a.fa-times').trigger('click');
            }

            panel.data('portlet-state-loaded', true);
          }
        });
      }

      return this;
    },
    build: function build() {
      var _self = this;

      if ($.isFunction($.fn.sortable)) {
        this.$el.sortable(this.options);
        this.$el.find('[data-portlet-item]').each(function () {
          _self.events($(this));
        });
      }

      var portlet = this.$el;
      portlet.css('min-height', 150);
      return this;
    },
    events: function events($el) {
      var _self = this,
          portlet = $el.closest('[data-plugin-portlet]');

      this.loadState();
      $el.find('.card-actions').on('click', 'a.fa-caret-up, a.fa-caret-down, a.fa-times', function (e) {
        setTimeout(function () {
          _self.saveState($el);
        }, 250);
      });
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginPortlet: PluginPortlet
  }); // jquery plugin

  $.fn.themePluginPortlet = function (opts) {
    return this.map(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginPortlet($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Scroll to Top

(function (theme, $) {
  theme = theme || {};
  $.extend(theme, {
    PluginScrollToTop: {
      defaults: {
        wrapper: $('body'),
        offset: 150,
        buttonClass: 'scroll-to-top',
        iconClass: 'fas fa-chevron-up',
        delay: 500,
        visibleMobile: false,
        label: false
      },
      initialize: function initialize(opts) {
        initialized = true;
        this.setOptions(opts).build().events();
        return this;
      },
      setOptions: function setOptions(opts) {
        this.options = $.extend(true, {}, this.defaults, opts);
        return this;
      },
      build: function build() {
        var self = this,
            $el; // Base HTML Markup

        $el = $('<a />').addClass(self.options.buttonClass).attr({
          'href': '#'
        }).append($('<i />').addClass(self.options.iconClass)); // Visible Mobile

        if (!self.options.visibleMobile) {
          $el.addClass('hidden-mobile');
        } // Label


        if (self.options.label) {
          $el.append($('<span />').html(self.options.label));
        }

        this.options.wrapper.append($el);
        this.$el = $el;
        return this;
      },
      events: function events() {
        var self = this,
            _isScrolling = false; // Click Element Action

        self.$el.on('click', function (e) {
          e.preventDefault();
          $('body, html').animate({
            scrollTop: 0
          }, self.options.delay);
          return false;
        }); // Show/Hide Button on Window Scroll event.

        $(window).scroll(function () {
          if (!_isScrolling) {
            _isScrolling = true;

            if ($(window).scrollTop() > self.options.offset) {
              self.$el.stop(true, true).addClass('visible');
              _isScrolling = false;
            } else {
              self.$el.stop(true, true).removeClass('visible');
              _isScrolling = false;
            }
          }
        });
        return this;
      }
    }
  });
}).apply(this, [window.theme, jQuery]); // Scrollable

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__scrollable';

  var PluginScrollable = function PluginScrollable($el, opts) {
    return this.initialize($el, opts);
  };

  PluginScrollable.updateModals = function () {
    PluginScrollable.updateBootstrapModal();
  };

  PluginScrollable.updateBootstrapModal = function () {
    var updateBoostrapModal;
    updateBoostrapModal = typeof $.fn.modal !== 'undefined';
    updateBoostrapModal = updateBoostrapModal && typeof $.fn.modal.Constructor !== 'undefined';
    updateBoostrapModal = updateBoostrapModal && typeof $.fn.modal.Constructor.prototype !== 'undefined';
    updateBoostrapModal = updateBoostrapModal && typeof $.fn.modal.Constructor.prototype.enforceFocus !== 'undefined';

    if (!updateBoostrapModal) {
      return false;
    }

    var originalFocus = $.fn.modal.Constructor.prototype.enforceFocus;

    $.fn.modal.Constructor.prototype.enforceFocus = function () {
      originalFocus.apply(this);
      var $scrollable = this.$element.find('.scrollable');

      if ($scrollable) {
        if ($.isFunction($.fn['themePluginScrollable'])) {
          $scrollable.themePluginScrollable();
        }

        if ($.isFunction($.fn['nanoScroller'])) {
          $scrollable.nanoScroller();
        }
      }
    };
  };

  PluginScrollable.defaults = {
    contentClass: 'scrollable-content',
    paneClass: 'scrollable-pane',
    sliderClass: 'scrollable-slider',
    alwaysVisible: true,
    preventPageScrolling: true
  };
  PluginScrollable.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginScrollable.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      this.options.wrapper.nanoScroller(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginScrollable: PluginScrollable
  }); // jquery plugin

  $.fn.themePluginScrollable = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginScrollable($this, opts);
      }
    });
  };

  $(function () {
    PluginScrollable.updateModals();
  });
}).apply(this, [window.theme, jQuery]); // Select2

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__select2';

  var PluginSelect2 = function PluginSelect2($el, opts) {
    return this.initialize($el, opts);
  };

  PluginSelect2.defaults = {
    theme: 'bootstrap'
  };
  PluginSelect2.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginSelect2.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.select2(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginSelect2: PluginSelect2
  }); // jquery plugin

  $.fn.themePluginSelect2 = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginSelect2($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Slider

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__slider';

  var PluginSlider = function PluginSlider($el, opts) {
    return this.initialize($el, opts);
  };

  PluginSlider.defaults = {};
  PluginSlider.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setVars().setData().setOptions(opts).build();
      return this;
    },
    setVars: function setVars() {
      var $output = $(this.$el.data('plugin-slider-output'));
      this.$output = $output.get(0) ? $output : null;
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      var _self = this;

      this.options = $.extend(true, {}, PluginSlider.defaults, opts);

      if (this.$output) {
        $.extend(this.options, {
          slide: function slide(event, ui) {
            _self.onSlide(event, ui);
          }
        });
      }

      return this;
    },
    build: function build() {
      this.$el.slider(this.options);
      return this;
    },
    onSlide: function onSlide(event, ui) {
      if (!ui.values) {
        this.$output.val(ui.value);
      } else {
        this.$output.val(ui.values[0] + '/' + ui.values[1]);
      }

      this.$output.trigger('change');
    }
  }; // expose to scope

  $.extend(theme, {
    PluginSlider: PluginSlider
  }); // jquery plugin

  $.fn.themePluginSlider = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginSlider($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Spinner

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__spinner';

  var PluginSpinner = function PluginSpinner($el, opts) {
    return this.initialize($el, opts);
  };

  PluginSpinner.defaults = {};
  PluginSpinner.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginSpinner.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.spinner(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginSpinner: PluginSpinner
  }); // jquery plugin

  $.fn.themePluginSpinner = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginSpinner($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // SummerNote

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__summernote';

  var PluginSummerNote = function PluginSummerNote($el, opts) {
    return this.initialize($el, opts);
  };

  PluginSummerNote.defaults = {
    onfocus: function onfocus() {
      $(this).closest('.note-editor').addClass('active');
    },
    onblur: function onblur() {
      $(this).closest('.note-editor').removeClass('active');
    }
  };
  PluginSummerNote.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginSummerNote.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.summernote(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginSummerNote: PluginSummerNote
  }); // jquery plugin

  $.fn.themePluginSummerNote = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginSummerNote($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // TextArea AutoSize

(function (theme, $) {
  theme = theme || {};
  var initialized = false;
  var instanceName = '__textareaAutosize';

  var PluginTextAreaAutoSize = function PluginTextAreaAutoSize($el, opts) {
    return this.initialize($el, opts);
  };

  PluginTextAreaAutoSize.defaults = {};
  PluginTextAreaAutoSize.prototype = {
    initialize: function initialize($el, opts) {
      if (initialized) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginTextAreaAutoSize.defaults, opts);
      return this;
    },
    build: function build() {
      autosize($(this.$el));
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginTextAreaAutoSize: PluginTextAreaAutoSize
  }); // jquery plugin

  $.fn.themePluginTextAreaAutoSize = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginTextAreaAutoSize($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // TimePicker

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__timepicker';

  var PluginTimePicker = function PluginTimePicker($el, opts) {
    return this.initialize($el, opts);
  };

  PluginTimePicker.defaults = {
    disableMousewheel: true,
    icons: {
      up: 'fas fa-chevron-up',
      down: 'fas fa-chevron-down'
    }
  };
  PluginTimePicker.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginTimePicker.defaults, opts);
      return this;
    },
    build: function build() {
      this.$el.timepicker(this.options);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginTimePicker: PluginTimePicker
  }); // jquery plugin

  $.fn.themePluginTimePicker = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginTimePicker($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Toggle

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__toggle';

  var PluginToggle = function PluginToggle($el, opts) {
    return this.initialize($el, opts);
  };

  PluginToggle.defaults = {
    duration: 350,
    isAccordion: false,
    addIcons: true
  };
  PluginToggle.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginToggle.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      var self = this,
          $wrapper = this.options.wrapper,
          $items = $wrapper.find('.toggle'),
          $el = null;
      $items.each(function () {
        $el = $(this);

        if (self.options.addIcons) {
          $el.find('> label').prepend($('<i />').addClass('fas fa-plus'), $('<i />').addClass('fas fa-minus'));
        }

        if ($el.hasClass('active')) {
          $el.find('> p').addClass('preview-active');
          $el.find('> .toggle-content').slideDown(self.options.duration);
        }

        self.events($el);
      });

      if (self.options.isAccordion) {
        self.options.duration = self.options.duration / 2;
      }

      return this;
    },
    events: function events($el) {
      var self = this,
          previewParCurrentHeight = 0,
          previewParAnimateHeight = 0,
          toggleContent = null;
      $el.find('> label').click(function (e) {
        var $this = $(this),
            parentSection = $this.parent(),
            parentWrapper = $this.parents('.toggle'),
            previewPar = null,
            closeElement = null;

        if (self.options.isAccordion && typeof e.originalEvent != 'undefined') {
          closeElement = parentWrapper.find('.toggle.active > label');

          if (closeElement[0] == $this[0]) {
            return;
          }
        }

        parentSection.toggleClass('active'); // Preview Paragraph

        if (parentSection.find('> p').get(0)) {
          previewPar = parentSection.find('> p');
          previewParCurrentHeight = previewPar.css('height');
          previewPar.css('height', 'auto');
          previewParAnimateHeight = previewPar.css('height');
          previewPar.css('height', previewParCurrentHeight);
        } // Content


        toggleContent = parentSection.find('> .toggle-content');

        if (parentSection.hasClass('active')) {
          $(previewPar).animate({
            height: previewParAnimateHeight
          }, self.options.duration, function () {
            $(this).addClass('preview-active');
          });
          toggleContent.slideDown(self.options.duration, function () {
            if (closeElement) {
              closeElement.trigger('click');
            }
          });
        } else {
          $(previewPar).animate({
            height: 0
          }, self.options.duration, function () {
            $(this).removeClass('preview-active');
          });
          toggleContent.slideUp(self.options.duration);
        }
      });
    }
  }; // expose to scope

  $.extend(theme, {
    PluginToggle: PluginToggle
  }); // jquery plugin

  $.fn.themePluginToggle = function (opts) {
    return this.map(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginToggle($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Widget - Todo

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__widgetTodoList';

  var WidgetTodoList = function WidgetTodoList($el, opts) {
    return this.initialize($el, opts);
  };

  WidgetTodoList.defaults = {};
  WidgetTodoList.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build().events();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, WidgetTodoList.defaults, opts);
      return this;
    },
    check: function check(input, label) {
      if (input.is(':checked')) {
        label.addClass('line-through');
      } else {
        label.removeClass('line-through');
      }
    },
    build: function build() {
      var _self = this,
          $check = this.$el.find('.todo-check');

      $check.each(function () {
        var label = $(this).closest('li').find('.todo-label');

        _self.check($(this), label);
      });
      return this;
    },
    events: function events() {
      var _self = this,
          $remove = this.$el.find('.todo-remove'),
          $check = this.$el.find('.todo-check'),
          $window = $(window);

      $remove.on('click.widget-todo-list', function (ev) {
        ev.preventDefault();
        $(this).closest("li").remove();
      });
      $check.on('change', function () {
        var label = $(this).closest('li').find('.todo-label');

        _self.check($(this), label);
      });

      if ($.isFunction($.fn.sortable)) {
        this.$el.sortable({
          sort: function sort(event, ui) {
            var top = event.pageY - _self.$el.offset().top - ui.helper.outerHeight(true) / 2;
            ui.helper.css({
              'top': top + 'px'
            });
          }
        });
      }

      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    WidgetTodoList: WidgetTodoList
  }); // jquery plugin

  $.fn.themePluginWidgetTodoList = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new WidgetTodoList($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Widget - Toggle

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__widgetToggleExpand';

  var WidgetToggleExpand = function WidgetToggleExpand($el, opts) {
    return this.initialize($el, opts);
  };

  WidgetToggleExpand.defaults = {};
  WidgetToggleExpand.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build().events();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, WidgetToggleExpand.defaults, opts);
      return this;
    },
    build: function build() {
      return this;
    },
    events: function events() {
      var _self = this,
          $toggler = this.$el.find('.widget-toggle');

      $toggler.on('click.widget-toggler', function () {
        _self.$el.hasClass('widget-collapsed') ? _self.expand(_self.$el) : _self.collapse(_self.$el);
      });
      return this;
    },
    expand: function expand(content) {
      content.children('.widget-content-expanded').slideDown('fast', function () {
        $(this).css('display', '');
        content.removeClass('widget-collapsed');
      });
    },
    collapse: function collapse(content) {
      content.children('.widget-content-expanded').slideUp('fast', function () {
        content.addClass('widget-collapsed');
        $(this).css('display', '');
      });
    }
  }; // expose to scope

  $.extend(theme, {
    WidgetToggleExpand: WidgetToggleExpand
  }); // jquery plugin

  $.fn.themePluginWidgetToggleExpand = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new WidgetToggleExpand($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Word Rotator

(function (theme, $) {
  theme = theme || {};
  var instanceName = '__wordRotator';

  var PluginWordRotator = function PluginWordRotator($el, opts) {
    return this.initialize($el, opts);
  };

  PluginWordRotator.defaults = {
    delay: 2000
  };
  PluginWordRotator.prototype = {
    initialize: function initialize($el, opts) {
      if ($el.data(instanceName)) {
        return this;
      }

      this.$el = $el;
      this.setData().setOptions(opts).build();
      return this;
    },
    setData: function setData() {
      this.$el.data(instanceName, this);
      return this;
    },
    setOptions: function setOptions(opts) {
      this.options = $.extend(true, {}, PluginWordRotator.defaults, opts, {
        wrapper: this.$el
      });
      return this;
    },
    build: function build() {
      var $el = this.options.wrapper,
          itemsWrapper = $el.find(".wort-rotator-items"),
          items = itemsWrapper.find("> span"),
          firstItem = items.eq(0),
          firstItemClone = firstItem.clone(),
          itemHeight = firstItem.height(),
          currentItem = 1,
          currentTop = 0;
      itemsWrapper.append(firstItemClone);
      $el.height(itemHeight).addClass("active");
      setInterval(function () {
        currentTop = currentItem * itemHeight;
        itemsWrapper.animate({
          top: -currentTop + "px"
        }, 300, function () {
          currentItem++;

          if (currentItem > items.length) {
            itemsWrapper.css("top", 0);
            currentItem = 1;
          }
        });
      }, this.options.delay);
      return this;
    }
  }; // expose to scope

  $.extend(theme, {
    PluginWordRotator: PluginWordRotator
  }); // jquery plugin

  $.fn.themePluginWordRotator = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new PluginWordRotator($this, opts);
      }
    });
  };
}).apply(this, [window.theme, jQuery]); // Navigation

(function ($) {
  'use strict';

  var $items = $('.nav-main li.nav-parent');

  function expand($li) {
    $li.children('ul.nav-children').slideDown('fast', function () {
      $li.addClass('nav-expanded');
      $(this).css('display', '');
      ensureVisible($li);
    });
  }

  function collapse($li) {
    $li.children('ul.nav-children').slideUp('fast', function () {
      $(this).css('display', '');
      $li.removeClass('nav-expanded');
    });
  }

  function ensureVisible($li) {
    var scroller = $li.offsetParent();

    if (!scroller.get(0)) {
      return false;
    }

    var top = $li.position().top;

    if (top < 0) {
      scroller.animate({
        scrollTop: scroller.scrollTop() + top
      }, 'fast');
    }
  }

  function buildSidebarNav(anchor, prev, next, ev) {
    if (anchor.prop('href')) {
      var arrowWidth = parseInt(window.getComputedStyle(anchor.get(0), ':after').width, 10) || 0;

      if (ev.offsetX > anchor.get(0).offsetWidth - arrowWidth) {
        ev.preventDefault();
      }
    }

    if (prev.get(0) !== next.get(0)) {
      collapse(prev);
      expand(next);
    } else {
      collapse(prev);
    }
  }

  $items.find('> a').on('click', function (ev) {
    var $html = $('html'),
        $window = $(window),
        $anchor = $(this),
        $prev = $anchor.closest('ul.nav').find('> li.nav-expanded'),
        $next = $anchor.closest('li'),
        $ev = ev;

    if ($anchor.attr('href') == '#') {
      ev.preventDefault();
    }

    if (!$html.hasClass('sidebar-left-big-icons')) {
      buildSidebarNav($anchor, $prev, $next, $ev);
    } else if ($html.hasClass('sidebar-left-big-icons') && $window.width() < 768) {
      buildSidebarNav($anchor, $prev, $next, $ev);
    }
  }); // Chrome Fix

  $.browser.chrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

  if ($.browser.chrome && !$.browser.mobile) {
    var flag = true;
    $('.sidebar-left .nav-main li a').on('click', function () {
      flag = false;
      setTimeout(function () {
        flag = true;
      }, 200);
    });
    $('.nano').on('mouseenter', function (e) {
      $(this).addClass('hovered');
    });
    $('.nano').on('mouseleave', function (e) {
      if (flag) {
        $(this).removeClass('hovered');
      }
    });
  }

  $('.nav-main a').filter(':not([href])').attr('href', '#');
}).apply(this, [jQuery]); // Skeleton

(function (theme, $) {
  'use strict';

  theme = theme || {};
  var $body = $('body'),
      $html = $('html'),
      $window = $(window),
      isAndroid = navigator.userAgent.toLowerCase().indexOf('android') > -1,
      isIpad = navigator.userAgent.match(/iPad/i) != null,
      updatingNanoScroll = false; // mobile devices with fixed has a lot of issues when focus inputs and others...

  if (typeof $.browser !== 'undefined' && $.browser.mobile && $html.hasClass('fixed')) {
    $html.removeClass('fixed').addClass('scroll');
  }

  var Skeleton = {
    options: {
      sidebars: {
        menu: '#content-menu',
        left: '#sidebar-left',
        right: '#sidebar-right'
      }
    },
    customScroll: !Modernizr.overflowscrolling && !isAndroid && $.fn.nanoScroller !== 'undefined',
    initialize: function initialize() {
      this.setVars().build().events();
    },
    setVars: function setVars() {
      this.sidebars = {};
      this.sidebars.left = {
        $el: $(this.options.sidebars.left)
      };
      this.sidebars.right = {
        $el: $(this.options.sidebars.right),
        isOpened: $html.hasClass('sidebar-right-opened')
      };
      this.sidebars.menu = {
        $el: $(this.options.sidebars.menu),
        isOpened: $html.hasClass('inner-menu-opened')
      };
      return this;
    },
    build: function build() {
      if (typeof $.browser !== 'undefined' && $.browser.mobile) {
        $html.addClass('mobile-device');
      } else {
        $html.addClass('no-mobile-device');
      }

      $html.addClass('custom-scroll');

      if (this.customScroll) {
        this.buildSidebarLeft();
        this.buildContentMenu();
      }

      if (isIpad) {
        this.fixIpad();
      }

      this.buildSidebarRight();
      return this;
    },
    events: function events() {
      if (this.customScroll) {
        this.eventsSidebarLeft();
      }

      this.eventsSidebarRight();
      this.eventsContentMenu();

      if (typeof $.browser !== 'undefined' && !this.customScroll && isAndroid) {
        this.fixScroll();
      }

      return this;
    },
    fixScroll: function fixScroll() {
      var _self = this;

      $window.on('sidebar-left-opened sidebar-right-toggle', function (e, data) {
        _self.preventBodyScrollToggle(data.added);
      });
    },
    fixIpad: function fixIpad() {
      var _self = this;

      $('.header, .page-header, .content-body').on('click', function () {
        $html.removeClass('sidebar-left-opened');
      });
    },
    buildSidebarLeft: function buildSidebarLeft() {
      var initialPosition = 0;
      this.sidebars.left.isOpened = !$html.hasClass('sidebar-left-collapsed') || $html.hasClass('sidebar-left-opened');
      this.sidebars.left.$nano = this.sidebars.left.$el.find('.nano');

      if (typeof localStorage !== 'undefined') {
        this.sidebars.left.$nano.on('update', function (e, values) {
          localStorage.setItem('sidebar-left-position', values.position);
        });

        if (localStorage.getItem('sidebar-left-position') !== null) {
          initialPosition = localStorage.getItem('sidebar-left-position');
          this.sidebars.left.$el.find('.nano-content').scrollTop(initialPosition);
        }
      }

      this.sidebars.left.$nano.nanoScroller({
        scrollTop: initialPosition,
        alwaysVisible: true,
        preventPageScrolling: $html.hasClass('fixed')
      });
      return this;
    },
    eventsSidebarLeft: function eventsSidebarLeft() {
      var _self = this,
          $nano = this.sidebars.left.$nano;

      var open = function open() {
        if (_self.sidebars.left.isOpened) {
          return close();
        }

        _self.sidebars.left.isOpened = true;
        $html.addClass('sidebar-left-opened');
        $window.trigger('sidebar-left-toggle', {
          added: true,
          removed: false
        });
        $html.on('click.close-left-sidebar', function (e) {
          e.stopPropagation();
          close(e);
        });
      };

      var close = function close(e) {
        if (!!e && !!e.target && ($(e.target).closest('.sidebar-left').get(0) || !$(e.target).closest('html').get(0))) {
          e.preventDefault();
          return false;
        } else {
          $html.removeClass('sidebar-left-opened');
          $html.off('click.close-left-sidebar');
          $window.trigger('sidebar-left-toggle', {
            added: false,
            removed: true
          });
          _self.sidebars.left.isOpened = !$html.hasClass('sidebar-left-collapsed');
        }
      };

      var updateNanoScroll = function updateNanoScroll() {
        if (updatingNanoScroll) {
          if ($.support.transition) {
            $nano.nanoScroller();
            $nano.one('bsTransitionEnd', updateNanoScroll).emulateTransitionEnd(150);
          } else {
            updateNanoScroll();
          }

          updatingNanoScroll = true;
          setTimeout(function () {
            updatingNanoScroll = false;
          }, 200);
        }
      };

      var isToggler = function isToggler(element) {
        return $(element).data('fire-event') === 'sidebar-left-toggle' || $(element).parents().data('fire-event') === 'sidebar-left-toggle';
      };

      this.sidebars.left.$el.on('click', function () {
        updateNanoScroll();
      }).on('touchend', function (e) {
        _self.sidebars.left.isOpened = !$html.hasClass('sidebar-left-collapsed') || $html.hasClass('sidebar-left-opened');

        if (!_self.sidebars.left.isOpened && !isToggler(e.target)) {
          e.stopPropagation();
          e.preventDefault();
          open();
        }
      });
      $nano.on('mouseenter', function () {
        if ($html.hasClass('sidebar-left-collapsed')) {
          $nano.nanoScroller();
        }
      }).on('mouseleave', function () {
        if ($html.hasClass('sidebar-left-collapsed')) {
          $nano.nanoScroller();
        }
      });
      $window.on('sidebar-left-toggle', function (e, toggle) {
        if (toggle.removed) {
          $html.removeClass('sidebar-left-opened');
          $html.off('click.close-left-sidebar');
        } // Recalculate Owl Carousel sizes


        $('.owl-carousel').trigger('refresh.owl.carousel');
      });
      return this;
    },
    buildSidebarRight: function buildSidebarRight() {
      this.sidebars.right.isOpened = $html.hasClass('sidebar-right-opened');

      if (this.customScroll) {
        this.sidebars.right.$nano = this.sidebars.right.$el.find('.nano');
        this.sidebars.right.$nano.nanoScroller({
          alwaysVisible: true,
          preventPageScrolling: true
        });
      }

      return this;
    },
    eventsSidebarRight: function eventsSidebarRight() {
      var _self = this;

      var open = function open() {
        if (_self.sidebars.right.isOpened) {
          return close();
        }

        _self.sidebars.right.isOpened = true;
        $html.addClass('sidebar-right-opened');
        $window.trigger('sidebar-right-toggle', {
          added: true,
          removed: false
        });
        $html.on('click.close-right-sidebar', function (e) {
          e.stopPropagation();
          close(e);
        });
      };

      var close = function close(e) {
        if (!!e && !!e.target && ($(e.target).closest('.sidebar-right').get(0) || !$(e.target).closest('html').get(0))) {
          return false;
        }

        $html.removeClass('sidebar-right-opened');
        $html.off('click.close-right-sidebar');
        $window.trigger('sidebar-right-toggle', {
          added: false,
          removed: true
        });
        _self.sidebars.right.isOpened = false;
      };

      var bind = function bind() {
        $('[data-open="sidebar-right"]').on('click', function (e) {
          var $el = $(this);
          e.stopPropagation();
          if ($el.is('a')) e.preventDefault();
          open();
        });
      };

      this.sidebars.right.$el.find('.mobile-close').on('click', function (e) {
        e.preventDefault();
        $html.trigger('click.close-right-sidebar');
      });
      bind();
      return this;
    },
    buildContentMenu: function buildContentMenu() {
      if (!$html.hasClass('fixed')) {
        return false;
      }

      this.sidebars.menu.$nano = this.sidebars.menu.$el.find('.nano');
      this.sidebars.menu.$nano.nanoScroller({
        alwaysVisible: true,
        preventPageScrolling: true
      });
      return this;
    },
    eventsContentMenu: function eventsContentMenu() {
      var _self = this;

      var open = function open() {
        if (_self.sidebars.menu.isOpened) {
          return close();
        }

        _self.sidebars.menu.isOpened = true;
        $html.addClass('inner-menu-opened');
        $window.trigger('inner-menu-toggle', {
          added: true,
          removed: false
        });
        $html.on('click.close-inner-menu', function (e) {
          close(e);
        });
      };

      var close = function close(e) {
        var hasEvent, hasTarget, isCollapseButton, isInsideModal, isInsideInnerMenu, isInsideHTML, $target;
        hasEvent = !!e;
        hasTarget = hasEvent && !!e.target;

        if (hasTarget) {
          $target = $(e.target);
        }

        isCollapseButton = hasTarget && !!$target.closest('.inner-menu-collapse').get(0);
        isInsideModal = hasTarget && !!$target.closest('.mfp-wrap').get(0);
        isInsideInnerMenu = hasTarget && !!$target.closest('.inner-menu').get(0);
        isInsideHTML = hasTarget && !!$target.closest('html').get(0);

        if (!isCollapseButton && (isInsideInnerMenu || !isInsideHTML) || isInsideModal) {
          return false;
        }

        e.stopPropagation();
        $html.removeClass('inner-menu-opened');
        $html.off('click.close-inner-menu');
        $window.trigger('inner-menu-toggle', {
          added: false,
          removed: true
        });
        _self.sidebars.menu.isOpened = false;
      };

      var bind = function bind() {
        $('[data-open="inner-menu"]').on('click', function (e) {
          var $el = $(this);
          e.stopPropagation();
          if ($el.is('a')) e.preventDefault();
          open();
        });
      };

      bind();
      /* Nano Scroll */

      if ($html.hasClass('fixed')) {
        var $nano = this.sidebars.menu.$nano;

        var updateNanoScroll = function updateNanoScroll() {
          if ($.support.transition) {
            $nano.nanoScroller();
            $nano.one('bsTransitionEnd', updateNanoScroll).emulateTransitionEnd(150);
          } else {
            updateNanoScroll();
          }
        };

        this.sidebars.menu.$el.on('click', function () {
          updateNanoScroll();
        });
      }

      return this;
    },
    preventBodyScrollToggle: function preventBodyScrollToggle(shouldPrevent, $el) {
      setTimeout(function () {
        if (shouldPrevent) {
          $body.data('scrollTop', $body.get(0).scrollTop).css({
            position: 'fixed',
            top: $body.get(0).scrollTop * -1
          });
        } else {
          $body.css({
            position: '',
            top: ''
          }).scrollTop($body.data('scrollTop'));
        }
      }, 150);
    }
  }; // expose to scope

  $.extend(theme, {
    Skeleton: Skeleton
  });
}).apply(this, [window.theme, jQuery]); // Tab Navigation

(function ($) {
  'use strict';

  if ($('html.has-tab-navigation').get(0)) {
    var $window = $(window),
        $toggleMenuButton = $('.toggle-menu'),
        $navActive = $('.tab-navigation nav > ul .nav-active'),
        $tabNav = $('.tab-navigation'),
        $tabItem = $('.tab-navigation nav > ul > li a'),
        $contentBody = $('.content-body');
    $tabItem.on('click', function (e) {
      if ($(this).parent().hasClass('dropdown') || $(this).parent().hasClass('dropdown-submenu')) {
        if ($window.width() < 992) {
          if ($(this).parent().hasClass('nav-expanded')) {
            $(this).closest('li').find('> ul').slideUp('fast', function () {
              $(this).css('display', '');
              $(this).closest('li').removeClass('nav-expanded');
            });
          } else {
            if ($(this).parent().hasClass('dropdown')) {
              $tabItem.parent().removeClass('nav-expanded');
            }

            $(this).parent().addClass('expanding');
            $(this).closest('li').find('> ul').slideDown('fast', function () {
              $tabItem.parent().removeClass('expanding');
              $(this).closest('li').addClass('nav-expanded');
              $(this).css('display', '');

              if ($(this).position().top + $(this).height() < $window.scrollTop()) {
                $('html,body').animate({
                  scrollTop: $(this).offset().top - 100
                }, 300);
              }
            });
          }
        } else {
          if (!$(this).parent().hasClass('dropdown')) {
            e.preventDefault();
            return false;
          }

          if ($(this).parent().hasClass('nav-expanded')) {
            $tabItem.parent().removeClass('nav-expanded');
            $contentBody.removeClass('tab-menu-opened');
            return;
          }

          $tabItem.parent().removeClass('nav-expanded');
          $contentBody.addClass('tab-menu-opened');
          $(this).parent().addClass('nav-expanded');
        }
      }
    });
    $window.on('scroll', function () {
      if ($window.width() < 992) {
        var tabNavOffset = $tabNav.position().top + $tabNav.height() + 100,
            windowOffset = $window.scrollTop();

        if (windowOffset > tabNavOffset) {
          $tabNav.removeClass('show');
        }
      }
    });
    $toggleMenuButton.on('click', function () {
      if (!$tabNav.hasClass('show')) {
        $('html,body').animate({
          scrollTop: $tabNav.offset().top - 50
        }, 300);
      }
    });
  }
}).apply(this, [jQuery]);
/* Browser Selector */

(function ($) {
  $.extend({
    browserSelector: function browserSelector() {
      // jQuery.browser.mobile (http://detectmobilebrowser.com/)
      (function (a) {
        (jQuery.browser = jQuery.browser || {}).mobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
      })(navigator.userAgent || navigator.vendor || window.opera); // Touch


      var hasTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

      var u = navigator.userAgent,
          ua = u.toLowerCase(),
          is = function is(t) {
        return ua.indexOf(t) > -1;
      },
          g = 'gecko',
          w = 'webkit',
          s = 'safari',
          o = 'opera',
          h = document.documentElement,
          b = [!/opera|webtv/i.test(ua) && /msie\s(\d)/.test(ua) ? 'ie ie' + parseFloat(navigator.appVersion.split("MSIE")[1]) : is('firefox/2') ? g + ' ff2' : is('firefox/3.5') ? g + ' ff3 ff3_5' : is('firefox/3') ? g + ' ff3' : is('gecko/') ? g : is('opera') ? o + (/version\/(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery1 : /opera(\s|\/)(\d+)/.test(ua) ? ' ' + o + RegExp.jQuery2 : '') : is('konqueror') ? 'konqueror' : is('chrome') ? w + ' chrome' : is('iron') ? w + ' iron' : is('applewebkit/') ? w + ' ' + s + (/version\/(\d+)/.test(ua) ? ' ' + s + RegExp.jQuery1 : '') : is('mozilla/') ? g : '', is('j2me') ? 'mobile' : is('iphone') ? 'iphone' : is('ipod') ? 'ipod' : is('mac') ? 'mac' : is('darwin') ? 'mac' : is('webtv') ? 'webtv' : is('win') ? 'win' : is('freebsd') ? 'freebsd' : is('x11') || is('linux') ? 'linux' : '', 'js'];

      c = b.join(' ');

      if ($.browser.mobile) {
        c += ' mobile';
      }

      if (hasTouch) {
        c += ' touch';
      }

      h.className += ' ' + c; // IE11 Detect

      var isIE11 = !window.ActiveXObject && "ActiveXObject" in window;

      if (isIE11) {
        $('html').removeClass('gecko').addClass('ie ie11');
        return;
      } // Dark and Boxed Compatibility


      if ($('body').hasClass('dark')) {
        $('html').addClass('dark');
      }

      if ($('body').hasClass('boxed')) {
        $('html').addClass('boxed');
      }
    }
  });
  $.browserSelector();
})(jQuery); // Mailbox


(function (theme, $) {
  theme = theme || {};
  var instanceName = '__mailbox';

  var capitalizeString = function capitalizeString(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  var Mailbox = function Mailbox($wrapper) {
    return this.initialize($wrapper);
  };

  Mailbox.prototype = {
    initialize: function initialize($wrapper) {
      if ($wrapper.data(instanceName)) {
        return this;
      }

      this.$wrapper = $wrapper;
      this.setVars().setData().build().events();
      return this;
    },
    setVars: function setVars() {
      this.view = capitalizeString(this.$wrapper.data('mailbox-view') || "");
      return this;
    },
    setData: function setData() {
      this.$wrapper.data(instanceName, this);
      return this;
    },
    build: function build() {
      if (typeof this['build' + this.view] === 'function') {
        this['build' + this.view].call(this);
      }

      return this;
    },
    events: function events() {
      if (typeof this['events' + this.view] === 'function') {
        this['events' + this.view].call(this);
      }

      return this;
    },
    buildFolder: function buildFolder() {
      this.$wrapper.find('.mailbox-email-list .nano').nanoScroller({
        alwaysVisible: true,
        preventPageScrolling: true
      });
    },
    buildEmail: function buildEmail() {
      this.buildComposer();
    },
    buildCompose: function buildCompose() {
      this.buildComposer();
    },
    buildComposer: function buildComposer() {
      this.$wrapper.find('#compose-field').summernote({
        height: 250,
        toolbar: [['style', ['style']], ['font', ['bold', 'italic', 'underline', 'clear']], ['fontname', ['fontname']], ['color', ['color']], ['para', ['ul', 'ol', 'paragraph']], ['height', ['height']], ['table', ['table']], ['insert', ['link', 'picture', 'video']], ['view', ['fullscreen']], ['help', ['help']]]
      });
    },
    eventsCompose: function eventsCompose() {
      var $composer, $contentBody, $html, $innerBody;
      $composer = $('.note-editable');
      $contentBody = $('.content-body');
      $html = $('html');
      $innerBody = $('.inner-body');

      var adjustComposeSize = function adjustComposeSize() {
        var composerHeight, composerTop, contentBodyPaddingBottom, innerBodyHeight, viewportHeight, viewportWidth;
        contentBodyPaddingBottom = parseInt($contentBody.css('paddingBottom'), 10) || 0;
        viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        $composer.css('height', '');

        if (viewportWidth < 767 || $html.hasClass('mobile-device')) {
          composerTop = $composer.offset().top;
          composerHeight = viewportHeight - composerTop;
        } else {
          if ($html.hasClass('fixed')) {
            composerTop = $composer.offset().top;
          } else {
            composerTop = $composer.position().top;
          }

          composerHeight = $innerBody.outerHeight() - composerTop;
        }

        composerHeight -= contentBodyPaddingBottom;
        $composer.css({
          height: composerHeight
        });
      };

      var timer;
      $(window).on('resize orientationchange sidebar-left-toggle mailbox-recalc', function () {
        clearTimeout(timer);
        timer = setTimeout(function () {
          adjustComposeSize();
        }, 100);
      });
      adjustComposeSize();
    }
  }; // expose to scope

  $.extend(theme, {
    Mailbox: Mailbox
  }); // jquery plugin

  $.fn.themeMailbox = function (opts) {
    return this.each(function () {
      var $this = $(this);

      if ($this.data(instanceName)) {
        return $this.data(instanceName);
      } else {
        return new Mailbox($this);
      }
    });
  };
}).apply(this, [window.theme, jQuery]);

/***/ }),

/***/ "./resources/js/vendor/common/common.js":
/*!**********************************************!*\
  !*** ./resources/js/vendor/common/common.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Tooltip and Popover
(function ($) {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
})(jQuery); // Tabs


$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  $(this).parents('.nav-tabs').find('.active').removeClass('active');
  $(this).parents('.nav-pills').find('.active').removeClass('active');
  $(this).addClass('active').parent().addClass('active');
}); // Bootstrap Datepicker

if (typeof $.fn.datepicker != 'undefined') {
  $.fn.bootstrapDP = $.fn.datepicker.noConflict();
}

/***/ }),

/***/ "./resources/js/vendor/jquery-browser-mobile/jquery.browser.mobile.js":
/*!****************************************************************************!*\
  !*** ./resources/js/vendor/jquery-browser-mobile/jquery.browser.mobile.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

(function (a) {
  (jQuery.browser = jQuery.browser || {}).mobile = /(iphone|ipad|ipod|android)/i.test(a) || /(iphone|ipad|ipod|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4));
})(navigator.userAgent || navigator.vendor || window.opera);

/***/ }),

/***/ 1:
/*!*******************************************!*\
  !*** multi ./resources/js/backend/app.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/adilimudassir/my-projects/laravel-starter/resources/js/backend/app.js */"./resources/js/backend/app.js");


/***/ })

},[[1,"/js/manifest","/js/vendor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLWRhdGVwaWNrZXIvZGlzdC9qcy9ib290c3RyYXAtZGF0ZXBpY2tlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvanF1ZXJ5LnBsYWNlaG9sZGVyL2pxdWVyeS5wbGFjZWhvbGRlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvbWFnbmlmaWMtcG9wdXAvZGlzdC9qcXVlcnkubWFnbmlmaWMtcG9wdXAuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25hbm9zY3JvbGxlci9iaW4vamF2YXNjcmlwdHMvanF1ZXJ5Lm5hbm9zY3JvbGxlci5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3Jlc291cmNlcy9qcy9iYWNrZW5kL2FwcC5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvYmFja2VuZC9jdXN0b20uanMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2pzL2JhY2tlbmQvdGhlbWUuaW5pdC5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvYmFja2VuZC90aGVtZS5qcyIsIndlYnBhY2s6Ly8vLi9yZXNvdXJjZXMvanMvdmVuZG9yL2NvbW1vbi9jb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vcmVzb3VyY2VzL2pzL3ZlbmRvci9qcXVlcnktYnJvd3Nlci1tb2JpbGUvanF1ZXJ5LmJyb3dzZXIubW9iaWxlLmpzIl0sIm5hbWVzIjpbInJlcXVpcmUiLCIkIiwiaXNGdW5jdGlvbiIsImZuIiwiZWFjaCIsIiR0aGlzIiwib3B0cyIsInBsdWdpbk9wdGlvbnMiLCJkYXRhIiwidGhlbWVQbHVnaW5BbmltYXRlIiwiYXBwbHkiLCJqUXVlcnkiLCJ0aGVtZVBsdWdpbkNhcm91c2VsIiwidGhlbWVQbHVnaW5DaGFydENpcmN1bGFyIiwiQ29kZU1pcnJvciIsInRoZW1lUGx1Z2luQ29kZU1pcnJvciIsInRoZW1lUGx1Z2luQ29sb3JQaWNrZXIiLCJ0aGVtZVBsdWdpbkRhdGVQaWNrZXIiLCJ0aGVtZSIsIk5hdiIsImluaXRpYWxpemUiLCJ3aW5kb3ciLCJTd2l0Y2giLCJ0aGVtZVBsdWdpbklPUzdTd2l0Y2giLCJ0aGVtZVBsdWdpbkxpZ2h0Ym94IiwiTlByb2dyZXNzIiwiY29uZmlndXJlIiwic2hvd1NwaW5uZXIiLCJlYXNlIiwic3BlZWQiLCJ0aGVtZVBsdWdpbk1hcmtkb3duRWRpdG9yIiwidGhlbWVQbHVnaW5NYXNrZWRJbnB1dCIsInRoZW1lUGx1Z2luTWF4TGVuZ3RoIiwidGhlbWVQbHVnaW5NdWx0aVNlbGVjdCIsInBsYWNlaG9sZGVyIiwicG9wb3ZlciIsInRoZW1lUGx1Z2luUG9ydGxldCIsIlBsdWdpblNjcm9sbFRvVG9wIiwidGhlbWVQbHVnaW5TY3JvbGxhYmxlIiwidGhlbWVQbHVnaW5TZWxlY3QyIiwiZXhwYW5kIiwiY29udGVudCIsImNoaWxkcmVuIiwic2xpZGVEb3duIiwiY3NzIiwicmVtb3ZlQ2xhc3MiLCJjb2xsYXBzZSIsInNsaWRlVXAiLCJhZGRDbGFzcyIsIiR3aWRnZXRzIiwiJHdpZGdldCIsIiR0b2dnbGVyIiwiZmluZCIsIm9uIiwiaGFzQ2xhc3MiLCJ0aGVtZVBsdWdpblNsaWRlciIsInRoZW1lUGx1Z2luU3Bpbm5lciIsInRoZW1lUGx1Z2luU3VtbWVyTm90ZSIsImF1dG9zaXplIiwidGhlbWVQbHVnaW5UZXh0QXJlYUF1dG9TaXplIiwidGhlbWVQbHVnaW5UaW1lUGlja2VyIiwidGhlbWVQbHVnaW5Ub2dnbGUiLCJ0b29sdGlwIiwiY29udGFpbmVyIiwidGhlbWVQbHVnaW5XaWRnZXRUb2RvTGlzdCIsInRoZW1lUGx1Z2luV2lkZ2V0VG9nZ2xlRXhwYW5kIiwidGhlbWVQbHVnaW5Xb3JkUm90YXRvciIsIlNrZWxldG9uIiwidGhlbWVNYWlsYm94IiwiZ2V0T3B0aW9ucyIsIkpTT04iLCJwYXJzZSIsInJlcGxhY2UiLCJlIiwiaW5zdGFuY2VOYW1lIiwiUGx1Z2luQW5pbWF0ZSIsIiRlbCIsImRlZmF1bHRzIiwiYWNjWCIsImFjY1kiLCJkZWxheSIsImR1cmF0aW9uIiwicHJvdG90eXBlIiwic2V0RGF0YSIsInNldE9wdGlvbnMiLCJidWlsZCIsIm9wdGlvbnMiLCJleHRlbmQiLCJ3cmFwcGVyIiwic2VsZiIsImVsVG9wRGlzdGFuY2UiLCJvZmZzZXQiLCJ0b3AiLCJ3aW5kb3dUb3BEaXN0YW5jZSIsInNjcm9sbFRvcCIsImRvY3VtZW50IiwicmVhZHkiLCJ3aWR0aCIsImFwcGVhciIsIm9uZSIsImV2IiwiYXR0ciIsInNldFRpbWVvdXQiLCJ0cmlnZ2VyIiwibWFwIiwiJHdpbmRvdyIsInRvZ2dsZUNsYXNzIiwiJHRhcmdldCIsImNsYXNzTmFtZSIsImV2ZW50TmFtZSIsInByZXZlbnREZWZhdWx0IiwiYWRkZWQiLCJyZW1vdmVkIiwiZGlyZWN0aW9uIiwicGFyZW50IiwibWF0Y2giLCJzaWJsaW5ncyIsImxlbmd0aCIsIiRyb3ciLCJjbG9zZXN0IiwicmVtb3ZlIiwiaW5pdGlhbGl6ZWQiLCJQbHVnaW5DYXJvdXNlbCIsIm5hdlRleHQiLCJvd2xDYXJvdXNlbCIsIlBsdWdpbkNoYXJ0Q2lyY3VsYXIiLCJiYXJDb2xvciIsInRyYWNrQ29sb3IiLCJzY2FsZUNvbG9yIiwic2NhbGVMZW5ndGgiLCJsaW5lQ2FwIiwibGluZVdpZHRoIiwic2l6ZSIsInJvdGF0ZSIsImFuaW1hdGUiLCJlbmFibGVkIiwidmFsdWUiLCJwZXJjZW50RWwiLCJzaG91bGRBbmltYXRlIiwiYnJvd3NlciIsIm1vYmlsZSIsIm9uU3RlcCIsImZyb20iLCJ0byIsImN1cnJlbnRWYWx1ZSIsImh0bWwiLCJwYXJzZUludCIsImVhc3lQaWVDaGFydCIsInVwZGF0ZSIsIkNoYXJ0IiwiUGx1Z2luQ29kZU1pcnJvciIsImxpbmVOdW1iZXJzIiwic3R5bGVBY3RpdmVMaW5lIiwibWF0Y2hCcmFja2V0cyIsImZyb21UZXh0QXJlYSIsImdldCIsIlBsdWdpbkNvbG9yUGlja2VyIiwiY29sb3JwaWNrZXIiLCJkYXRhVGFibGUiLCJvTGFuZ3VhZ2UiLCJzTGVuZ3RoTWVudSIsInNQcm9jZXNzaW5nIiwic1NlYXJjaCIsImZuSW5pdENvbXBsZXRlIiwic2V0dGluZ3MiLCJqc29uIiwiblRhYmxlV3JhcHBlciIsInNlbGVjdDIiLCJtaW5pbXVtUmVzdWx0c0ZvclNlYXJjaCIsIiRzZWFyY2giLCJzZWFyY2hQbGFjZWhvbGRlciIsIlBsdWdpbkRhdGVQaWNrZXIiLCJzZXRWYXJzIiwic2tpbiIsImJvb3RzdHJhcERQIiwicGlja2VyIiwic2Nyb2xsRGVsYXkiLCJzY3JvbGxBbmltYXRpb24iLCIkd3JhcHBlciIsImV2ZW50cyIsIiRodG1sIiwiJGhlYWRlciIsInRodW1iSW5mb1ByZXZpZXciLCJhcHBlbmQiLCJkb2N1bWVudEVsZW1lbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJoYW5kbGVkIiwibGkiLCJsb2NhdGlvbiIsImhyZWYiLCJwYXJlbnRzIiwidGFyZ2V0IiwiaXMiLCJzY3JvbGxUb1RhcmdldCIsIlBsdWdpbklPUzdTd2l0Y2giLCJzd2l0Y2hlciIsImVsIiwidG9nZ2xlIiwiZm9ybVRvT2JqZWN0IiwiYXJyYXlEYXRhIiwib2JqZWN0RGF0YSIsInNlcmlhbGl6ZUFycmF5IiwibmFtZSIsInB1c2giLCJQbHVnaW5MaWdodGJveCIsInRDbG9zZSIsInRMb2FkaW5nIiwiZ2FsbGVyeSIsInRQcmV2IiwidE5leHQiLCJ0Q291bnRlciIsImltYWdlIiwidEVycm9yIiwiYWpheCIsIm1hZ25pZmljUG9wdXAiLCJsb2FkaW5nT3ZlcmxheVRlbXBsYXRlIiwiam9pbiIsIkxvYWRpbmdPdmVybGF5IiwiJG92ZXJsYXkiLCJtYXRjaFByb3BlcnRpZXMiLCJsb2FkZXJDbGFzcyIsImdldExvYWRlckNsYXNzIiwiYmFja2dyb3VuZENvbG9yIiwiJGNhY2hlZE92ZXJsYXkiLCJjbG9uZSIsIl9zZWxmIiwic3RhcnRTaG93aW5nIiwic2hvdyIsImhpZGVPbldpbmRvd0xvYWQiLCJoaWRlIiwibGlzdGVuT24iLCJwb3NpdGlvbiIsInRvTG93ZXJDYXNlIiwiaSIsImwiLCJwcm9wZXJ0aWVzIiwib2JqIiwiaGV4Q29sb3IiLCJyIiwiZyIsImIiLCJ5aXEiLCJjb2xvclRvSGV4IiwiY29sb3IiLCJoZXgiLCJyZ2IiLCJpbmRleE9mIiwidG9TdHJpbmciLCJzbGljZSIsInN1YnN0ciIsImxvYWRpbmdPdmVybGF5IiwiTG9ja1NjcmVlbiIsIiRib2R5IiwibG9ja0hUTUwiLCJ1c2VyaW5mbyIsImdldFVzZXJJbmZvIiwiYnVpbGRUZW1wbGF0ZSIsIiRsb2NrIiwiJHVzZXJQaWN0dXJlIiwiJHVzZXJOYW1lIiwiJHVzZXJFbWFpbCIsImZvcm1FdmVudHMiLCIkZm9ybSIsInBpY3R1cmUiLCJ0ZXh0IiwidXNlcm5hbWUiLCJlbWFpbCIsIm9wZW4iLCJpdGVtcyIsInNyYyIsInR5cGUiLCJtb2RhbCIsIm1haW5DbGFzcyIsImNhbGxiYWNrcyIsImNoYW5nZSIsImNsb3NlIiwiJGluZm8iLCJ0aW1lb3V0cyIsInJvdW5kTnVtYmVyIiwibnVtYmVyIiwicHJlY2lzaW9uIiwiYSIsIk1hdGgiLCJyb3VuZCIsIkdNYXBCdWlsZGVyIiwibWFwU2VsZWN0b3IiLCJtYXJrZXJzIiwibGlzdCIsInJlbW92ZUFsbCIsInByZXZpZXdNb2RhbCIsImdldENvZGVNb2RhbCIsIm1hcE9wdGlvbnMiLCJjZW50ZXIiLCJsYXQiLCJsbmciLCJwYW5Db250cm9sIiwiem9vbSIsIiRtYXBDb250YWluZXIiLCIkcHJldmlld01vZGFsIiwiJGdldENvZGVNb2RhbCIsIm1hcmtlciIsIiRtb2RhbCIsIiRsaXN0IiwiJHJlbW92ZUFsbCIsIlNuYXp6eVRoZW1lcyIsInRoZW1lT3B0cyIsImlkIiwiZ2VvY29kZXIiLCJnb29nbGUiLCJtYXBzIiwiR2VvY29kZXIiLCJldmVudCIsImFkZERvbUxpc3RlbmVyIiwiTGF0TG5nIiwiTWFwIiwidXBkYXRlQ29udHJvbCIsIm1hcEV2ZW50cyIsImZpZWxkIiwidmFsIiwidXBkYXRlTWFwIiwic2F2ZU1hcmtlciIsInJlbW92ZUFsbE1hcmtlcnMiLCJwcmV2aWV3IiwiY29udGVudFdpbmRvdyIsImJvZHkiLCJpbm5lckhUTUwiLCJnZXRDb2RlIiwiYWRkTGlzdGVuZXIiLCJjb29yZHMiLCJnZXRDZW50ZXIiLCJnZXRab29tIiwiZ2V0TWFwVHlwZUlkIiwicHJvcCIsInVwZGF0ZUZuIiwidXBkYXRlTWFwUHJvcGVydHkiLCJjb25zb2xlIiwiaW5mbyIsImxhdGxuZyIsInNldENlbnRlciIsInpvb21sZXZlbCIsImFyZ3VtZW50cyIsInNldFpvb20iLCJtYXB0eXBlY29udHJvbCIsIm1hcFR5cGVDb250cm9sIiwibWFwVHlwZUNvbnRyb2xPcHRpb25zIiwic3R5bGUiLCJNYXBUeXBlQ29udHJvbFN0eWxlIiwidG9VcHBlckNhc2UiLCJ6b29tY29udHJvbCIsInpvb21Db250cm9sIiwiem9vbUNvbnRyb2xPcHRpb25zIiwiWm9vbUNvbnRyb2xTdHlsZSIsInNjYWxlY29udHJvbCIsInNjYWxlQ29udHJvbCIsInN0cmVldHZpZXdjb250cm9sIiwic3RyZWV0Vmlld0NvbnRyb2wiLCJwYW5jb250cm9sIiwib3ZlcnZpZXdjb250cm9sIiwib3ZlcnZpZXdNYXBDb250cm9sIiwib3ZlcnZpZXdNYXBDb250cm9sT3B0aW9ucyIsIm9wZW5lZCIsImRyYWdnYWJsZWNvbnRyb2wiLCJkcmFnZ2FibGUiLCJjbGlja3Rvem9vbWNvbnRyb2wiLCJkaXNhYmxlRG91YmxlQ2xpY2tab29tIiwic2Nyb2xsd2hlZWxjb250cm9sIiwic2Nyb2xsd2hlZWwiLCJtYXB0eXBlIiwibWFwU3R5bGVzIiwibWFwVHlwZSIsImZpbHRlciIsIk1hcFR5cGVJZCIsIm1hcFR5cGVJZCIsImluQXJyYXkiLCJzdHlsZXMiLCJldmFsIiwibWFwdGhlbWUiLCJ1cGRhdGVDb250cm9sVmFsdWUiLCIkY29udHJvbCIsImxldmVsIiwiZWRpdE1hcmtlciIsImN1cnJlbnRNYXJrZXIiLCJ0aXRsZSIsImRlc2NyaXB0aW9uIiwicmVtb3ZlTWFya2VyIiwiX2luc3RhbmNlIiwic2V0TWFwIiwiXyRodG1sIiwic3BsaWNlIiwiX2dlb2NvZGUiLCJzdGF0dXMiLCJnZW9jb2RlIiwiYWRkcmVzcyIsInJlc3BvbnNlIiwiX29uR2VvY29kZVJlc3VsdCIsInJlc3VsdCIsIkdlb2NvZGVyU3RhdHVzIiwiT0siLCJaRVJPX1JFU1VMVFMiLCJnZW9tZXRyeSIsImRlc2MiLCJNYXJrZXIiLCJfYmluZE1hcmtlckNsaWNrIiwiX2FwcGVuZE1hcmtlclRvTGlzdCIsInJlc2V0IiwiX2luZm9XaW5kb3ciLCJJbmZvV2luZG93IiwiaXNPcGVuZWQiLCJjdXN0b21TY3JpcHQiLCJnb29nbGVTY3JpcHQiLCJpZnJhbWUiLCJwcmV2aWV3SHRtbCIsImNyZWF0ZUVsZW1lbnQiLCJnZW5lcmF0ZSIsImFwcGVuZENoaWxkIiwid29yayIsIm91dHB1dCIsIiR0aGVtZUNvbnRyb2wiLCJtIiwib2JqZWN0IiwibG9nIiwiTWFwcyIsInRoZW1lR01hcEJ1aWxkZXIiLCJpbnN0YW5jZSIsImJ1aWxkZXIiLCJQbHVnaW5NYXJrZG93bkVkaXRvciIsImljb25saWJyYXJ5IiwiYnV0dG9ucyIsImljb24iLCJmYSIsIm1hcmtkb3duIiwiUGx1Z2luTWFza2VkSW5wdXQiLCJtYXNrIiwiUGx1Z2luTWF4TGVuZ3RoIiwiYWx3YXlzU2hvdyIsInBsYWNlbWVudCIsIndhcm5pbmdDbGFzcyIsImxpbWl0UmVhY2hlZENsYXNzIiwibWF4bGVuZ3RoIiwiUGx1Z2luTXVsdGlTZWxlY3QiLCJ0ZW1wbGF0ZXMiLCJtdWx0aXNlbGVjdCIsIlBOb3RpZnkiLCJzdHlsaW5nIiwic2hhZG93Iiwic3RhY2siLCJzcGFjaW5nMSIsInNwYWNpbmcyIiwiZm9udGF3ZXNvbWUiLCJub3RpY2UiLCJzdWNjZXNzIiwiZXJyb3IiLCJub3RpY2VfaWNvbiIsImluZm9faWNvbiIsInN1Y2Nlc3NfaWNvbiIsImVycm9yX2ljb24iLCJzdG9yYWdlT3JkZXJLZXkiLCJzdG9yYWdlU3RhdGVLZXkiLCJQbHVnaW5Qb3J0bGV0IiwiY29ubmVjdFdpdGgiLCJoYW5kbGUiLCJvcGFjaXR5IiwiY2FuY2VsIiwiZm9yY2VQbGFjZWhvbGRlclNpemUiLCJmb3JjZUhlbHBlclNpemUiLCJ0b2xlcmFuY2UiLCJoZWxwZXIiLCJyZXZlcnQiLCJvblVwZGF0ZSIsImNyZWF0ZSIsIm9uTG9hZCIsInVpIiwia2V5Iiwic3RvcmUiLCJwb3JsZXRJZCIsInNvcnRhYmxlIiwic2V0IiwicG9ydGxldCIsImNhcmRzIiwiaW5kZXgiLCJwYW5lbElkIiwiYXBwZW5kVG8iLCJzYXZlU3RhdGUiLCJwYW5lbCIsImlzQ29sbGFwc2VkIiwiaXNSZW1vdmVkIiwibG9hZFN0YXRlIiwic3RhdGUiLCJidXR0b25DbGFzcyIsImljb25DbGFzcyIsInZpc2libGVNb2JpbGUiLCJsYWJlbCIsIl9pc1Njcm9sbGluZyIsInNjcm9sbCIsInN0b3AiLCJQbHVnaW5TY3JvbGxhYmxlIiwidXBkYXRlTW9kYWxzIiwidXBkYXRlQm9vdHN0cmFwTW9kYWwiLCJ1cGRhdGVCb29zdHJhcE1vZGFsIiwiQ29uc3RydWN0b3IiLCJlbmZvcmNlRm9jdXMiLCJvcmlnaW5hbEZvY3VzIiwiJHNjcm9sbGFibGUiLCIkZWxlbWVudCIsIm5hbm9TY3JvbGxlciIsImNvbnRlbnRDbGFzcyIsInBhbmVDbGFzcyIsInNsaWRlckNsYXNzIiwiYWx3YXlzVmlzaWJsZSIsInByZXZlbnRQYWdlU2Nyb2xsaW5nIiwiUGx1Z2luU2VsZWN0MiIsIlBsdWdpblNsaWRlciIsIiRvdXRwdXQiLCJzbGlkZSIsIm9uU2xpZGUiLCJzbGlkZXIiLCJ2YWx1ZXMiLCJQbHVnaW5TcGlubmVyIiwic3Bpbm5lciIsIlBsdWdpblN1bW1lck5vdGUiLCJvbmZvY3VzIiwib25ibHVyIiwic3VtbWVybm90ZSIsIlBsdWdpblRleHRBcmVhQXV0b1NpemUiLCJQbHVnaW5UaW1lUGlja2VyIiwiZGlzYWJsZU1vdXNld2hlZWwiLCJpY29ucyIsInVwIiwiZG93biIsInRpbWVwaWNrZXIiLCJQbHVnaW5Ub2dnbGUiLCJpc0FjY29yZGlvbiIsImFkZEljb25zIiwiJGl0ZW1zIiwicHJlcGVuZCIsInByZXZpZXdQYXJDdXJyZW50SGVpZ2h0IiwicHJldmlld1BhckFuaW1hdGVIZWlnaHQiLCJ0b2dnbGVDb250ZW50IiwiY2xpY2siLCJwYXJlbnRTZWN0aW9uIiwicGFyZW50V3JhcHBlciIsInByZXZpZXdQYXIiLCJjbG9zZUVsZW1lbnQiLCJvcmlnaW5hbEV2ZW50IiwiaGVpZ2h0IiwiV2lkZ2V0VG9kb0xpc3QiLCJjaGVjayIsImlucHV0IiwiJGNoZWNrIiwiJHJlbW92ZSIsInNvcnQiLCJwYWdlWSIsIm91dGVySGVpZ2h0IiwiV2lkZ2V0VG9nZ2xlRXhwYW5kIiwiUGx1Z2luV29yZFJvdGF0b3IiLCJpdGVtc1dyYXBwZXIiLCJmaXJzdEl0ZW0iLCJlcSIsImZpcnN0SXRlbUNsb25lIiwiaXRlbUhlaWdodCIsImN1cnJlbnRJdGVtIiwiY3VycmVudFRvcCIsInNldEludGVydmFsIiwiJGxpIiwiZW5zdXJlVmlzaWJsZSIsInNjcm9sbGVyIiwib2Zmc2V0UGFyZW50IiwiYnVpbGRTaWRlYmFyTmF2IiwiYW5jaG9yIiwicHJldiIsIm5leHQiLCJhcnJvd1dpZHRoIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsIm9mZnNldFgiLCJvZmZzZXRXaWR0aCIsIiRhbmNob3IiLCIkcHJldiIsIiRuZXh0IiwiJGV2IiwiY2hyb21lIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImZsYWciLCJpc0FuZHJvaWQiLCJpc0lwYWQiLCJ1cGRhdGluZ05hbm9TY3JvbGwiLCJzaWRlYmFycyIsIm1lbnUiLCJsZWZ0IiwicmlnaHQiLCJjdXN0b21TY3JvbGwiLCJNb2Rlcm5penIiLCJvdmVyZmxvd3Njcm9sbGluZyIsImJ1aWxkU2lkZWJhckxlZnQiLCJidWlsZENvbnRlbnRNZW51IiwiZml4SXBhZCIsImJ1aWxkU2lkZWJhclJpZ2h0IiwiZXZlbnRzU2lkZWJhckxlZnQiLCJldmVudHNTaWRlYmFyUmlnaHQiLCJldmVudHNDb250ZW50TWVudSIsImZpeFNjcm9sbCIsInByZXZlbnRCb2R5U2Nyb2xsVG9nZ2xlIiwiaW5pdGlhbFBvc2l0aW9uIiwiJG5hbm8iLCJsb2NhbFN0b3JhZ2UiLCJzZXRJdGVtIiwiZ2V0SXRlbSIsIm9mZiIsInVwZGF0ZU5hbm9TY3JvbGwiLCJzdXBwb3J0IiwidHJhbnNpdGlvbiIsImVtdWxhdGVUcmFuc2l0aW9uRW5kIiwiaXNUb2dnbGVyIiwiZWxlbWVudCIsImJpbmQiLCJoYXNFdmVudCIsImhhc1RhcmdldCIsImlzQ29sbGFwc2VCdXR0b24iLCJpc0luc2lkZU1vZGFsIiwiaXNJbnNpZGVJbm5lck1lbnUiLCJpc0luc2lkZUhUTUwiLCJzaG91bGRQcmV2ZW50IiwiJHRvZ2dsZU1lbnVCdXR0b24iLCIkbmF2QWN0aXZlIiwiJHRhYk5hdiIsIiR0YWJJdGVtIiwiJGNvbnRlbnRCb2R5IiwidGFiTmF2T2Zmc2V0Iiwid2luZG93T2Zmc2V0IiwiYnJvd3NlclNlbGVjdG9yIiwidmVuZG9yIiwib3BlcmEiLCJoYXNUb3VjaCIsIm1zTWF4VG91Y2hQb2ludHMiLCJ1IiwidWEiLCJ0IiwidyIsInMiLCJvIiwiaCIsInBhcnNlRmxvYXQiLCJhcHBWZXJzaW9uIiwic3BsaXQiLCJSZWdFeHAiLCJqUXVlcnkxIiwialF1ZXJ5MiIsImMiLCJpc0lFMTEiLCJBY3RpdmVYT2JqZWN0IiwiY2FwaXRhbGl6ZVN0cmluZyIsInN0ciIsImNoYXJBdCIsIk1haWxib3giLCJ2aWV3IiwiY2FsbCIsImJ1aWxkRm9sZGVyIiwiYnVpbGRFbWFpbCIsImJ1aWxkQ29tcG9zZXIiLCJidWlsZENvbXBvc2UiLCJ0b29sYmFyIiwiZXZlbnRzQ29tcG9zZSIsIiRjb21wb3NlciIsIiRpbm5lckJvZHkiLCJhZGp1c3RDb21wb3NlU2l6ZSIsImNvbXBvc2VySGVpZ2h0IiwiY29tcG9zZXJUb3AiLCJjb250ZW50Qm9keVBhZGRpbmdCb3R0b20iLCJpbm5lckJvZHlIZWlnaHQiLCJ2aWV3cG9ydEhlaWdodCIsInZpZXdwb3J0V2lkdGgiLCJtYXgiLCJjbGllbnRIZWlnaHQiLCJpbm5lckhlaWdodCIsImNsaWVudFdpZHRoIiwiaW5uZXJXaWR0aCIsInRpbWVyIiwiY2xlYXJUaW1lb3V0IiwiZGF0ZXBpY2tlciIsIm5vQ29uZmxpY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLElBQTBDO0FBQ2xELFFBQVEsaUNBQU8sQ0FBQyx5RUFBUSxDQUFDLG9DQUFFLE9BQU87QUFBQTtBQUFBO0FBQUEsb0dBQUM7QUFDbkMsS0FBSyxNQUFNLEVBSU47QUFDTCxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLE9BQU87QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0Esd0JBQXdCO0FBQ3hCO0FBQ0EsK0JBQStCOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLG9CQUFvQjtBQUNwQjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsNEJBQTRCLGdCQUFnQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsNEJBQTRCLGdCQUFnQjtBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTixLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ04sS0FBSztBQUNMO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSixHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSixHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsMEJBQTBCLHFCQUFxQjtBQUMvQztBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsMEJBQTBCLGlCQUFpQjtBQUMzQztBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsMEJBQTBCLHVDQUF1QztBQUNqRTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBLDBCQUEwQiw2Q0FBNkM7QUFDdkU7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQSwwQkFBMEIsNkJBQTZCO0FBQ3ZEO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsUUFBUTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQSxzQ0FBc0MsMEJBQTBCO0FBQ2hFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOLGdCQUFnQjtBQUNoQixNQUFNO0FBQ04sZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixTQUFTO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7O0FBRUE7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNI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Q0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MsU0FBUztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSwwQkFBMEI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFVBQVU7QUFDckQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSxzQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNERBQTRELEVBQUU7O0FBRTlEOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0EsYUFBYSxJQUFJO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsV0FBVztBQUNYLEdBQUc7QUFDSDtBQUNBLFdBQVc7QUFDWDs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLGtCQUFrQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7OztBQUdGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUksT0FBTztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOzs7QUFHRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7O0FB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TUFBTTs7QUFFTjs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJOztBQUVKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE1BQU07QUFDTjs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTs7QUFFSjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxNQUFNOztBQUVkLE9BQU8sWUFBWTs7QUFFbkIsTUFBTSxNQUFNOzs7QUFHWjtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNO0FBQ047O0FBRUEsSUFB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QUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxXQUFXO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsYUFBYSxPQUFPO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixFQUFFO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixpQkFBaUI7QUFDckMsb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCLHdCQUF3QixPQUFPO0FBQy9CO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7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QUYsQ0FBS29xQixVQUFaLElBQTJCLFdBQS9CLEVBQTRDO0FBQzNDdHFCLEdBQUMsQ0FBQ0UsRUFBRixDQUFLMkssV0FBTCxHQUFtQjdLLENBQUMsQ0FBQ0UsRUFBRixDQUFLb3FCLFVBQUwsQ0FBZ0JDLFVBQWhCLEVBQW5CO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUNoQkQsQ0FBQyxVQUFTL1ksQ0FBVCxFQUFXO0FBQUMsR0FBQzlRLE1BQU0sQ0FBQ2dJLE9BQVAsR0FBZWhJLE1BQU0sQ0FBQ2dJLE9BQVAsSUFBZ0IsRUFBaEMsRUFBb0NDLE1BQXBDLEdBQTJDLDhCQUE4QndiLElBQTlCLENBQW1DM1MsQ0FBbkMsS0FBdUMsb1ZBQW9WMlMsSUFBcFYsQ0FBeVYzUyxDQUF6VixDQUF2QyxJQUFvWSwwa0RBQTBrRDJTLElBQTFrRCxDQUEra0QzUyxDQUFDLENBQUNoQyxNQUFGLENBQVMsQ0FBVCxFQUFXLENBQVgsQ0FBL2tELENBQS9hO0FBQTZnRSxDQUExaEUsRUFBNGhFNFUsU0FBUyxDQUFDQyxTQUFWLElBQXFCRCxTQUFTLENBQUNrRCxNQUEvQixJQUF1Q2xtQixNQUFNLENBQUNtbUIsS0FBMWtFLEUiLCJmaWxlIjoiL2pzL2JhY2tlbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIERhdGVwaWNrZXIgZm9yIEJvb3RzdHJhcCB2MS45LjAgKGh0dHBzOi8vZ2l0aHViLmNvbS91eHNvbHV0aW9ucy9ib290c3RyYXAtZGF0ZXBpY2tlcilcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UgdjIuMCAoaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wKVxuICovXG5cbihmdW5jdGlvbihmYWN0b3J5KXtcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShbJ2pxdWVyeSddLCBmYWN0b3J5KTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmYWN0b3J5KGpRdWVyeSk7XG4gICAgfVxufShmdW5jdGlvbigkLCB1bmRlZmluZWQpe1xuXHRmdW5jdGlvbiBVVENEYXRlKCl7XG5cdFx0cmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KERhdGUsIGFyZ3VtZW50cykpO1xuXHR9XG5cdGZ1bmN0aW9uIFVUQ1RvZGF5KCl7XG5cdFx0dmFyIHRvZGF5ID0gbmV3IERhdGUoKTtcblx0XHRyZXR1cm4gVVRDRGF0ZSh0b2RheS5nZXRGdWxsWWVhcigpLCB0b2RheS5nZXRNb250aCgpLCB0b2RheS5nZXREYXRlKCkpO1xuXHR9XG5cdGZ1bmN0aW9uIGlzVVRDRXF1YWxzKGRhdGUxLCBkYXRlMikge1xuXHRcdHJldHVybiAoXG5cdFx0XHRkYXRlMS5nZXRVVENGdWxsWWVhcigpID09PSBkYXRlMi5nZXRVVENGdWxsWWVhcigpICYmXG5cdFx0XHRkYXRlMS5nZXRVVENNb250aCgpID09PSBkYXRlMi5nZXRVVENNb250aCgpICYmXG5cdFx0XHRkYXRlMS5nZXRVVENEYXRlKCkgPT09IGRhdGUyLmdldFVUQ0RhdGUoKVxuXHRcdCk7XG5cdH1cblx0ZnVuY3Rpb24gYWxpYXMobWV0aG9kLCBkZXByZWNhdGlvbk1zZyl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoZGVwcmVjYXRpb25Nc2cgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHQkLmZuLmRhdGVwaWNrZXIuZGVwcmVjYXRlZChkZXByZWNhdGlvbk1zZyk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzW21ldGhvZF0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHR9O1xuXHR9XG5cdGZ1bmN0aW9uIGlzVmFsaWREYXRlKGQpIHtcblx0XHRyZXR1cm4gZCAmJiAhaXNOYU4oZC5nZXRUaW1lKCkpO1xuXHR9XG5cblx0dmFyIERhdGVBcnJheSA9IChmdW5jdGlvbigpe1xuXHRcdHZhciBleHRyYXMgPSB7XG5cdFx0XHRnZXQ6IGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5zbGljZShpKVswXTtcblx0XHRcdH0sXG5cdFx0XHRjb250YWluczogZnVuY3Rpb24oZCl7XG5cdFx0XHRcdC8vIEFycmF5LmluZGV4T2YgaXMgbm90IGNyb3NzLWJyb3dzZXI7XG5cdFx0XHRcdC8vICQuaW5BcnJheSBkb2Vzbid0IHdvcmsgd2l0aCBEYXRlc1xuXHRcdFx0XHR2YXIgdmFsID0gZCAmJiBkLnZhbHVlT2YoKTtcblx0XHRcdFx0Zm9yICh2YXIgaT0wLCBsPXRoaXMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgICAgIC8vIFVzZSBkYXRlIGFyaXRobWV0aWMgdG8gYWxsb3cgZGF0ZXMgd2l0aCBkaWZmZXJlbnQgdGltZXMgdG8gbWF0Y2hcbiAgICAgICAgICBpZiAoMCA8PSB0aGlzW2ldLnZhbHVlT2YoKSAtIHZhbCAmJiB0aGlzW2ldLnZhbHVlT2YoKSAtIHZhbCA8IDEwMDAqNjAqNjAqMjQpXG5cdFx0XHRcdFx0XHRyZXR1cm4gaTtcblx0XHRcdFx0cmV0dXJuIC0xO1xuXHRcdFx0fSxcblx0XHRcdHJlbW92ZTogZnVuY3Rpb24oaSl7XG5cdFx0XHRcdHRoaXMuc3BsaWNlKGksMSk7XG5cdFx0XHR9LFxuXHRcdFx0cmVwbGFjZTogZnVuY3Rpb24obmV3X2FycmF5KXtcblx0XHRcdFx0aWYgKCFuZXdfYXJyYXkpXG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRpZiAoISQuaXNBcnJheShuZXdfYXJyYXkpKVxuXHRcdFx0XHRcdG5ld19hcnJheSA9IFtuZXdfYXJyYXldO1xuXHRcdFx0XHR0aGlzLmNsZWFyKCk7XG5cdFx0XHRcdHRoaXMucHVzaC5hcHBseSh0aGlzLCBuZXdfYXJyYXkpO1xuXHRcdFx0fSxcblx0XHRcdGNsZWFyOiBmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGlzLmxlbmd0aCA9IDA7XG5cdFx0XHR9LFxuXHRcdFx0Y29weTogZnVuY3Rpb24oKXtcblx0XHRcdFx0dmFyIGEgPSBuZXcgRGF0ZUFycmF5KCk7XG5cdFx0XHRcdGEucmVwbGFjZSh0aGlzKTtcblx0XHRcdFx0cmV0dXJuIGE7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGEgPSBbXTtcblx0XHRcdGEucHVzaC5hcHBseShhLCBhcmd1bWVudHMpO1xuXHRcdFx0JC5leHRlbmQoYSwgZXh0cmFzKTtcblx0XHRcdHJldHVybiBhO1xuXHRcdH07XG5cdH0pKCk7XG5cblxuXHQvLyBQaWNrZXIgb2JqZWN0XG5cblx0dmFyIERhdGVwaWNrZXIgPSBmdW5jdGlvbihlbGVtZW50LCBvcHRpb25zKXtcblx0XHQkLmRhdGEoZWxlbWVudCwgJ2RhdGVwaWNrZXInLCB0aGlzKTtcblxuXHRcdHRoaXMuX2V2ZW50cyA9IFtdO1xuXHRcdHRoaXMuX3NlY29uZGFyeUV2ZW50cyA9IFtdO1xuXG5cdFx0dGhpcy5fcHJvY2Vzc19vcHRpb25zKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5kYXRlcyA9IG5ldyBEYXRlQXJyYXkoKTtcblx0XHR0aGlzLnZpZXdEYXRlID0gdGhpcy5vLmRlZmF1bHRWaWV3RGF0ZTtcblx0XHR0aGlzLmZvY3VzRGF0ZSA9IG51bGw7XG5cblx0XHR0aGlzLmVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXHRcdHRoaXMuaXNJbnB1dCA9IHRoaXMuZWxlbWVudC5pcygnaW5wdXQnKTtcblx0XHR0aGlzLmlucHV0RmllbGQgPSB0aGlzLmlzSW5wdXQgPyB0aGlzLmVsZW1lbnQgOiB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQnKTtcblx0XHR0aGlzLmNvbXBvbmVudCA9IHRoaXMuZWxlbWVudC5oYXNDbGFzcygnZGF0ZScpID8gdGhpcy5lbGVtZW50LmZpbmQoJy5hZGQtb24sIC5pbnB1dC1ncm91cC1hZGRvbiwgLmlucHV0LWdyb3VwLWFwcGVuZCwgLmlucHV0LWdyb3VwLXByZXBlbmQsIC5idG4nKSA6IGZhbHNlO1xuXHRcdGlmICh0aGlzLmNvbXBvbmVudCAmJiB0aGlzLmNvbXBvbmVudC5sZW5ndGggPT09IDApXG5cdFx0XHR0aGlzLmNvbXBvbmVudCA9IGZhbHNlO1xuXHRcdHRoaXMuaXNJbmxpbmUgPSAhdGhpcy5jb21wb25lbnQgJiYgdGhpcy5lbGVtZW50LmlzKCdkaXYnKTtcblxuXHRcdHRoaXMucGlja2VyID0gJChEUEdsb2JhbC50ZW1wbGF0ZSk7XG5cblx0XHQvLyBDaGVja2luZyB0ZW1wbGF0ZXMgYW5kIGluc2VydGluZ1xuXHRcdGlmICh0aGlzLl9jaGVja190ZW1wbGF0ZSh0aGlzLm8udGVtcGxhdGVzLmxlZnRBcnJvdykpIHtcblx0XHRcdHRoaXMucGlja2VyLmZpbmQoJy5wcmV2JykuaHRtbCh0aGlzLm8udGVtcGxhdGVzLmxlZnRBcnJvdyk7XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2NoZWNrX3RlbXBsYXRlKHRoaXMuby50ZW1wbGF0ZXMucmlnaHRBcnJvdykpIHtcblx0XHRcdHRoaXMucGlja2VyLmZpbmQoJy5uZXh0JykuaHRtbCh0aGlzLm8udGVtcGxhdGVzLnJpZ2h0QXJyb3cpO1xuXHRcdH1cblxuXHRcdHRoaXMuX2J1aWxkRXZlbnRzKCk7XG5cdFx0dGhpcy5fYXR0YWNoRXZlbnRzKCk7XG5cblx0XHRpZiAodGhpcy5pc0lubGluZSl7XG5cdFx0XHR0aGlzLnBpY2tlci5hZGRDbGFzcygnZGF0ZXBpY2tlci1pbmxpbmUnKS5hcHBlbmRUbyh0aGlzLmVsZW1lbnQpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMucGlja2VyLmFkZENsYXNzKCdkYXRlcGlja2VyLWRyb3Bkb3duIGRyb3Bkb3duLW1lbnUnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5vLnJ0bCl7XG5cdFx0XHR0aGlzLnBpY2tlci5hZGRDbGFzcygnZGF0ZXBpY2tlci1ydGwnKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5vLmNhbGVuZGFyV2Vla3MpIHtcblx0XHRcdHRoaXMucGlja2VyLmZpbmQoJy5kYXRlcGlja2VyLWRheXMgLmRhdGVwaWNrZXItc3dpdGNoLCB0aGVhZCAuZGF0ZXBpY2tlci10aXRsZSwgdGZvb3QgLnRvZGF5LCB0Zm9vdCAuY2xlYXInKVxuXHRcdFx0XHQuYXR0cignY29sc3BhbicsIGZ1bmN0aW9uKGksIHZhbCl7XG5cdFx0XHRcdFx0cmV0dXJuIE51bWJlcih2YWwpICsgMTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5fcHJvY2Vzc19vcHRpb25zKHtcblx0XHRcdHN0YXJ0RGF0ZTogdGhpcy5fby5zdGFydERhdGUsXG5cdFx0XHRlbmREYXRlOiB0aGlzLl9vLmVuZERhdGUsXG5cdFx0XHRkYXlzT2ZXZWVrRGlzYWJsZWQ6IHRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQsXG5cdFx0XHRkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQ6IHRoaXMuby5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQsXG5cdFx0XHRkYXRlc0Rpc2FibGVkOiB0aGlzLm8uZGF0ZXNEaXNhYmxlZFxuXHRcdH0pO1xuXG5cdFx0dGhpcy5fYWxsb3dfdXBkYXRlID0gZmFsc2U7XG5cdFx0dGhpcy5zZXRWaWV3TW9kZSh0aGlzLm8uc3RhcnRWaWV3KTtcblx0XHR0aGlzLl9hbGxvd191cGRhdGUgPSB0cnVlO1xuXG5cdFx0dGhpcy5maWxsRG93KCk7XG5cdFx0dGhpcy5maWxsTW9udGhzKCk7XG5cblx0XHR0aGlzLnVwZGF0ZSgpO1xuXG5cdFx0aWYgKHRoaXMuaXNJbmxpbmUpe1xuXHRcdFx0dGhpcy5zaG93KCk7XG5cdFx0fVxuXHR9O1xuXG5cdERhdGVwaWNrZXIucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBEYXRlcGlja2VyLFxuXG5cdFx0X3Jlc29sdmVWaWV3TmFtZTogZnVuY3Rpb24odmlldyl7XG5cdFx0XHQkLmVhY2goRFBHbG9iYWwudmlld01vZGVzLCBmdW5jdGlvbihpLCB2aWV3TW9kZSl7XG5cdFx0XHRcdGlmICh2aWV3ID09PSBpIHx8ICQuaW5BcnJheSh2aWV3LCB2aWV3TW9kZS5uYW1lcykgIT09IC0xKXtcblx0XHRcdFx0XHR2aWV3ID0gaTtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdmlldztcblx0XHR9LFxuXG5cdFx0X3Jlc29sdmVEYXlzT2ZXZWVrOiBmdW5jdGlvbihkYXlzT2ZXZWVrKXtcblx0XHRcdGlmICghJC5pc0FycmF5KGRheXNPZldlZWspKVxuXHRcdFx0XHRkYXlzT2ZXZWVrID0gZGF5c09mV2Vlay5zcGxpdCgvWyxcXHNdKi8pO1xuXHRcdFx0cmV0dXJuICQubWFwKGRheXNPZldlZWssIE51bWJlcik7XG5cdFx0fSxcblxuXHRcdF9jaGVja190ZW1wbGF0ZTogZnVuY3Rpb24odG1wKXtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdC8vIElmIGVtcHR5XG5cdFx0XHRcdGlmICh0bXAgPT09IHVuZGVmaW5lZCB8fCB0bXAgPT09IFwiXCIpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gSWYgbm8gaHRtbCwgZXZlcnl0aGluZyBva1xuXHRcdFx0XHRpZiAoKHRtcC5tYXRjaCgvWzw+XS9nKSB8fCBbXSkubGVuZ3RoIDw9IDApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBDaGVja2luZyBpZiBodG1sIGlzIGZpbmVcblx0XHRcdFx0dmFyIGpEb20gPSAkKHRtcCk7XG5cdFx0XHRcdHJldHVybiBqRG9tLmxlbmd0aCA+IDA7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZXgpIHtcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdH0sXG5cblx0XHRfcHJvY2Vzc19vcHRpb25zOiBmdW5jdGlvbihvcHRzKXtcblx0XHRcdC8vIFN0b3JlIHJhdyBvcHRpb25zIGZvciByZWZlcmVuY2Vcblx0XHRcdHRoaXMuX28gPSAkLmV4dGVuZCh7fSwgdGhpcy5fbywgb3B0cyk7XG5cdFx0XHQvLyBQcm9jZXNzZWQgb3B0aW9uc1xuXHRcdFx0dmFyIG8gPSB0aGlzLm8gPSAkLmV4dGVuZCh7fSwgdGhpcy5fbyk7XG5cblx0XHRcdC8vIENoZWNrIGlmIFwiZGUtREVcIiBzdHlsZSBkYXRlIGlzIGF2YWlsYWJsZSwgaWYgbm90IGxhbmd1YWdlIHNob3VsZFxuXHRcdFx0Ly8gZmFsbGJhY2sgdG8gMiBsZXR0ZXIgY29kZSBlZyBcImRlXCJcblx0XHRcdHZhciBsYW5nID0gby5sYW5ndWFnZTtcblx0XHRcdGlmICghZGF0ZXNbbGFuZ10pe1xuXHRcdFx0XHRsYW5nID0gbGFuZy5zcGxpdCgnLScpWzBdO1xuXHRcdFx0XHRpZiAoIWRhdGVzW2xhbmddKVxuXHRcdFx0XHRcdGxhbmcgPSBkZWZhdWx0cy5sYW5ndWFnZTtcblx0XHRcdH1cblx0XHRcdG8ubGFuZ3VhZ2UgPSBsYW5nO1xuXG5cdFx0XHQvLyBSZXRyaWV2ZSB2aWV3IGluZGV4IGZyb20gYW55IGFsaWFzZXNcblx0XHRcdG8uc3RhcnRWaWV3ID0gdGhpcy5fcmVzb2x2ZVZpZXdOYW1lKG8uc3RhcnRWaWV3KTtcblx0XHRcdG8ubWluVmlld01vZGUgPSB0aGlzLl9yZXNvbHZlVmlld05hbWUoby5taW5WaWV3TW9kZSk7XG5cdFx0XHRvLm1heFZpZXdNb2RlID0gdGhpcy5fcmVzb2x2ZVZpZXdOYW1lKG8ubWF4Vmlld01vZGUpO1xuXG5cdFx0XHQvLyBDaGVjayB2aWV3IGlzIGJldHdlZW4gbWluIGFuZCBtYXhcblx0XHRcdG8uc3RhcnRWaWV3ID0gTWF0aC5tYXgodGhpcy5vLm1pblZpZXdNb2RlLCBNYXRoLm1pbih0aGlzLm8ubWF4Vmlld01vZGUsIG8uc3RhcnRWaWV3KSk7XG5cblx0XHRcdC8vIHRydWUsIGZhbHNlLCBvciBOdW1iZXIgPiAwXG5cdFx0XHRpZiAoby5tdWx0aWRhdGUgIT09IHRydWUpe1xuXHRcdFx0XHRvLm11bHRpZGF0ZSA9IE51bWJlcihvLm11bHRpZGF0ZSkgfHwgZmFsc2U7XG5cdFx0XHRcdGlmIChvLm11bHRpZGF0ZSAhPT0gZmFsc2UpXG5cdFx0XHRcdFx0by5tdWx0aWRhdGUgPSBNYXRoLm1heCgwLCBvLm11bHRpZGF0ZSk7XG5cdFx0XHR9XG5cdFx0XHRvLm11bHRpZGF0ZVNlcGFyYXRvciA9IFN0cmluZyhvLm11bHRpZGF0ZVNlcGFyYXRvcik7XG5cblx0XHRcdG8ud2Vla1N0YXJ0ICU9IDc7XG5cdFx0XHRvLndlZWtFbmQgPSAoby53ZWVrU3RhcnQgKyA2KSAlIDc7XG5cblx0XHRcdHZhciBmb3JtYXQgPSBEUEdsb2JhbC5wYXJzZUZvcm1hdChvLmZvcm1hdCk7XG5cdFx0XHRpZiAoby5zdGFydERhdGUgIT09IC1JbmZpbml0eSl7XG5cdFx0XHRcdGlmICghIW8uc3RhcnREYXRlKXtcblx0XHRcdFx0XHRpZiAoby5zdGFydERhdGUgaW5zdGFuY2VvZiBEYXRlKVxuXHRcdFx0XHRcdFx0by5zdGFydERhdGUgPSB0aGlzLl9sb2NhbF90b191dGModGhpcy5femVyb190aW1lKG8uc3RhcnREYXRlKSk7XG5cdFx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdFx0by5zdGFydERhdGUgPSBEUEdsb2JhbC5wYXJzZURhdGUoby5zdGFydERhdGUsIGZvcm1hdCwgby5sYW5ndWFnZSwgby5hc3N1bWVOZWFyYnlZZWFyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRvLnN0YXJ0RGF0ZSA9IC1JbmZpbml0eTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKG8uZW5kRGF0ZSAhPT0gSW5maW5pdHkpe1xuXHRcdFx0XHRpZiAoISFvLmVuZERhdGUpe1xuXHRcdFx0XHRcdGlmIChvLmVuZERhdGUgaW5zdGFuY2VvZiBEYXRlKVxuXHRcdFx0XHRcdFx0by5lbmREYXRlID0gdGhpcy5fbG9jYWxfdG9fdXRjKHRoaXMuX3plcm9fdGltZShvLmVuZERhdGUpKTtcblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRvLmVuZERhdGUgPSBEUEdsb2JhbC5wYXJzZURhdGUoby5lbmREYXRlLCBmb3JtYXQsIG8ubGFuZ3VhZ2UsIG8uYXNzdW1lTmVhcmJ5WWVhcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0by5lbmREYXRlID0gSW5maW5pdHk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0by5kYXlzT2ZXZWVrRGlzYWJsZWQgPSB0aGlzLl9yZXNvbHZlRGF5c09mV2VlayhvLmRheXNPZldlZWtEaXNhYmxlZHx8W10pO1xuXHRcdFx0by5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQgPSB0aGlzLl9yZXNvbHZlRGF5c09mV2VlayhvLmRheXNPZldlZWtIaWdobGlnaHRlZHx8W10pO1xuXG5cdFx0XHRvLmRhdGVzRGlzYWJsZWQgPSBvLmRhdGVzRGlzYWJsZWR8fFtdO1xuXHRcdFx0aWYgKCEkLmlzQXJyYXkoby5kYXRlc0Rpc2FibGVkKSkge1xuXHRcdFx0XHRvLmRhdGVzRGlzYWJsZWQgPSBvLmRhdGVzRGlzYWJsZWQuc3BsaXQoJywnKTtcblx0XHRcdH1cblx0XHRcdG8uZGF0ZXNEaXNhYmxlZCA9ICQubWFwKG8uZGF0ZXNEaXNhYmxlZCwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdHJldHVybiBEUEdsb2JhbC5wYXJzZURhdGUoZCwgZm9ybWF0LCBvLmxhbmd1YWdlLCBvLmFzc3VtZU5lYXJieVllYXIpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBwbGMgPSBTdHJpbmcoby5vcmllbnRhdGlvbikudG9Mb3dlckNhc2UoKS5zcGxpdCgvXFxzKy9nKSxcblx0XHRcdFx0X3BsYyA9IG8ub3JpZW50YXRpb24udG9Mb3dlckNhc2UoKTtcblx0XHRcdHBsYyA9ICQuZ3JlcChwbGMsIGZ1bmN0aW9uKHdvcmQpe1xuXHRcdFx0XHRyZXR1cm4gL15hdXRvfGxlZnR8cmlnaHR8dG9wfGJvdHRvbSQvLnRlc3Qod29yZCk7XG5cdFx0XHR9KTtcblx0XHRcdG8ub3JpZW50YXRpb24gPSB7eDogJ2F1dG8nLCB5OiAnYXV0byd9O1xuXHRcdFx0aWYgKCFfcGxjIHx8IF9wbGMgPT09ICdhdXRvJylcblx0XHRcdFx0OyAvLyBubyBhY3Rpb25cblx0XHRcdGVsc2UgaWYgKHBsYy5sZW5ndGggPT09IDEpe1xuXHRcdFx0XHRzd2l0Y2ggKHBsY1swXSl7XG5cdFx0XHRcdFx0Y2FzZSAndG9wJzpcblx0XHRcdFx0XHRjYXNlICdib3R0b20nOlxuXHRcdFx0XHRcdFx0by5vcmllbnRhdGlvbi55ID0gcGxjWzBdO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Y2FzZSAnbGVmdCc6XG5cdFx0XHRcdFx0Y2FzZSAncmlnaHQnOlxuXHRcdFx0XHRcdFx0by5vcmllbnRhdGlvbi54ID0gcGxjWzBdO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRfcGxjID0gJC5ncmVwKHBsYywgZnVuY3Rpb24od29yZCl7XG5cdFx0XHRcdFx0cmV0dXJuIC9ebGVmdHxyaWdodCQvLnRlc3Qod29yZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRvLm9yaWVudGF0aW9uLnggPSBfcGxjWzBdIHx8ICdhdXRvJztcblxuXHRcdFx0XHRfcGxjID0gJC5ncmVwKHBsYywgZnVuY3Rpb24od29yZCl7XG5cdFx0XHRcdFx0cmV0dXJuIC9edG9wfGJvdHRvbSQvLnRlc3Qod29yZCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRvLm9yaWVudGF0aW9uLnkgPSBfcGxjWzBdIHx8ICdhdXRvJztcblx0XHRcdH1cblx0XHRcdGlmIChvLmRlZmF1bHRWaWV3RGF0ZSBpbnN0YW5jZW9mIERhdGUgfHwgdHlwZW9mIG8uZGVmYXVsdFZpZXdEYXRlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRvLmRlZmF1bHRWaWV3RGF0ZSA9IERQR2xvYmFsLnBhcnNlRGF0ZShvLmRlZmF1bHRWaWV3RGF0ZSwgZm9ybWF0LCBvLmxhbmd1YWdlLCBvLmFzc3VtZU5lYXJieVllYXIpO1xuXHRcdFx0fSBlbHNlIGlmIChvLmRlZmF1bHRWaWV3RGF0ZSkge1xuXHRcdFx0XHR2YXIgeWVhciA9IG8uZGVmYXVsdFZpZXdEYXRlLnllYXIgfHwgbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpO1xuXHRcdFx0XHR2YXIgbW9udGggPSBvLmRlZmF1bHRWaWV3RGF0ZS5tb250aCB8fCAwO1xuXHRcdFx0XHR2YXIgZGF5ID0gby5kZWZhdWx0Vmlld0RhdGUuZGF5IHx8IDE7XG5cdFx0XHRcdG8uZGVmYXVsdFZpZXdEYXRlID0gVVRDRGF0ZSh5ZWFyLCBtb250aCwgZGF5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG8uZGVmYXVsdFZpZXdEYXRlID0gVVRDVG9kYXkoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdF9hcHBseUV2ZW50czogZnVuY3Rpb24oZXZzKXtcblx0XHRcdGZvciAodmFyIGk9MCwgZWwsIGNoLCBldjsgaSA8IGV2cy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdGVsID0gZXZzW2ldWzBdO1xuXHRcdFx0XHRpZiAoZXZzW2ldLmxlbmd0aCA9PT0gMil7XG5cdFx0XHRcdFx0Y2ggPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0ZXYgPSBldnNbaV1bMV07XG5cdFx0XHRcdH0gZWxzZSBpZiAoZXZzW2ldLmxlbmd0aCA9PT0gMyl7XG5cdFx0XHRcdFx0Y2ggPSBldnNbaV1bMV07XG5cdFx0XHRcdFx0ZXYgPSBldnNbaV1bMl07XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWwub24oZXYsIGNoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdF91bmFwcGx5RXZlbnRzOiBmdW5jdGlvbihldnMpe1xuXHRcdFx0Zm9yICh2YXIgaT0wLCBlbCwgZXYsIGNoOyBpIDwgZXZzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0ZWwgPSBldnNbaV1bMF07XG5cdFx0XHRcdGlmIChldnNbaV0ubGVuZ3RoID09PSAyKXtcblx0XHRcdFx0XHRjaCA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRldiA9IGV2c1tpXVsxXTtcblx0XHRcdFx0fSBlbHNlIGlmIChldnNbaV0ubGVuZ3RoID09PSAzKXtcblx0XHRcdFx0XHRjaCA9IGV2c1tpXVsxXTtcblx0XHRcdFx0XHRldiA9IGV2c1tpXVsyXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbC5vZmYoZXYsIGNoKTtcblx0XHRcdH1cblx0XHR9LFxuXHRcdF9idWlsZEV2ZW50czogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBldmVudHMgPSB7XG4gICAgICAgICAgICAgICAga2V5dXA6ICQucHJveHkoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkLmluQXJyYXkoZS5rZXlDb2RlLCBbMjcsIDM3LCAzOSwgMzgsIDQwLCAzMiwgMTMsIDldKSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIH0sIHRoaXMpLFxuICAgICAgICAgICAgICAgIGtleWRvd246ICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKSxcbiAgICAgICAgICAgICAgICBwYXN0ZTogJC5wcm94eSh0aGlzLnBhc3RlLCB0aGlzKVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuby5zaG93T25Gb2N1cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGV2ZW50cy5mb2N1cyA9ICQucHJveHkodGhpcy5zaG93LCB0aGlzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuaXNJbnB1dCkgeyAvLyBzaW5nbGUgaW5wdXRcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIFt0aGlzLmVsZW1lbnQsIGV2ZW50c11cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29tcG9uZW50OiBpbnB1dCArIGJ1dHRvblxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5jb21wb25lbnQgJiYgdGhpcy5pbnB1dEZpZWxkLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IFtcbiAgICAgICAgICAgICAgICAgICAgLy8gRm9yIGNvbXBvbmVudHMgdGhhdCBhcmUgbm90IHJlYWRvbmx5LCBhbGxvdyBrZXlib2FyZCBuYXZcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuaW5wdXRGaWVsZCwgZXZlbnRzXSxcbiAgICAgICAgICAgICAgICAgICAgW3RoaXMuY29tcG9uZW50LCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGljazogJC5wcm94eSh0aGlzLnNob3csIHRoaXMpXG4gICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgIH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9ldmVudHMgPSBbXG5cdFx0XHRcdFx0W3RoaXMuZWxlbWVudCwge1xuXHRcdFx0XHRcdFx0Y2xpY2s6ICQucHJveHkodGhpcy5zaG93LCB0aGlzKSxcblx0XHRcdFx0XHRcdGtleWRvd246ICQucHJveHkodGhpcy5rZXlkb3duLCB0aGlzKVxuXHRcdFx0XHRcdH1dXG5cdFx0XHRcdF07XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl9ldmVudHMucHVzaChcblx0XHRcdFx0Ly8gQ29tcG9uZW50OiBsaXN0ZW4gZm9yIGJsdXIgb24gZWxlbWVudCBkZXNjZW5kYW50c1xuXHRcdFx0XHRbdGhpcy5lbGVtZW50LCAnKicsIHtcblx0XHRcdFx0XHRibHVyOiAkLnByb3h5KGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdFx0dGhpcy5fZm9jdXNlZF9mcm9tID0gZS50YXJnZXQ7XG5cdFx0XHRcdFx0fSwgdGhpcylcblx0XHRcdFx0fV0sXG5cdFx0XHRcdC8vIElucHV0OiBsaXN0ZW4gZm9yIGJsdXIgb24gZWxlbWVudFxuXHRcdFx0XHRbdGhpcy5lbGVtZW50LCB7XG5cdFx0XHRcdFx0Ymx1cjogJC5wcm94eShmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRcdHRoaXMuX2ZvY3VzZWRfZnJvbSA9IGUudGFyZ2V0O1xuXHRcdFx0XHRcdH0sIHRoaXMpXG5cdFx0XHRcdH1dXG5cdFx0XHQpO1xuXG5cdFx0XHRpZiAodGhpcy5vLmltbWVkaWF0ZVVwZGF0ZXMpIHtcblx0XHRcdFx0Ly8gVHJpZ2dlciBpbnB1dCB1cGRhdGVzIGltbWVkaWF0ZWx5IG9uIGNoYW5nZWQgeWVhci9tb250aFxuXHRcdFx0XHR0aGlzLl9ldmVudHMucHVzaChbdGhpcy5lbGVtZW50LCB7XG5cdFx0XHRcdFx0J2NoYW5nZVllYXIgY2hhbmdlTW9udGgnOiAkLnByb3h5KGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdFx0dGhpcy51cGRhdGUoZS5kYXRlKTtcblx0XHRcdFx0XHR9LCB0aGlzKVxuXHRcdFx0XHR9XSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX3NlY29uZGFyeUV2ZW50cyA9IFtcblx0XHRcdFx0W3RoaXMucGlja2VyLCB7XG5cdFx0XHRcdFx0Y2xpY2s6ICQucHJveHkodGhpcy5jbGljaywgdGhpcylcblx0XHRcdFx0fV0sXG5cdFx0XHRcdFt0aGlzLnBpY2tlciwgJy5wcmV2LCAubmV4dCcsIHtcblx0XHRcdFx0XHRjbGljazogJC5wcm94eSh0aGlzLm5hdkFycm93c0NsaWNrLCB0aGlzKVxuXHRcdFx0XHR9XSxcblx0XHRcdFx0W3RoaXMucGlja2VyLCAnLmRheTpub3QoLmRpc2FibGVkKScsIHtcblx0XHRcdFx0XHRjbGljazogJC5wcm94eSh0aGlzLmRheUNlbGxDbGljaywgdGhpcylcblx0XHRcdFx0fV0sXG5cdFx0XHRcdFskKHdpbmRvdyksIHtcblx0XHRcdFx0XHRyZXNpemU6ICQucHJveHkodGhpcy5wbGFjZSwgdGhpcylcblx0XHRcdFx0fV0sXG5cdFx0XHRcdFskKGRvY3VtZW50KSwge1xuXHRcdFx0XHRcdCdtb3VzZWRvd24gdG91Y2hzdGFydCc6ICQucHJveHkoZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0XHQvLyBDbGlja2VkIG91dHNpZGUgdGhlIGRhdGVwaWNrZXIsIGhpZGUgaXRcblx0XHRcdFx0XHRcdGlmICghKFxuXHRcdFx0XHRcdFx0XHR0aGlzLmVsZW1lbnQuaXMoZS50YXJnZXQpIHx8XG5cdFx0XHRcdFx0XHRcdHRoaXMuZWxlbWVudC5maW5kKGUudGFyZ2V0KS5sZW5ndGggfHxcblx0XHRcdFx0XHRcdFx0dGhpcy5waWNrZXIuaXMoZS50YXJnZXQpIHx8XG5cdFx0XHRcdFx0XHRcdHRoaXMucGlja2VyLmZpbmQoZS50YXJnZXQpLmxlbmd0aCB8fFxuXHRcdFx0XHRcdFx0XHR0aGlzLmlzSW5saW5lXG5cdFx0XHRcdFx0XHQpKXtcblx0XHRcdFx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSwgdGhpcylcblx0XHRcdFx0fV1cblx0XHRcdF07XG5cdFx0fSxcblx0XHRfYXR0YWNoRXZlbnRzOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5fZGV0YWNoRXZlbnRzKCk7XG5cdFx0XHR0aGlzLl9hcHBseUV2ZW50cyh0aGlzLl9ldmVudHMpO1xuXHRcdH0sXG5cdFx0X2RldGFjaEV2ZW50czogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuX3VuYXBwbHlFdmVudHModGhpcy5fZXZlbnRzKTtcblx0XHR9LFxuXHRcdF9hdHRhY2hTZWNvbmRhcnlFdmVudHM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLl9kZXRhY2hTZWNvbmRhcnlFdmVudHMoKTtcblx0XHRcdHRoaXMuX2FwcGx5RXZlbnRzKHRoaXMuX3NlY29uZGFyeUV2ZW50cyk7XG5cdFx0fSxcblx0XHRfZGV0YWNoU2Vjb25kYXJ5RXZlbnRzOiBmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5fdW5hcHBseUV2ZW50cyh0aGlzLl9zZWNvbmRhcnlFdmVudHMpO1xuXHRcdH0sXG5cdFx0X3RyaWdnZXI6IGZ1bmN0aW9uKGV2ZW50LCBhbHRkYXRlKXtcblx0XHRcdHZhciBkYXRlID0gYWx0ZGF0ZSB8fCB0aGlzLmRhdGVzLmdldCgtMSksXG5cdFx0XHRcdGxvY2FsX2RhdGUgPSB0aGlzLl91dGNfdG9fbG9jYWwoZGF0ZSk7XG5cblx0XHRcdHRoaXMuZWxlbWVudC50cmlnZ2VyKHtcblx0XHRcdFx0dHlwZTogZXZlbnQsXG5cdFx0XHRcdGRhdGU6IGxvY2FsX2RhdGUsXG5cdFx0XHRcdHZpZXdNb2RlOiB0aGlzLnZpZXdNb2RlLFxuXHRcdFx0XHRkYXRlczogJC5tYXAodGhpcy5kYXRlcywgdGhpcy5fdXRjX3RvX2xvY2FsKSxcblx0XHRcdFx0Zm9ybWF0OiAkLnByb3h5KGZ1bmN0aW9uKGl4LCBmb3JtYXQpe1xuXHRcdFx0XHRcdGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKXtcblx0XHRcdFx0XHRcdGl4ID0gdGhpcy5kYXRlcy5sZW5ndGggLSAxO1xuXHRcdFx0XHRcdFx0Zm9ybWF0ID0gdGhpcy5vLmZvcm1hdDtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBpeCA9PT0gJ3N0cmluZycpe1xuXHRcdFx0XHRcdFx0Zm9ybWF0ID0gaXg7XG5cdFx0XHRcdFx0XHRpeCA9IHRoaXMuZGF0ZXMubGVuZ3RoIC0gMTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Zm9ybWF0ID0gZm9ybWF0IHx8IHRoaXMuby5mb3JtYXQ7XG5cdFx0XHRcdFx0dmFyIGRhdGUgPSB0aGlzLmRhdGVzLmdldChpeCk7XG5cdFx0XHRcdFx0cmV0dXJuIERQR2xvYmFsLmZvcm1hdERhdGUoZGF0ZSwgZm9ybWF0LCB0aGlzLm8ubGFuZ3VhZ2UpO1xuXHRcdFx0XHR9LCB0aGlzKVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdHNob3c6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5pbnB1dEZpZWxkLmlzKCc6ZGlzYWJsZWQnKSB8fCAodGhpcy5pbnB1dEZpZWxkLnByb3AoJ3JlYWRvbmx5JykgJiYgdGhpcy5vLmVuYWJsZU9uUmVhZG9ubHkgPT09IGZhbHNlKSlcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0aWYgKCF0aGlzLmlzSW5saW5lKVxuXHRcdFx0XHR0aGlzLnBpY2tlci5hcHBlbmRUbyh0aGlzLm8uY29udGFpbmVyKTtcblx0XHRcdHRoaXMucGxhY2UoKTtcblx0XHRcdHRoaXMucGlja2VyLnNob3coKTtcblx0XHRcdHRoaXMuX2F0dGFjaFNlY29uZGFyeUV2ZW50cygpO1xuXHRcdFx0dGhpcy5fdHJpZ2dlcignc2hvdycpO1xuXHRcdFx0aWYgKCh3aW5kb3cubmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHMgfHwgJ29udG91Y2hzdGFydCcgaW4gZG9jdW1lbnQpICYmIHRoaXMuby5kaXNhYmxlVG91Y2hLZXlib2FyZCkge1xuXHRcdFx0XHQkKHRoaXMuZWxlbWVudCkuYmx1cigpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdGhpZGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5pc0lubGluZSB8fCAhdGhpcy5waWNrZXIuaXMoJzp2aXNpYmxlJykpXG5cdFx0XHRcdHJldHVybiB0aGlzO1xuXHRcdFx0dGhpcy5mb2N1c0RhdGUgPSBudWxsO1xuXHRcdFx0dGhpcy5waWNrZXIuaGlkZSgpLmRldGFjaCgpO1xuXHRcdFx0dGhpcy5fZGV0YWNoU2Vjb25kYXJ5RXZlbnRzKCk7XG5cdFx0XHR0aGlzLnNldFZpZXdNb2RlKHRoaXMuby5zdGFydFZpZXcpO1xuXG5cdFx0XHRpZiAodGhpcy5vLmZvcmNlUGFyc2UgJiYgdGhpcy5pbnB1dEZpZWxkLnZhbCgpKVxuXHRcdFx0XHR0aGlzLnNldFZhbHVlKCk7XG5cdFx0XHR0aGlzLl90cmlnZ2VyKCdoaWRlJyk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0ZGVzdHJveTogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuaGlkZSgpO1xuXHRcdFx0dGhpcy5fZGV0YWNoRXZlbnRzKCk7XG5cdFx0XHR0aGlzLl9kZXRhY2hTZWNvbmRhcnlFdmVudHMoKTtcblx0XHRcdHRoaXMucGlja2VyLnJlbW92ZSgpO1xuXHRcdFx0ZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZXBpY2tlcjtcblx0XHRcdGlmICghdGhpcy5pc0lucHV0KXtcblx0XHRcdFx0ZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblx0XHRwYXN0ZTogZnVuY3Rpb24oZSl7XG5cdFx0XHR2YXIgZGF0ZVN0cmluZztcblx0XHRcdGlmIChlLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YSAmJiBlLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS50eXBlc1xuXHRcdFx0XHQmJiAkLmluQXJyYXkoJ3RleHQvcGxhaW4nLCBlLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS50eXBlcykgIT09IC0xKSB7XG5cdFx0XHRcdGRhdGVTdHJpbmcgPSBlLm9yaWdpbmFsRXZlbnQuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCd0ZXh0L3BsYWluJyk7XG5cdFx0XHR9IGVsc2UgaWYgKHdpbmRvdy5jbGlwYm9hcmREYXRhKSB7XG5cdFx0XHRcdGRhdGVTdHJpbmcgPSB3aW5kb3cuY2xpcGJvYXJkRGF0YS5nZXREYXRhKCdUZXh0Jyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnNldERhdGUoZGF0ZVN0cmluZyk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH0sXG5cblx0XHRfdXRjX3RvX2xvY2FsOiBmdW5jdGlvbih1dGMpe1xuXHRcdFx0aWYgKCF1dGMpIHtcblx0XHRcdFx0cmV0dXJuIHV0Yztcblx0XHRcdH1cblxuXHRcdFx0dmFyIGxvY2FsID0gbmV3IERhdGUodXRjLmdldFRpbWUoKSArICh1dGMuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKSk7XG5cblx0XHRcdGlmIChsb2NhbC5nZXRUaW1lem9uZU9mZnNldCgpICE9PSB1dGMuZ2V0VGltZXpvbmVPZmZzZXQoKSkge1xuXHRcdFx0XHRsb2NhbCA9IG5ldyBEYXRlKHV0Yy5nZXRUaW1lKCkgKyAobG9jYWwuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBsb2NhbDtcblx0XHR9LFxuXHRcdF9sb2NhbF90b191dGM6IGZ1bmN0aW9uKGxvY2FsKXtcblx0XHRcdHJldHVybiBsb2NhbCAmJiBuZXcgRGF0ZShsb2NhbC5nZXRUaW1lKCkgLSAobG9jYWwuZ2V0VGltZXpvbmVPZmZzZXQoKSo2MDAwMCkpO1xuXHRcdH0sXG5cdFx0X3plcm9fdGltZTogZnVuY3Rpb24obG9jYWwpe1xuXHRcdFx0cmV0dXJuIGxvY2FsICYmIG5ldyBEYXRlKGxvY2FsLmdldEZ1bGxZZWFyKCksIGxvY2FsLmdldE1vbnRoKCksIGxvY2FsLmdldERhdGUoKSk7XG5cdFx0fSxcblx0XHRfemVyb191dGNfdGltZTogZnVuY3Rpb24odXRjKXtcblx0XHRcdHJldHVybiB1dGMgJiYgVVRDRGF0ZSh1dGMuZ2V0VVRDRnVsbFllYXIoKSwgdXRjLmdldFVUQ01vbnRoKCksIHV0Yy5nZXRVVENEYXRlKCkpO1xuXHRcdH0sXG5cblx0XHRnZXREYXRlczogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkLm1hcCh0aGlzLmRhdGVzLCB0aGlzLl91dGNfdG9fbG9jYWwpO1xuXHRcdH0sXG5cblx0XHRnZXRVVENEYXRlczogZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiAkLm1hcCh0aGlzLmRhdGVzLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0cmV0dXJuIG5ldyBEYXRlKGQpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdGdldERhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5fdXRjX3RvX2xvY2FsKHRoaXMuZ2V0VVRDRGF0ZSgpKTtcblx0XHR9LFxuXG5cdFx0Z2V0VVRDRGF0ZTogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBzZWxlY3RlZF9kYXRlID0gdGhpcy5kYXRlcy5nZXQoLTEpO1xuXHRcdFx0aWYgKHNlbGVjdGVkX2RhdGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4gbmV3IERhdGUoc2VsZWN0ZWRfZGF0ZSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gbnVsbDtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Y2xlYXJEYXRlczogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuaW5wdXRGaWVsZC52YWwoJycpO1xuXHRcdFx0dGhpcy51cGRhdGUoKTtcblx0XHRcdHRoaXMuX3RyaWdnZXIoJ2NoYW5nZURhdGUnKTtcblxuXHRcdFx0aWYgKHRoaXMuby5hdXRvY2xvc2UpIHtcblx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdHNldERhdGVzOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGFyZ3MgPSAkLmlzQXJyYXkoYXJndW1lbnRzWzBdKSA/IGFyZ3VtZW50c1swXSA6IGFyZ3VtZW50cztcblx0XHRcdHRoaXMudXBkYXRlLmFwcGx5KHRoaXMsIGFyZ3MpO1xuXHRcdFx0dGhpcy5fdHJpZ2dlcignY2hhbmdlRGF0ZScpO1xuXHRcdFx0dGhpcy5zZXRWYWx1ZSgpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdHNldFVUQ0RhdGVzOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGFyZ3MgPSAkLmlzQXJyYXkoYXJndW1lbnRzWzBdKSA/IGFyZ3VtZW50c1swXSA6IGFyZ3VtZW50cztcblx0XHRcdHRoaXMuc2V0RGF0ZXMuYXBwbHkodGhpcywgJC5tYXAoYXJncywgdGhpcy5fdXRjX3RvX2xvY2FsKSk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0c2V0RGF0ZTogYWxpYXMoJ3NldERhdGVzJyksXG5cdFx0c2V0VVRDRGF0ZTogYWxpYXMoJ3NldFVUQ0RhdGVzJyksXG5cdFx0cmVtb3ZlOiBhbGlhcygnZGVzdHJveScsICdNZXRob2QgYHJlbW92ZWAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMi4wLiBVc2UgYGRlc3Ryb3lgIGluc3RlYWQnKSxcblxuXHRcdHNldFZhbHVlOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIGZvcm1hdHRlZCA9IHRoaXMuZ2V0Rm9ybWF0dGVkRGF0ZSgpO1xuXHRcdFx0dGhpcy5pbnB1dEZpZWxkLnZhbChmb3JtYXR0ZWQpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdGdldEZvcm1hdHRlZERhdGU6IGZ1bmN0aW9uKGZvcm1hdCl7XG5cdFx0XHRpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpXG5cdFx0XHRcdGZvcm1hdCA9IHRoaXMuby5mb3JtYXQ7XG5cblx0XHRcdHZhciBsYW5nID0gdGhpcy5vLmxhbmd1YWdlO1xuXHRcdFx0cmV0dXJuICQubWFwKHRoaXMuZGF0ZXMsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRyZXR1cm4gRFBHbG9iYWwuZm9ybWF0RGF0ZShkLCBmb3JtYXQsIGxhbmcpO1xuXHRcdFx0fSkuam9pbih0aGlzLm8ubXVsdGlkYXRlU2VwYXJhdG9yKTtcblx0XHR9LFxuXG5cdFx0Z2V0U3RhcnREYXRlOiBmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIHRoaXMuby5zdGFydERhdGU7XG5cdFx0fSxcblxuXHRcdHNldFN0YXJ0RGF0ZTogZnVuY3Rpb24oc3RhcnREYXRlKXtcblx0XHRcdHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7c3RhcnREYXRlOiBzdGFydERhdGV9KTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHR0aGlzLnVwZGF0ZU5hdkFycm93cygpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdGdldEVuZERhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gdGhpcy5vLmVuZERhdGU7XG5cdFx0fSxcblxuXHRcdHNldEVuZERhdGU6IGZ1bmN0aW9uKGVuZERhdGUpe1xuXHRcdFx0dGhpcy5fcHJvY2Vzc19vcHRpb25zKHtlbmREYXRlOiBlbmREYXRlfSk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0dGhpcy51cGRhdGVOYXZBcnJvd3MoKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblx0XHRzZXREYXlzT2ZXZWVrRGlzYWJsZWQ6IGZ1bmN0aW9uKGRheXNPZldlZWtEaXNhYmxlZCl7XG5cdFx0XHR0aGlzLl9wcm9jZXNzX29wdGlvbnMoe2RheXNPZldlZWtEaXNhYmxlZDogZGF5c09mV2Vla0Rpc2FibGVkfSk7XG5cdFx0XHR0aGlzLnVwZGF0ZSgpO1xuXHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0fSxcblxuXHRcdHNldERheXNPZldlZWtIaWdobGlnaHRlZDogZnVuY3Rpb24oZGF5c09mV2Vla0hpZ2hsaWdodGVkKXtcblx0XHRcdHRoaXMuX3Byb2Nlc3Nfb3B0aW9ucyh7ZGF5c09mV2Vla0hpZ2hsaWdodGVkOiBkYXlzT2ZXZWVrSGlnaGxpZ2h0ZWR9KTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0c2V0RGF0ZXNEaXNhYmxlZDogZnVuY3Rpb24oZGF0ZXNEaXNhYmxlZCl7XG5cdFx0XHR0aGlzLl9wcm9jZXNzX29wdGlvbnMoe2RhdGVzRGlzYWJsZWQ6IGRhdGVzRGlzYWJsZWR9KTtcblx0XHRcdHRoaXMudXBkYXRlKCk7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0cGxhY2U6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAodGhpcy5pc0lubGluZSlcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cdFx0XHR2YXIgY2FsZW5kYXJXaWR0aCA9IHRoaXMucGlja2VyLm91dGVyV2lkdGgoKSxcblx0XHRcdFx0Y2FsZW5kYXJIZWlnaHQgPSB0aGlzLnBpY2tlci5vdXRlckhlaWdodCgpLFxuXHRcdFx0XHR2aXN1YWxQYWRkaW5nID0gMTAsXG5cdFx0XHRcdGNvbnRhaW5lciA9ICQodGhpcy5vLmNvbnRhaW5lciksXG5cdFx0XHRcdHdpbmRvd1dpZHRoID0gY29udGFpbmVyLndpZHRoKCksXG5cdFx0XHRcdHNjcm9sbFRvcCA9IHRoaXMuby5jb250YWluZXIgPT09ICdib2R5JyA/ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpIDogY29udGFpbmVyLnNjcm9sbFRvcCgpLFxuXHRcdFx0XHRhcHBlbmRPZmZzZXQgPSBjb250YWluZXIub2Zmc2V0KCk7XG5cblx0XHRcdHZhciBwYXJlbnRzWmluZGV4ID0gWzBdO1xuXHRcdFx0dGhpcy5lbGVtZW50LnBhcmVudHMoKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhciBpdGVtWkluZGV4ID0gJCh0aGlzKS5jc3MoJ3otaW5kZXgnKTtcblx0XHRcdFx0aWYgKGl0ZW1aSW5kZXggIT09ICdhdXRvJyAmJiBOdW1iZXIoaXRlbVpJbmRleCkgIT09IDApIHBhcmVudHNaaW5kZXgucHVzaChOdW1iZXIoaXRlbVpJbmRleCkpO1xuXHRcdFx0fSk7XG5cdFx0XHR2YXIgekluZGV4ID0gTWF0aC5tYXguYXBwbHkoTWF0aCwgcGFyZW50c1ppbmRleCkgKyB0aGlzLm8uekluZGV4T2Zmc2V0O1xuXHRcdFx0dmFyIG9mZnNldCA9IHRoaXMuY29tcG9uZW50ID8gdGhpcy5jb21wb25lbnQucGFyZW50KCkub2Zmc2V0KCkgOiB0aGlzLmVsZW1lbnQub2Zmc2V0KCk7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gdGhpcy5jb21wb25lbnQgPyB0aGlzLmNvbXBvbmVudC5vdXRlckhlaWdodCh0cnVlKSA6IHRoaXMuZWxlbWVudC5vdXRlckhlaWdodChmYWxzZSk7XG5cdFx0XHR2YXIgd2lkdGggPSB0aGlzLmNvbXBvbmVudCA/IHRoaXMuY29tcG9uZW50Lm91dGVyV2lkdGgodHJ1ZSkgOiB0aGlzLmVsZW1lbnQub3V0ZXJXaWR0aChmYWxzZSk7XG5cdFx0XHR2YXIgbGVmdCA9IG9mZnNldC5sZWZ0IC0gYXBwZW5kT2Zmc2V0LmxlZnQ7XG5cdFx0XHR2YXIgdG9wID0gb2Zmc2V0LnRvcCAtIGFwcGVuZE9mZnNldC50b3A7XG5cblx0XHRcdGlmICh0aGlzLm8uY29udGFpbmVyICE9PSAnYm9keScpIHtcblx0XHRcdFx0dG9wICs9IHNjcm9sbFRvcDtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5waWNrZXIucmVtb3ZlQ2xhc3MoXG5cdFx0XHRcdCdkYXRlcGlja2VyLW9yaWVudC10b3AgZGF0ZXBpY2tlci1vcmllbnQtYm90dG9tICcrXG5cdFx0XHRcdCdkYXRlcGlja2VyLW9yaWVudC1yaWdodCBkYXRlcGlja2VyLW9yaWVudC1sZWZ0J1xuXHRcdFx0KTtcblxuXHRcdFx0aWYgKHRoaXMuby5vcmllbnRhdGlvbi54ICE9PSAnYXV0bycpe1xuXHRcdFx0XHR0aGlzLnBpY2tlci5hZGRDbGFzcygnZGF0ZXBpY2tlci1vcmllbnQtJyArIHRoaXMuby5vcmllbnRhdGlvbi54KTtcblx0XHRcdFx0aWYgKHRoaXMuby5vcmllbnRhdGlvbi54ID09PSAncmlnaHQnKVxuXHRcdFx0XHRcdGxlZnQgLT0gY2FsZW5kYXJXaWR0aCAtIHdpZHRoO1xuXHRcdFx0fVxuXHRcdFx0Ly8gYXV0byB4IG9yaWVudGF0aW9uIGlzIGJlc3QtcGxhY2VtZW50OiBpZiBpdCBjcm9zc2VzIGEgd2luZG93XG5cdFx0XHQvLyBlZGdlLCBmdWRnZSBpdCBzaWRld2F5c1xuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmIChvZmZzZXQubGVmdCA8IDApIHtcblx0XHRcdFx0XHQvLyBjb21wb25lbnQgaXMgb3V0c2lkZSB0aGUgd2luZG93IG9uIHRoZSBsZWZ0IHNpZGUuIE1vdmUgaXQgaW50byB2aXNpYmxlIHJhbmdlXG5cdFx0XHRcdFx0dGhpcy5waWNrZXIuYWRkQ2xhc3MoJ2RhdGVwaWNrZXItb3JpZW50LWxlZnQnKTtcblx0XHRcdFx0XHRsZWZ0IC09IG9mZnNldC5sZWZ0IC0gdmlzdWFsUGFkZGluZztcblx0XHRcdFx0fSBlbHNlIGlmIChsZWZ0ICsgY2FsZW5kYXJXaWR0aCA+IHdpbmRvd1dpZHRoKSB7XG5cdFx0XHRcdFx0Ly8gdGhlIGNhbGVuZGFyIHBhc3NlcyB0aGUgd2lkb3cgcmlnaHQgZWRnZS4gQWxpZ24gaXQgdG8gY29tcG9uZW50IHJpZ2h0IHNpZGVcblx0XHRcdFx0XHR0aGlzLnBpY2tlci5hZGRDbGFzcygnZGF0ZXBpY2tlci1vcmllbnQtcmlnaHQnKTtcblx0XHRcdFx0XHRsZWZ0ICs9IHdpZHRoIC0gY2FsZW5kYXJXaWR0aDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAodGhpcy5vLnJ0bCkge1xuXHRcdFx0XHRcdFx0Ly8gRGVmYXVsdCB0byByaWdodFxuXHRcdFx0XHRcdFx0dGhpcy5waWNrZXIuYWRkQ2xhc3MoJ2RhdGVwaWNrZXItb3JpZW50LXJpZ2h0Jyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdC8vIERlZmF1bHQgdG8gbGVmdFxuXHRcdFx0XHRcdFx0dGhpcy5waWNrZXIuYWRkQ2xhc3MoJ2RhdGVwaWNrZXItb3JpZW50LWxlZnQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gYXV0byB5IG9yaWVudGF0aW9uIGlzIGJlc3Qtc2l0dWF0aW9uOiB0b3Agb3IgYm90dG9tLCBubyBmdWRnaW5nLFxuXHRcdFx0Ly8gZGVjaXNpb24gYmFzZWQgb24gd2hpY2ggc2hvd3MgbW9yZSBvZiB0aGUgY2FsZW5kYXJcblx0XHRcdHZhciB5b3JpZW50ID0gdGhpcy5vLm9yaWVudGF0aW9uLnksXG5cdFx0XHRcdHRvcF9vdmVyZmxvdztcblx0XHRcdGlmICh5b3JpZW50ID09PSAnYXV0bycpe1xuXHRcdFx0XHR0b3Bfb3ZlcmZsb3cgPSAtc2Nyb2xsVG9wICsgdG9wIC0gY2FsZW5kYXJIZWlnaHQ7XG5cdFx0XHRcdHlvcmllbnQgPSB0b3Bfb3ZlcmZsb3cgPCAwID8gJ2JvdHRvbScgOiAndG9wJztcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5waWNrZXIuYWRkQ2xhc3MoJ2RhdGVwaWNrZXItb3JpZW50LScgKyB5b3JpZW50KTtcblx0XHRcdGlmICh5b3JpZW50ID09PSAndG9wJylcblx0XHRcdFx0dG9wIC09IGNhbGVuZGFySGVpZ2h0ICsgcGFyc2VJbnQodGhpcy5waWNrZXIuY3NzKCdwYWRkaW5nLXRvcCcpKTtcblx0XHRcdGVsc2Vcblx0XHRcdFx0dG9wICs9IGhlaWdodDtcblxuXHRcdFx0aWYgKHRoaXMuby5ydGwpIHtcblx0XHRcdFx0dmFyIHJpZ2h0ID0gd2luZG93V2lkdGggLSAobGVmdCArIHdpZHRoKTtcblx0XHRcdFx0dGhpcy5waWNrZXIuY3NzKHtcblx0XHRcdFx0XHR0b3A6IHRvcCxcblx0XHRcdFx0XHRyaWdodDogcmlnaHQsXG5cdFx0XHRcdFx0ekluZGV4OiB6SW5kZXhcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLnBpY2tlci5jc3Moe1xuXHRcdFx0XHRcdHRvcDogdG9wLFxuXHRcdFx0XHRcdGxlZnQ6IGxlZnQsXG5cdFx0XHRcdFx0ekluZGV4OiB6SW5kZXhcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9LFxuXG5cdFx0X2FsbG93X3VwZGF0ZTogdHJ1ZSxcblx0XHR1cGRhdGU6IGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoIXRoaXMuX2FsbG93X3VwZGF0ZSlcblx0XHRcdFx0cmV0dXJuIHRoaXM7XG5cblx0XHRcdHZhciBvbGREYXRlcyA9IHRoaXMuZGF0ZXMuY29weSgpLFxuXHRcdFx0XHRkYXRlcyA9IFtdLFxuXHRcdFx0XHRmcm9tQXJncyA9IGZhbHNlO1xuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGgpe1xuXHRcdFx0XHQkLmVhY2goYXJndW1lbnRzLCAkLnByb3h5KGZ1bmN0aW9uKGksIGRhdGUpe1xuXHRcdFx0XHRcdGlmIChkYXRlIGluc3RhbmNlb2YgRGF0ZSlcblx0XHRcdFx0XHRcdGRhdGUgPSB0aGlzLl9sb2NhbF90b191dGMoZGF0ZSk7XG5cdFx0XHRcdFx0ZGF0ZXMucHVzaChkYXRlKTtcblx0XHRcdFx0fSwgdGhpcykpO1xuXHRcdFx0XHRmcm9tQXJncyA9IHRydWU7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkYXRlcyA9IHRoaXMuaXNJbnB1dFxuXHRcdFx0XHRcdFx0PyB0aGlzLmVsZW1lbnQudmFsKClcblx0XHRcdFx0XHRcdDogdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUnKSB8fCB0aGlzLmlucHV0RmllbGQudmFsKCk7XG5cdFx0XHRcdGlmIChkYXRlcyAmJiB0aGlzLm8ubXVsdGlkYXRlKVxuXHRcdFx0XHRcdGRhdGVzID0gZGF0ZXMuc3BsaXQodGhpcy5vLm11bHRpZGF0ZVNlcGFyYXRvcik7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRkYXRlcyA9IFtkYXRlc107XG5cdFx0XHRcdGRlbGV0ZSB0aGlzLmVsZW1lbnQuZGF0YSgpLmRhdGU7XG5cdFx0XHR9XG5cblx0XHRcdGRhdGVzID0gJC5tYXAoZGF0ZXMsICQucHJveHkoZnVuY3Rpb24oZGF0ZSl7XG5cdFx0XHRcdHJldHVybiBEUEdsb2JhbC5wYXJzZURhdGUoZGF0ZSwgdGhpcy5vLmZvcm1hdCwgdGhpcy5vLmxhbmd1YWdlLCB0aGlzLm8uYXNzdW1lTmVhcmJ5WWVhcik7XG5cdFx0XHR9LCB0aGlzKSk7XG5cdFx0XHRkYXRlcyA9ICQuZ3JlcChkYXRlcywgJC5wcm94eShmdW5jdGlvbihkYXRlKXtcblx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHQhdGhpcy5kYXRlV2l0aGluUmFuZ2UoZGF0ZSkgfHxcblx0XHRcdFx0XHQhZGF0ZVxuXHRcdFx0XHQpO1xuXHRcdFx0fSwgdGhpcyksIHRydWUpO1xuXHRcdFx0dGhpcy5kYXRlcy5yZXBsYWNlKGRhdGVzKTtcblxuXHRcdFx0aWYgKHRoaXMuby51cGRhdGVWaWV3RGF0ZSkge1xuXHRcdFx0XHRpZiAodGhpcy5kYXRlcy5sZW5ndGgpXG5cdFx0XHRcdFx0dGhpcy52aWV3RGF0ZSA9IG5ldyBEYXRlKHRoaXMuZGF0ZXMuZ2V0KC0xKSk7XG5cdFx0XHRcdGVsc2UgaWYgKHRoaXMudmlld0RhdGUgPCB0aGlzLm8uc3RhcnREYXRlKVxuXHRcdFx0XHRcdHRoaXMudmlld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLm8uc3RhcnREYXRlKTtcblx0XHRcdFx0ZWxzZSBpZiAodGhpcy52aWV3RGF0ZSA+IHRoaXMuby5lbmREYXRlKVxuXHRcdFx0XHRcdHRoaXMudmlld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLm8uZW5kRGF0ZSk7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR0aGlzLnZpZXdEYXRlID0gdGhpcy5vLmRlZmF1bHRWaWV3RGF0ZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGZyb21BcmdzKXtcblx0XHRcdFx0Ly8gc2V0dGluZyBkYXRlIGJ5IGNsaWNraW5nXG5cdFx0XHRcdHRoaXMuc2V0VmFsdWUoKTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNoYW5nZSgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAodGhpcy5kYXRlcy5sZW5ndGgpe1xuXHRcdFx0XHQvLyBzZXR0aW5nIGRhdGUgYnkgdHlwaW5nXG5cdFx0XHRcdGlmIChTdHJpbmcob2xkRGF0ZXMpICE9PSBTdHJpbmcodGhpcy5kYXRlcykgJiYgZnJvbUFyZ3MpIHtcblx0XHRcdFx0XHR0aGlzLl90cmlnZ2VyKCdjaGFuZ2VEYXRlJyk7XG5cdFx0XHRcdFx0dGhpcy5lbGVtZW50LmNoYW5nZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXRoaXMuZGF0ZXMubGVuZ3RoICYmIG9sZERhdGVzLmxlbmd0aCkge1xuXHRcdFx0XHR0aGlzLl90cmlnZ2VyKCdjbGVhckRhdGUnKTtcblx0XHRcdFx0dGhpcy5lbGVtZW50LmNoYW5nZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmZpbGwoKTtcblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH0sXG5cblx0XHRmaWxsRG93OiBmdW5jdGlvbigpe1xuICAgICAgaWYgKHRoaXMuby5zaG93V2Vla0RheXMpIHtcblx0XHRcdHZhciBkb3dDbnQgPSB0aGlzLm8ud2Vla1N0YXJ0LFxuXHRcdFx0XHRodG1sID0gJzx0cj4nO1xuXHRcdFx0aWYgKHRoaXMuby5jYWxlbmRhcldlZWtzKXtcblx0XHRcdFx0aHRtbCArPSAnPHRoIGNsYXNzPVwiY3dcIj4mIzE2MDs8L3RoPic7XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAoZG93Q250IDwgdGhpcy5vLndlZWtTdGFydCArIDcpe1xuXHRcdFx0XHRodG1sICs9ICc8dGggY2xhc3M9XCJkb3cnO1xuICAgICAgICBpZiAoJC5pbkFycmF5KGRvd0NudCwgdGhpcy5vLmRheXNPZldlZWtEaXNhYmxlZCkgIT09IC0xKVxuICAgICAgICAgIGh0bWwgKz0gJyBkaXNhYmxlZCc7XG4gICAgICAgIGh0bWwgKz0gJ1wiPicrZGF0ZXNbdGhpcy5vLmxhbmd1YWdlXS5kYXlzTWluWyhkb3dDbnQrKyklN10rJzwvdGg+Jztcblx0XHRcdH1cblx0XHRcdGh0bWwgKz0gJzwvdHI+Jztcblx0XHRcdHRoaXMucGlja2VyLmZpbmQoJy5kYXRlcGlja2VyLWRheXMgdGhlYWQnKS5hcHBlbmQoaHRtbCk7XG4gICAgICB9XG5cdFx0fSxcblxuXHRcdGZpbGxNb250aHM6IGZ1bmN0aW9uKCl7XG4gICAgICB2YXIgbG9jYWxEYXRlID0gdGhpcy5fdXRjX3RvX2xvY2FsKHRoaXMudmlld0RhdGUpO1xuXHRcdFx0dmFyIGh0bWwgPSAnJztcblx0XHRcdHZhciBmb2N1c2VkO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCAxMjsgaSsrKXtcblx0XHRcdFx0Zm9jdXNlZCA9IGxvY2FsRGF0ZSAmJiBsb2NhbERhdGUuZ2V0TW9udGgoKSA9PT0gaSA/ICcgZm9jdXNlZCcgOiAnJztcblx0XHRcdFx0aHRtbCArPSAnPHNwYW4gY2xhc3M9XCJtb250aCcgKyBmb2N1c2VkICsgJ1wiPicgKyBkYXRlc1t0aGlzLm8ubGFuZ3VhZ2VdLm1vbnRoc1Nob3J0W2ldICsgJzwvc3Bhbj4nO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5waWNrZXIuZmluZCgnLmRhdGVwaWNrZXItbW9udGhzIHRkJykuaHRtbChodG1sKTtcblx0XHR9LFxuXG5cdFx0c2V0UmFuZ2U6IGZ1bmN0aW9uKHJhbmdlKXtcblx0XHRcdGlmICghcmFuZ2UgfHwgIXJhbmdlLmxlbmd0aClcblx0XHRcdFx0ZGVsZXRlIHRoaXMucmFuZ2U7XG5cdFx0XHRlbHNlXG5cdFx0XHRcdHRoaXMucmFuZ2UgPSAkLm1hcChyYW5nZSwgZnVuY3Rpb24oZCl7XG5cdFx0XHRcdFx0cmV0dXJuIGQudmFsdWVPZigpO1xuXHRcdFx0XHR9KTtcblx0XHRcdHRoaXMuZmlsbCgpO1xuXHRcdH0sXG5cblx0XHRnZXRDbGFzc05hbWVzOiBmdW5jdGlvbihkYXRlKXtcblx0XHRcdHZhciBjbHMgPSBbXSxcblx0XHRcdFx0eWVhciA9IHRoaXMudmlld0RhdGUuZ2V0VVRDRnVsbFllYXIoKSxcblx0XHRcdFx0bW9udGggPSB0aGlzLnZpZXdEYXRlLmdldFVUQ01vbnRoKCksXG5cdFx0XHRcdHRvZGF5ID0gVVRDVG9kYXkoKTtcblx0XHRcdGlmIChkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPCB5ZWFyIHx8IChkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPT09IHllYXIgJiYgZGF0ZS5nZXRVVENNb250aCgpIDwgbW9udGgpKXtcblx0XHRcdFx0Y2xzLnB1c2goJ29sZCcpO1xuXHRcdFx0fSBlbHNlIGlmIChkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPiB5ZWFyIHx8IChkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPT09IHllYXIgJiYgZGF0ZS5nZXRVVENNb250aCgpID4gbW9udGgpKXtcblx0XHRcdFx0Y2xzLnB1c2goJ25ldycpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuZm9jdXNEYXRlICYmIGRhdGUudmFsdWVPZigpID09PSB0aGlzLmZvY3VzRGF0ZS52YWx1ZU9mKCkpXG5cdFx0XHRcdGNscy5wdXNoKCdmb2N1c2VkJyk7XG5cdFx0XHQvLyBDb21wYXJlIGludGVybmFsIFVUQyBkYXRlIHdpdGggVVRDIHRvZGF5LCBub3QgbG9jYWwgdG9kYXlcblx0XHRcdGlmICh0aGlzLm8udG9kYXlIaWdobGlnaHQgJiYgaXNVVENFcXVhbHMoZGF0ZSwgdG9kYXkpKSB7XG5cdFx0XHRcdGNscy5wdXNoKCd0b2RheScpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRoaXMuZGF0ZXMuY29udGFpbnMoZGF0ZSkgIT09IC0xKVxuXHRcdFx0XHRjbHMucHVzaCgnYWN0aXZlJyk7XG5cdFx0XHRpZiAoIXRoaXMuZGF0ZVdpdGhpblJhbmdlKGRhdGUpKXtcblx0XHRcdFx0Y2xzLnB1c2goJ2Rpc2FibGVkJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGhpcy5kYXRlSXNEaXNhYmxlZChkYXRlKSl7XG5cdFx0XHRcdGNscy5wdXNoKCdkaXNhYmxlZCcsICdkaXNhYmxlZC1kYXRlJyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoJC5pbkFycmF5KGRhdGUuZ2V0VVRDRGF5KCksIHRoaXMuby5kYXlzT2ZXZWVrSGlnaGxpZ2h0ZWQpICE9PSAtMSl7XG5cdFx0XHRcdGNscy5wdXNoKCdoaWdobGlnaHRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5yYW5nZSl7XG5cdFx0XHRcdGlmIChkYXRlID4gdGhpcy5yYW5nZVswXSAmJiBkYXRlIDwgdGhpcy5yYW5nZVt0aGlzLnJhbmdlLmxlbmd0aC0xXSl7XG5cdFx0XHRcdFx0Y2xzLnB1c2goJ3JhbmdlJyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCQuaW5BcnJheShkYXRlLnZhbHVlT2YoKSwgdGhpcy5yYW5nZSkgIT09IC0xKXtcblx0XHRcdFx0XHRjbHMucHVzaCgnc2VsZWN0ZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoZGF0ZS52YWx1ZU9mKCkgPT09IHRoaXMucmFuZ2VbMF0pe1xuICAgICAgICAgIGNscy5wdXNoKCdyYW5nZS1zdGFydCcpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkYXRlLnZhbHVlT2YoKSA9PT0gdGhpcy5yYW5nZVt0aGlzLnJhbmdlLmxlbmd0aC0xXSl7XG4gICAgICAgICAgY2xzLnB1c2goJ3JhbmdlLWVuZCcpO1xuICAgICAgICB9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY2xzO1xuXHRcdH0sXG5cblx0XHRfZmlsbF95ZWFyc1ZpZXc6IGZ1bmN0aW9uKHNlbGVjdG9yLCBjc3NDbGFzcywgZmFjdG9yLCB5ZWFyLCBzdGFydFllYXIsIGVuZFllYXIsIGJlZm9yZUZuKXtcblx0XHRcdHZhciBodG1sID0gJyc7XG5cdFx0XHR2YXIgc3RlcCA9IGZhY3RvciAvIDEwO1xuXHRcdFx0dmFyIHZpZXcgPSB0aGlzLnBpY2tlci5maW5kKHNlbGVjdG9yKTtcblx0XHRcdHZhciBzdGFydFZhbCA9IE1hdGguZmxvb3IoeWVhciAvIGZhY3RvcikgKiBmYWN0b3I7XG5cdFx0XHR2YXIgZW5kVmFsID0gc3RhcnRWYWwgKyBzdGVwICogOTtcblx0XHRcdHZhciBmb2N1c2VkVmFsID0gTWF0aC5mbG9vcih0aGlzLnZpZXdEYXRlLmdldEZ1bGxZZWFyKCkgLyBzdGVwKSAqIHN0ZXA7XG5cdFx0XHR2YXIgc2VsZWN0ZWQgPSAkLm1hcCh0aGlzLmRhdGVzLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0cmV0dXJuIE1hdGguZmxvb3IoZC5nZXRVVENGdWxsWWVhcigpIC8gc3RlcCkgKiBzdGVwO1xuXHRcdFx0fSk7XG5cblx0XHRcdHZhciBjbGFzc2VzLCB0b29sdGlwLCBiZWZvcmU7XG5cdFx0XHRmb3IgKHZhciBjdXJyVmFsID0gc3RhcnRWYWwgLSBzdGVwOyBjdXJyVmFsIDw9IGVuZFZhbCArIHN0ZXA7IGN1cnJWYWwgKz0gc3RlcCkge1xuXHRcdFx0XHRjbGFzc2VzID0gW2Nzc0NsYXNzXTtcblx0XHRcdFx0dG9vbHRpcCA9IG51bGw7XG5cblx0XHRcdFx0aWYgKGN1cnJWYWwgPT09IHN0YXJ0VmFsIC0gc3RlcCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnb2xkJyk7XG5cdFx0XHRcdH0gZWxzZSBpZiAoY3VyclZhbCA9PT0gZW5kVmFsICsgc3RlcCkge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnbmV3Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKCQuaW5BcnJheShjdXJyVmFsLCBzZWxlY3RlZCkgIT09IC0xKSB7XG5cdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKCdhY3RpdmUnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY3VyclZhbCA8IHN0YXJ0WWVhciB8fCBjdXJyVmFsID4gZW5kWWVhcikge1xuXHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnZGlzYWJsZWQnKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAoY3VyclZhbCA9PT0gZm9jdXNlZFZhbCkge1xuXHRcdFx0XHQgIGNsYXNzZXMucHVzaCgnZm9jdXNlZCcpO1xuICAgICAgICB9XG5cblx0XHRcdFx0aWYgKGJlZm9yZUZuICE9PSAkLm5vb3ApIHtcblx0XHRcdFx0XHRiZWZvcmUgPSBiZWZvcmVGbihuZXcgRGF0ZShjdXJyVmFsLCAwLCAxKSk7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRiZWZvcmUgPSB7fTtcblx0XHRcdFx0XHR9IGVsc2UgaWYgKHR5cGVvZiBiZWZvcmUgPT09ICdib29sZWFuJykge1xuXHRcdFx0XHRcdFx0YmVmb3JlID0ge2VuYWJsZWQ6IGJlZm9yZX07XG5cdFx0XHRcdFx0fSBlbHNlIGlmICh0eXBlb2YgYmVmb3JlID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0YmVmb3JlID0ge2NsYXNzZXM6IGJlZm9yZX07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChiZWZvcmUuZW5hYmxlZCA9PT0gZmFsc2UpIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaCgnZGlzYWJsZWQnKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0aWYgKGJlZm9yZS5jbGFzc2VzKSB7XG5cdFx0XHRcdFx0XHRjbGFzc2VzID0gY2xhc3Nlcy5jb25jYXQoYmVmb3JlLmNsYXNzZXMuc3BsaXQoL1xccysvKSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGlmIChiZWZvcmUudG9vbHRpcCkge1xuXHRcdFx0XHRcdFx0dG9vbHRpcCA9IGJlZm9yZS50b29sdGlwO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdGh0bWwgKz0gJzxzcGFuIGNsYXNzPVwiJyArIGNsYXNzZXMuam9pbignICcpICsgJ1wiJyArICh0b29sdGlwID8gJyB0aXRsZT1cIicgKyB0b29sdGlwICsgJ1wiJyA6ICcnKSArICc+JyArIGN1cnJWYWwgKyAnPC9zcGFuPic7XG5cdFx0XHR9XG5cblx0XHRcdHZpZXcuZmluZCgnLmRhdGVwaWNrZXItc3dpdGNoJykudGV4dChzdGFydFZhbCArICctJyArIGVuZFZhbCk7XG5cdFx0XHR2aWV3LmZpbmQoJ3RkJykuaHRtbChodG1sKTtcblx0XHR9LFxuXG5cdFx0ZmlsbDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBkID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZSksXG5cdFx0XHRcdHllYXIgPSBkLmdldFVUQ0Z1bGxZZWFyKCksXG5cdFx0XHRcdG1vbnRoID0gZC5nZXRVVENNb250aCgpLFxuXHRcdFx0XHRzdGFydFllYXIgPSB0aGlzLm8uc3RhcnREYXRlICE9PSAtSW5maW5pdHkgPyB0aGlzLm8uc3RhcnREYXRlLmdldFVUQ0Z1bGxZZWFyKCkgOiAtSW5maW5pdHksXG5cdFx0XHRcdHN0YXJ0TW9udGggPSB0aGlzLm8uc3RhcnREYXRlICE9PSAtSW5maW5pdHkgPyB0aGlzLm8uc3RhcnREYXRlLmdldFVUQ01vbnRoKCkgOiAtSW5maW5pdHksXG5cdFx0XHRcdGVuZFllYXIgPSB0aGlzLm8uZW5kRGF0ZSAhPT0gSW5maW5pdHkgPyB0aGlzLm8uZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpIDogSW5maW5pdHksXG5cdFx0XHRcdGVuZE1vbnRoID0gdGhpcy5vLmVuZERhdGUgIT09IEluZmluaXR5ID8gdGhpcy5vLmVuZERhdGUuZ2V0VVRDTW9udGgoKSA6IEluZmluaXR5LFxuXHRcdFx0XHR0b2RheXR4dCA9IGRhdGVzW3RoaXMuby5sYW5ndWFnZV0udG9kYXkgfHwgZGF0ZXNbJ2VuJ10udG9kYXkgfHwgJycsXG5cdFx0XHRcdGNsZWFydHh0ID0gZGF0ZXNbdGhpcy5vLmxhbmd1YWdlXS5jbGVhciB8fCBkYXRlc1snZW4nXS5jbGVhciB8fCAnJyxcbiAgICAgICAgdGl0bGVGb3JtYXQgPSBkYXRlc1t0aGlzLm8ubGFuZ3VhZ2VdLnRpdGxlRm9ybWF0IHx8IGRhdGVzWydlbiddLnRpdGxlRm9ybWF0LFxuICAgICAgICB0b2RheURhdGUgPSBVVENUb2RheSgpLFxuICAgICAgICB0aXRsZUJ0blZpc2libGUgPSAodGhpcy5vLnRvZGF5QnRuID09PSB0cnVlIHx8IHRoaXMuby50b2RheUJ0biA9PT0gJ2xpbmtlZCcpICYmIHRvZGF5RGF0ZSA+PSB0aGlzLm8uc3RhcnREYXRlICYmIHRvZGF5RGF0ZSA8PSB0aGlzLm8uZW5kRGF0ZSAmJiAhdGhpcy53ZWVrT2ZEYXRlSXNEaXNhYmxlZCh0b2RheURhdGUpLFxuXHRcdFx0XHR0b29sdGlwLFxuXHRcdFx0XHRiZWZvcmU7XG5cdFx0XHRpZiAoaXNOYU4oeWVhcikgfHwgaXNOYU4obW9udGgpKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR0aGlzLnBpY2tlci5maW5kKCcuZGF0ZXBpY2tlci1kYXlzIC5kYXRlcGlja2VyLXN3aXRjaCcpXG5cdFx0XHRcdFx0XHQudGV4dChEUEdsb2JhbC5mb3JtYXREYXRlKGQsIHRpdGxlRm9ybWF0LCB0aGlzLm8ubGFuZ3VhZ2UpKTtcblx0XHRcdHRoaXMucGlja2VyLmZpbmQoJ3Rmb290IC50b2RheScpXG5cdFx0XHRcdFx0XHQudGV4dCh0b2RheXR4dClcbiAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCB0aXRsZUJ0blZpc2libGUgPyAndGFibGUtY2VsbCcgOiAnbm9uZScpO1xuXHRcdFx0dGhpcy5waWNrZXIuZmluZCgndGZvb3QgLmNsZWFyJylcblx0XHRcdFx0XHRcdC50ZXh0KGNsZWFydHh0KVxuXHRcdFx0XHRcdFx0LmNzcygnZGlzcGxheScsIHRoaXMuby5jbGVhckJ0biA9PT0gdHJ1ZSA/ICd0YWJsZS1jZWxsJyA6ICdub25lJyk7XG5cdFx0XHR0aGlzLnBpY2tlci5maW5kKCd0aGVhZCAuZGF0ZXBpY2tlci10aXRsZScpXG5cdFx0XHRcdFx0XHQudGV4dCh0aGlzLm8udGl0bGUpXG5cdFx0XHRcdFx0XHQuY3NzKCdkaXNwbGF5JywgdHlwZW9mIHRoaXMuby50aXRsZSA9PT0gJ3N0cmluZycgJiYgdGhpcy5vLnRpdGxlICE9PSAnJyA/ICd0YWJsZS1jZWxsJyA6ICdub25lJyk7XG5cdFx0XHR0aGlzLnVwZGF0ZU5hdkFycm93cygpO1xuXHRcdFx0dGhpcy5maWxsTW9udGhzKCk7XG5cdFx0XHR2YXIgcHJldk1vbnRoID0gVVRDRGF0ZSh5ZWFyLCBtb250aCwgMCksXG5cdFx0XHRcdGRheSA9IHByZXZNb250aC5nZXRVVENEYXRlKCk7XG5cdFx0XHRwcmV2TW9udGguc2V0VVRDRGF0ZShkYXkgLSAocHJldk1vbnRoLmdldFVUQ0RheSgpIC0gdGhpcy5vLndlZWtTdGFydCArIDcpJTcpO1xuXHRcdFx0dmFyIG5leHRNb250aCA9IG5ldyBEYXRlKHByZXZNb250aCk7XG5cdFx0XHRpZiAocHJldk1vbnRoLmdldFVUQ0Z1bGxZZWFyKCkgPCAxMDApe1xuICAgICAgICBuZXh0TW9udGguc2V0VVRDRnVsbFllYXIocHJldk1vbnRoLmdldFVUQ0Z1bGxZZWFyKCkpO1xuICAgICAgfVxuXHRcdFx0bmV4dE1vbnRoLnNldFVUQ0RhdGUobmV4dE1vbnRoLmdldFVUQ0RhdGUoKSArIDQyKTtcblx0XHRcdG5leHRNb250aCA9IG5leHRNb250aC52YWx1ZU9mKCk7XG5cdFx0XHR2YXIgaHRtbCA9IFtdO1xuXHRcdFx0dmFyIHdlZWtEYXksIGNsc05hbWU7XG5cdFx0XHR3aGlsZSAocHJldk1vbnRoLnZhbHVlT2YoKSA8IG5leHRNb250aCl7XG5cdFx0XHRcdHdlZWtEYXkgPSBwcmV2TW9udGguZ2V0VVRDRGF5KCk7XG5cdFx0XHRcdGlmICh3ZWVrRGF5ID09PSB0aGlzLm8ud2Vla1N0YXJ0KXtcblx0XHRcdFx0XHRodG1sLnB1c2goJzx0cj4nKTtcblx0XHRcdFx0XHRpZiAodGhpcy5vLmNhbGVuZGFyV2Vla3Mpe1xuXHRcdFx0XHRcdFx0Ly8gSVNPIDg2MDE6IEZpcnN0IHdlZWsgY29udGFpbnMgZmlyc3QgdGh1cnNkYXkuXG5cdFx0XHRcdFx0XHQvLyBJU08gYWxzbyBzdGF0ZXMgd2VlayBzdGFydHMgb24gTW9uZGF5LCBidXQgd2UgY2FuIGJlIG1vcmUgYWJzdHJhY3QgaGVyZS5cblx0XHRcdFx0XHRcdHZhclxuXHRcdFx0XHRcdFx0XHQvLyBTdGFydCBvZiBjdXJyZW50IHdlZWs6IGJhc2VkIG9uIHdlZWtzdGFydC9jdXJyZW50IGRhdGVcblx0XHRcdFx0XHRcdFx0d3MgPSBuZXcgRGF0ZSgrcHJldk1vbnRoICsgKHRoaXMuby53ZWVrU3RhcnQgLSB3ZWVrRGF5IC0gNykgJSA3ICogODY0ZTUpLFxuXHRcdFx0XHRcdFx0XHQvLyBUaHVyc2RheSBvZiB0aGlzIHdlZWtcblx0XHRcdFx0XHRcdFx0dGggPSBuZXcgRGF0ZShOdW1iZXIod3MpICsgKDcgKyA0IC0gd3MuZ2V0VVRDRGF5KCkpICUgNyAqIDg2NGU1KSxcblx0XHRcdFx0XHRcdFx0Ly8gRmlyc3QgVGh1cnNkYXkgb2YgeWVhciwgeWVhciBmcm9tIHRodXJzZGF5XG5cdFx0XHRcdFx0XHRcdHl0aCA9IG5ldyBEYXRlKE51bWJlcih5dGggPSBVVENEYXRlKHRoLmdldFVUQ0Z1bGxZZWFyKCksIDAsIDEpKSArICg3ICsgNCAtIHl0aC5nZXRVVENEYXkoKSkgJSA3ICogODY0ZTUpLFxuXHRcdFx0XHRcdFx0XHQvLyBDYWxlbmRhciB3ZWVrOiBtcyBiZXR3ZWVuIHRodXJzZGF5cywgZGl2IG1zIHBlciBkYXksIGRpdiA3IGRheXNcblx0XHRcdFx0XHRcdFx0Y2FsV2VlayA9ICh0aCAtIHl0aCkgLyA4NjRlNSAvIDcgKyAxO1xuXHRcdFx0XHRcdFx0aHRtbC5wdXNoKCc8dGQgY2xhc3M9XCJjd1wiPicrIGNhbFdlZWsgKyc8L3RkPicpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjbHNOYW1lID0gdGhpcy5nZXRDbGFzc05hbWVzKHByZXZNb250aCk7XG5cdFx0XHRcdGNsc05hbWUucHVzaCgnZGF5Jyk7XG5cblx0XHRcdFx0dmFyIGNvbnRlbnQgPSBwcmV2TW9udGguZ2V0VVRDRGF0ZSgpO1xuXG5cdFx0XHRcdGlmICh0aGlzLm8uYmVmb3JlU2hvd0RheSAhPT0gJC5ub29wKXtcblx0XHRcdFx0XHRiZWZvcmUgPSB0aGlzLm8uYmVmb3JlU2hvd0RheSh0aGlzLl91dGNfdG9fbG9jYWwocHJldk1vbnRoKSk7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdFx0YmVmb3JlID0ge307XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGJlZm9yZSA9PT0gJ2Jvb2xlYW4nKVxuXHRcdFx0XHRcdFx0YmVmb3JlID0ge2VuYWJsZWQ6IGJlZm9yZX07XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGJlZm9yZSA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRiZWZvcmUgPSB7Y2xhc3NlczogYmVmb3JlfTtcblx0XHRcdFx0XHRpZiAoYmVmb3JlLmVuYWJsZWQgPT09IGZhbHNlKVxuXHRcdFx0XHRcdFx0Y2xzTmFtZS5wdXNoKCdkaXNhYmxlZCcpO1xuXHRcdFx0XHRcdGlmIChiZWZvcmUuY2xhc3Nlcylcblx0XHRcdFx0XHRcdGNsc05hbWUgPSBjbHNOYW1lLmNvbmNhdChiZWZvcmUuY2xhc3Nlcy5zcGxpdCgvXFxzKy8pKTtcblx0XHRcdFx0XHRpZiAoYmVmb3JlLnRvb2x0aXApXG5cdFx0XHRcdFx0XHR0b29sdGlwID0gYmVmb3JlLnRvb2x0aXA7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZS5jb250ZW50KVxuXHRcdFx0XHRcdFx0Y29udGVudCA9IGJlZm9yZS5jb250ZW50O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9DaGVjayBpZiB1bmlxdWVTb3J0IGV4aXN0cyAoc3VwcG9ydGVkIGJ5IGpxdWVyeSA+PTEuMTIgYW5kID49Mi4yKVxuXHRcdFx0XHQvL0ZhbGxiYWNrIHRvIHVuaXF1ZSBmdW5jdGlvbiBmb3Igb2xkZXIganF1ZXJ5IHZlcnNpb25zXG5cdFx0XHRcdGlmICgkLmlzRnVuY3Rpb24oJC51bmlxdWVTb3J0KSkge1xuXHRcdFx0XHRcdGNsc05hbWUgPSAkLnVuaXF1ZVNvcnQoY2xzTmFtZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2xzTmFtZSA9ICQudW5pcXVlKGNsc05hbWUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aHRtbC5wdXNoKCc8dGQgY2xhc3M9XCInK2Nsc05hbWUuam9pbignICcpKydcIicgKyAodG9vbHRpcCA/ICcgdGl0bGU9XCInK3Rvb2x0aXArJ1wiJyA6ICcnKSArICcgZGF0YS1kYXRlPVwiJyArIHByZXZNb250aC5nZXRUaW1lKCkudG9TdHJpbmcoKSArICdcIj4nICsgY29udGVudCArICc8L3RkPicpO1xuXHRcdFx0XHR0b29sdGlwID0gbnVsbDtcblx0XHRcdFx0aWYgKHdlZWtEYXkgPT09IHRoaXMuby53ZWVrRW5kKXtcblx0XHRcdFx0XHRodG1sLnB1c2goJzwvdHI+Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cHJldk1vbnRoLnNldFVUQ0RhdGUocHJldk1vbnRoLmdldFVUQ0RhdGUoKSArIDEpO1xuXHRcdFx0fVxuXHRcdFx0dGhpcy5waWNrZXIuZmluZCgnLmRhdGVwaWNrZXItZGF5cyB0Ym9keScpLmh0bWwoaHRtbC5qb2luKCcnKSk7XG5cblx0XHRcdHZhciBtb250aHNUaXRsZSA9IGRhdGVzW3RoaXMuby5sYW5ndWFnZV0ubW9udGhzVGl0bGUgfHwgZGF0ZXNbJ2VuJ10ubW9udGhzVGl0bGUgfHwgJ01vbnRocyc7XG5cdFx0XHR2YXIgbW9udGhzID0gdGhpcy5waWNrZXIuZmluZCgnLmRhdGVwaWNrZXItbW9udGhzJylcblx0XHRcdFx0XHRcdC5maW5kKCcuZGF0ZXBpY2tlci1zd2l0Y2gnKVxuXHRcdFx0XHRcdFx0XHQudGV4dCh0aGlzLm8ubWF4Vmlld01vZGUgPCAyID8gbW9udGhzVGl0bGUgOiB5ZWFyKVxuXHRcdFx0XHRcdFx0XHQuZW5kKClcblx0XHRcdFx0XHRcdC5maW5kKCd0Ym9keSBzcGFuJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXG5cdFx0XHQkLmVhY2godGhpcy5kYXRlcywgZnVuY3Rpb24oaSwgZCl7XG5cdFx0XHRcdGlmIChkLmdldFVUQ0Z1bGxZZWFyKCkgPT09IHllYXIpXG5cdFx0XHRcdFx0bW9udGhzLmVxKGQuZ2V0VVRDTW9udGgoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdGlmICh5ZWFyIDwgc3RhcnRZZWFyIHx8IHllYXIgPiBlbmRZZWFyKXtcblx0XHRcdFx0bW9udGhzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHllYXIgPT09IHN0YXJ0WWVhcil7XG5cdFx0XHRcdG1vbnRocy5zbGljZSgwLCBzdGFydE1vbnRoKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcblx0XHRcdH1cblx0XHRcdGlmICh5ZWFyID09PSBlbmRZZWFyKXtcblx0XHRcdFx0bW9udGhzLnNsaWNlKGVuZE1vbnRoKzEpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGhpcy5vLmJlZm9yZVNob3dNb250aCAhPT0gJC5ub29wKXtcblx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0XHQkLmVhY2gobW9udGhzLCBmdW5jdGlvbihpLCBtb250aCl7XG4gICAgICAgICAgdmFyIG1vRGF0ZSA9IG5ldyBEYXRlKHllYXIsIGksIDEpO1xuICAgICAgICAgIHZhciBiZWZvcmUgPSB0aGF0Lm8uYmVmb3JlU2hvd01vbnRoKG1vRGF0ZSk7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZSA9PT0gdW5kZWZpbmVkKVxuXHRcdFx0XHRcdFx0YmVmb3JlID0ge307XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGJlZm9yZSA9PT0gJ2Jvb2xlYW4nKVxuXHRcdFx0XHRcdFx0YmVmb3JlID0ge2VuYWJsZWQ6IGJlZm9yZX07XG5cdFx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGJlZm9yZSA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdFx0XHRiZWZvcmUgPSB7Y2xhc3NlczogYmVmb3JlfTtcblx0XHRcdFx0XHRpZiAoYmVmb3JlLmVuYWJsZWQgPT09IGZhbHNlICYmICEkKG1vbnRoKS5oYXNDbGFzcygnZGlzYWJsZWQnKSlcblx0XHRcdFx0XHQgICAgJChtb250aCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZS5jbGFzc2VzKVxuXHRcdFx0XHRcdCAgICAkKG1vbnRoKS5hZGRDbGFzcyhiZWZvcmUuY2xhc3Nlcyk7XG5cdFx0XHRcdFx0aWYgKGJlZm9yZS50b29sdGlwKVxuXHRcdFx0XHRcdCAgICAkKG1vbnRoKS5wcm9wKCd0aXRsZScsIGJlZm9yZS50b29sdGlwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEdlbmVyYXRpbmcgZGVjYWRlL3llYXJzIHBpY2tlclxuXHRcdFx0dGhpcy5fZmlsbF95ZWFyc1ZpZXcoXG5cdFx0XHRcdCcuZGF0ZXBpY2tlci15ZWFycycsXG5cdFx0XHRcdCd5ZWFyJyxcblx0XHRcdFx0MTAsXG5cdFx0XHRcdHllYXIsXG5cdFx0XHRcdHN0YXJ0WWVhcixcblx0XHRcdFx0ZW5kWWVhcixcblx0XHRcdFx0dGhpcy5vLmJlZm9yZVNob3dZZWFyXG5cdFx0XHQpO1xuXG5cdFx0XHQvLyBHZW5lcmF0aW5nIGNlbnR1cnkvZGVjYWRlcyBwaWNrZXJcblx0XHRcdHRoaXMuX2ZpbGxfeWVhcnNWaWV3KFxuXHRcdFx0XHQnLmRhdGVwaWNrZXItZGVjYWRlcycsXG5cdFx0XHRcdCdkZWNhZGUnLFxuXHRcdFx0XHQxMDAsXG5cdFx0XHRcdHllYXIsXG5cdFx0XHRcdHN0YXJ0WWVhcixcblx0XHRcdFx0ZW5kWWVhcixcblx0XHRcdFx0dGhpcy5vLmJlZm9yZVNob3dEZWNhZGVcblx0XHRcdCk7XG5cblx0XHRcdC8vIEdlbmVyYXRpbmcgbWlsbGVubml1bS9jZW50dXJpZXMgcGlja2VyXG5cdFx0XHR0aGlzLl9maWxsX3llYXJzVmlldyhcblx0XHRcdFx0Jy5kYXRlcGlja2VyLWNlbnR1cmllcycsXG5cdFx0XHRcdCdjZW50dXJ5Jyxcblx0XHRcdFx0MTAwMCxcblx0XHRcdFx0eWVhcixcblx0XHRcdFx0c3RhcnRZZWFyLFxuXHRcdFx0XHRlbmRZZWFyLFxuXHRcdFx0XHR0aGlzLm8uYmVmb3JlU2hvd0NlbnR1cnlcblx0XHRcdCk7XG5cdFx0fSxcblxuXHRcdHVwZGF0ZU5hdkFycm93czogZnVuY3Rpb24oKXtcblx0XHRcdGlmICghdGhpcy5fYWxsb3dfdXBkYXRlKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdHZhciBkID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZSksXG5cdFx0XHRcdHllYXIgPSBkLmdldFVUQ0Z1bGxZZWFyKCksXG5cdFx0XHRcdG1vbnRoID0gZC5nZXRVVENNb250aCgpLFxuXHRcdFx0XHRzdGFydFllYXIgPSB0aGlzLm8uc3RhcnREYXRlICE9PSAtSW5maW5pdHkgPyB0aGlzLm8uc3RhcnREYXRlLmdldFVUQ0Z1bGxZZWFyKCkgOiAtSW5maW5pdHksXG5cdFx0XHRcdHN0YXJ0TW9udGggPSB0aGlzLm8uc3RhcnREYXRlICE9PSAtSW5maW5pdHkgPyB0aGlzLm8uc3RhcnREYXRlLmdldFVUQ01vbnRoKCkgOiAtSW5maW5pdHksXG5cdFx0XHRcdGVuZFllYXIgPSB0aGlzLm8uZW5kRGF0ZSAhPT0gSW5maW5pdHkgPyB0aGlzLm8uZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpIDogSW5maW5pdHksXG5cdFx0XHRcdGVuZE1vbnRoID0gdGhpcy5vLmVuZERhdGUgIT09IEluZmluaXR5ID8gdGhpcy5vLmVuZERhdGUuZ2V0VVRDTW9udGgoKSA6IEluZmluaXR5LFxuXHRcdFx0XHRwcmV2SXNEaXNhYmxlZCxcblx0XHRcdFx0bmV4dElzRGlzYWJsZWQsXG5cdFx0XHRcdGZhY3RvciA9IDE7XG5cdFx0XHRzd2l0Y2ggKHRoaXMudmlld01vZGUpe1xuXHRcdFx0XHRjYXNlIDQ6XG5cdFx0XHRcdFx0ZmFjdG9yICo9IDEwO1xuXHRcdFx0XHRcdC8qIGZhbGxzIHRocm91Z2ggKi9cblx0XHRcdFx0Y2FzZSAzOlxuXHRcdFx0XHRcdGZhY3RvciAqPSAxMDtcblx0XHRcdFx0XHQvKiBmYWxscyB0aHJvdWdoICovXG5cdFx0XHRcdGNhc2UgMjpcblx0XHRcdFx0XHRmYWN0b3IgKj0gMTA7XG5cdFx0XHRcdFx0LyogZmFsbHMgdGhyb3VnaCAqL1xuXHRcdFx0XHRjYXNlIDE6XG5cdFx0XHRcdFx0cHJldklzRGlzYWJsZWQgPSBNYXRoLmZsb29yKHllYXIgLyBmYWN0b3IpICogZmFjdG9yIDw9IHN0YXJ0WWVhcjtcblx0XHRcdFx0XHRuZXh0SXNEaXNhYmxlZCA9IE1hdGguZmxvb3IoeWVhciAvIGZhY3RvcikgKiBmYWN0b3IgKyBmYWN0b3IgPiBlbmRZZWFyO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDA6XG5cdFx0XHRcdFx0cHJldklzRGlzYWJsZWQgPSB5ZWFyIDw9IHN0YXJ0WWVhciAmJiBtb250aCA8PSBzdGFydE1vbnRoO1xuXHRcdFx0XHRcdG5leHRJc0Rpc2FibGVkID0geWVhciA+PSBlbmRZZWFyICYmIG1vbnRoID49IGVuZE1vbnRoO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnBpY2tlci5maW5kKCcucHJldicpLnRvZ2dsZUNsYXNzKCdkaXNhYmxlZCcsIHByZXZJc0Rpc2FibGVkKTtcblx0XHRcdHRoaXMucGlja2VyLmZpbmQoJy5uZXh0JykudG9nZ2xlQ2xhc3MoJ2Rpc2FibGVkJywgbmV4dElzRGlzYWJsZWQpO1xuXHRcdH0sXG5cblx0XHRjbGljazogZnVuY3Rpb24oZSl7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHR2YXIgdGFyZ2V0LCBkaXIsIGRheSwgeWVhciwgbW9udGg7XG5cdFx0XHR0YXJnZXQgPSAkKGUudGFyZ2V0KTtcblxuXHRcdFx0Ly8gQ2xpY2tlZCBvbiB0aGUgc3dpdGNoXG5cdFx0XHRpZiAodGFyZ2V0Lmhhc0NsYXNzKCdkYXRlcGlja2VyLXN3aXRjaCcpICYmIHRoaXMudmlld01vZGUgIT09IHRoaXMuby5tYXhWaWV3TW9kZSl7XG5cdFx0XHRcdHRoaXMuc2V0Vmlld01vZGUodGhpcy52aWV3TW9kZSArIDEpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDbGlja2VkIG9uIHRvZGF5IGJ1dHRvblxuXHRcdFx0aWYgKHRhcmdldC5oYXNDbGFzcygndG9kYXknKSAmJiAhdGFyZ2V0Lmhhc0NsYXNzKCdkYXknKSl7XG5cdFx0XHRcdHRoaXMuc2V0Vmlld01vZGUoMCk7XG5cdFx0XHRcdHRoaXMuX3NldERhdGUoVVRDVG9kYXkoKSwgdGhpcy5vLnRvZGF5QnRuID09PSAnbGlua2VkJyA/IG51bGwgOiAndmlldycpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDbGlja2VkIG9uIGNsZWFyIGJ1dHRvblxuXHRcdFx0aWYgKHRhcmdldC5oYXNDbGFzcygnY2xlYXInKSl7XG5cdFx0XHRcdHRoaXMuY2xlYXJEYXRlcygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoIXRhcmdldC5oYXNDbGFzcygnZGlzYWJsZWQnKSl7XG5cdFx0XHRcdC8vIENsaWNrZWQgb24gYSBtb250aCwgeWVhciwgZGVjYWRlLCBjZW50dXJ5XG5cdFx0XHRcdGlmICh0YXJnZXQuaGFzQ2xhc3MoJ21vbnRoJylcblx0XHRcdFx0XHRcdHx8IHRhcmdldC5oYXNDbGFzcygneWVhcicpXG5cdFx0XHRcdFx0XHR8fCB0YXJnZXQuaGFzQ2xhc3MoJ2RlY2FkZScpXG5cdFx0XHRcdFx0XHR8fCB0YXJnZXQuaGFzQ2xhc3MoJ2NlbnR1cnknKSkge1xuXHRcdFx0XHRcdHRoaXMudmlld0RhdGUuc2V0VVRDRGF0ZSgxKTtcblxuXHRcdFx0XHRcdGRheSA9IDE7XG5cdFx0XHRcdFx0aWYgKHRoaXMudmlld01vZGUgPT09IDEpe1xuXHRcdFx0XHRcdFx0bW9udGggPSB0YXJnZXQucGFyZW50KCkuZmluZCgnc3BhbicpLmluZGV4KHRhcmdldCk7XG5cdFx0XHRcdFx0XHR5ZWFyID0gdGhpcy52aWV3RGF0ZS5nZXRVVENGdWxsWWVhcigpO1xuXHRcdFx0XHRcdFx0dGhpcy52aWV3RGF0ZS5zZXRVVENNb250aChtb250aCk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdG1vbnRoID0gMDtcblx0XHRcdFx0XHRcdHllYXIgPSBOdW1iZXIodGFyZ2V0LnRleHQoKSk7XG5cdFx0XHRcdFx0XHR0aGlzLnZpZXdEYXRlLnNldFVUQ0Z1bGxZZWFyKHllYXIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHRoaXMuX3RyaWdnZXIoRFBHbG9iYWwudmlld01vZGVzW3RoaXMudmlld01vZGUgLSAxXS5lLCB0aGlzLnZpZXdEYXRlKTtcblxuXHRcdFx0XHRcdGlmICh0aGlzLnZpZXdNb2RlID09PSB0aGlzLm8ubWluVmlld01vZGUpe1xuXHRcdFx0XHRcdFx0dGhpcy5fc2V0RGF0ZShVVENEYXRlKHllYXIsIG1vbnRoLCBkYXkpKTtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhpcy5zZXRWaWV3TW9kZSh0aGlzLnZpZXdNb2RlIC0gMSk7XG5cdFx0XHRcdFx0XHR0aGlzLmZpbGwoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aWYgKHRoaXMucGlja2VyLmlzKCc6dmlzaWJsZScpICYmIHRoaXMuX2ZvY3VzZWRfZnJvbSl7XG5cdFx0XHRcdHRoaXMuX2ZvY3VzZWRfZnJvbS5mb2N1cygpO1xuXHRcdFx0fVxuXHRcdFx0ZGVsZXRlIHRoaXMuX2ZvY3VzZWRfZnJvbTtcblx0XHR9LFxuXG5cdFx0ZGF5Q2VsbENsaWNrOiBmdW5jdGlvbihlKXtcblx0XHRcdHZhciAkdGFyZ2V0ID0gJChlLmN1cnJlbnRUYXJnZXQpO1xuXHRcdFx0dmFyIHRpbWVzdGFtcCA9ICR0YXJnZXQuZGF0YSgnZGF0ZScpO1xuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSh0aW1lc3RhbXApO1xuXG5cdFx0XHRpZiAodGhpcy5vLnVwZGF0ZVZpZXdEYXRlKSB7XG5cdFx0XHRcdGlmIChkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgIT09IHRoaXMudmlld0RhdGUuZ2V0VVRDRnVsbFllYXIoKSkge1xuXHRcdFx0XHRcdHRoaXMuX3RyaWdnZXIoJ2NoYW5nZVllYXInLCB0aGlzLnZpZXdEYXRlKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkYXRlLmdldFVUQ01vbnRoKCkgIT09IHRoaXMudmlld0RhdGUuZ2V0VVRDTW9udGgoKSkge1xuXHRcdFx0XHRcdHRoaXMuX3RyaWdnZXIoJ2NoYW5nZU1vbnRoJywgdGhpcy52aWV3RGF0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMuX3NldERhdGUoZGF0ZSk7XG5cdFx0fSxcblxuXHRcdC8vIENsaWNrZWQgb24gcHJldiBvciBuZXh0XG5cdFx0bmF2QXJyb3dzQ2xpY2s6IGZ1bmN0aW9uKGUpe1xuXHRcdFx0dmFyICR0YXJnZXQgPSAkKGUuY3VycmVudFRhcmdldCk7XG5cdFx0XHR2YXIgZGlyID0gJHRhcmdldC5oYXNDbGFzcygncHJldicpID8gLTEgOiAxO1xuXHRcdFx0aWYgKHRoaXMudmlld01vZGUgIT09IDApe1xuXHRcdFx0XHRkaXIgKj0gRFBHbG9iYWwudmlld01vZGVzW3RoaXMudmlld01vZGVdLm5hdlN0ZXAgKiAxMjtcblx0XHRcdH1cblx0XHRcdHRoaXMudmlld0RhdGUgPSB0aGlzLm1vdmVNb250aCh0aGlzLnZpZXdEYXRlLCBkaXIpO1xuXHRcdFx0dGhpcy5fdHJpZ2dlcihEUEdsb2JhbC52aWV3TW9kZXNbdGhpcy52aWV3TW9kZV0uZSwgdGhpcy52aWV3RGF0ZSk7XG5cdFx0XHR0aGlzLmZpbGwoKTtcblx0XHR9LFxuXG5cdFx0X3RvZ2dsZV9tdWx0aWRhdGU6IGZ1bmN0aW9uKGRhdGUpe1xuXHRcdFx0dmFyIGl4ID0gdGhpcy5kYXRlcy5jb250YWlucyhkYXRlKTtcblx0XHRcdGlmICghZGF0ZSl7XG5cdFx0XHRcdHRoaXMuZGF0ZXMuY2xlYXIoKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGl4ICE9PSAtMSl7XG5cdFx0XHRcdGlmICh0aGlzLm8ubXVsdGlkYXRlID09PSB0cnVlIHx8IHRoaXMuby5tdWx0aWRhdGUgPiAxIHx8IHRoaXMuby50b2dnbGVBY3RpdmUpe1xuXHRcdFx0XHRcdHRoaXMuZGF0ZXMucmVtb3ZlKGl4KTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLm8ubXVsdGlkYXRlID09PSBmYWxzZSkge1xuXHRcdFx0XHR0aGlzLmRhdGVzLmNsZWFyKCk7XG5cdFx0XHRcdHRoaXMuZGF0ZXMucHVzaChkYXRlKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0aGlzLmRhdGVzLnB1c2goZGF0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy5vLm11bHRpZGF0ZSA9PT0gJ251bWJlcicpXG5cdFx0XHRcdHdoaWxlICh0aGlzLmRhdGVzLmxlbmd0aCA+IHRoaXMuby5tdWx0aWRhdGUpXG5cdFx0XHRcdFx0dGhpcy5kYXRlcy5yZW1vdmUoMCk7XG5cdFx0fSxcblxuXHRcdF9zZXREYXRlOiBmdW5jdGlvbihkYXRlLCB3aGljaCl7XG5cdFx0XHRpZiAoIXdoaWNoIHx8IHdoaWNoID09PSAnZGF0ZScpXG5cdFx0XHRcdHRoaXMuX3RvZ2dsZV9tdWx0aWRhdGUoZGF0ZSAmJiBuZXcgRGF0ZShkYXRlKSk7XG5cdFx0XHRpZiAoKCF3aGljaCAmJiB0aGlzLm8udXBkYXRlVmlld0RhdGUpIHx8IHdoaWNoID09PSAndmlldycpXG5cdFx0XHRcdHRoaXMudmlld0RhdGUgPSBkYXRlICYmIG5ldyBEYXRlKGRhdGUpO1xuXG5cdFx0XHR0aGlzLmZpbGwoKTtcblx0XHRcdHRoaXMuc2V0VmFsdWUoKTtcblx0XHRcdGlmICghd2hpY2ggfHwgd2hpY2ggIT09ICd2aWV3Jykge1xuXHRcdFx0XHR0aGlzLl90cmlnZ2VyKCdjaGFuZ2VEYXRlJyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLmlucHV0RmllbGQudHJpZ2dlcignY2hhbmdlJyk7XG5cdFx0XHRpZiAodGhpcy5vLmF1dG9jbG9zZSAmJiAoIXdoaWNoIHx8IHdoaWNoID09PSAnZGF0ZScpKXtcblx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdG1vdmVEYXk6IGZ1bmN0aW9uKGRhdGUsIGRpcil7XG5cdFx0XHR2YXIgbmV3RGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuXHRcdFx0bmV3RGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgZGlyKTtcblxuXHRcdFx0cmV0dXJuIG5ld0RhdGU7XG5cdFx0fSxcblxuXHRcdG1vdmVXZWVrOiBmdW5jdGlvbihkYXRlLCBkaXIpe1xuXHRcdFx0cmV0dXJuIHRoaXMubW92ZURheShkYXRlLCBkaXIgKiA3KTtcblx0XHR9LFxuXG5cdFx0bW92ZU1vbnRoOiBmdW5jdGlvbihkYXRlLCBkaXIpe1xuXHRcdFx0aWYgKCFpc1ZhbGlkRGF0ZShkYXRlKSlcblx0XHRcdFx0cmV0dXJuIHRoaXMuby5kZWZhdWx0Vmlld0RhdGU7XG5cdFx0XHRpZiAoIWRpcilcblx0XHRcdFx0cmV0dXJuIGRhdGU7XG5cdFx0XHR2YXIgbmV3X2RhdGUgPSBuZXcgRGF0ZShkYXRlLnZhbHVlT2YoKSksXG5cdFx0XHRcdGRheSA9IG5ld19kYXRlLmdldFVUQ0RhdGUoKSxcblx0XHRcdFx0bW9udGggPSBuZXdfZGF0ZS5nZXRVVENNb250aCgpLFxuXHRcdFx0XHRtYWcgPSBNYXRoLmFicyhkaXIpLFxuXHRcdFx0XHRuZXdfbW9udGgsIHRlc3Q7XG5cdFx0XHRkaXIgPSBkaXIgPiAwID8gMSA6IC0xO1xuXHRcdFx0aWYgKG1hZyA9PT0gMSl7XG5cdFx0XHRcdHRlc3QgPSBkaXIgPT09IC0xXG5cdFx0XHRcdFx0Ly8gSWYgZ29pbmcgYmFjayBvbmUgbW9udGgsIG1ha2Ugc3VyZSBtb250aCBpcyBub3QgY3VycmVudCBtb250aFxuXHRcdFx0XHRcdC8vIChlZywgTWFyIDMxIC0+IEZlYiAzMSA9PSBGZWIgMjgsIG5vdCBNYXIgMDIpXG5cdFx0XHRcdFx0PyBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIG5ld19kYXRlLmdldFVUQ01vbnRoKCkgPT09IG1vbnRoO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvLyBJZiBnb2luZyBmb3J3YXJkIG9uZSBtb250aCwgbWFrZSBzdXJlIG1vbnRoIGlzIGFzIGV4cGVjdGVkXG5cdFx0XHRcdFx0Ly8gKGVnLCBKYW4gMzEgLT4gRmViIDMxID09IEZlYiAyOCwgbm90IE1hciAwMilcblx0XHRcdFx0XHQ6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbmV3X2RhdGUuZ2V0VVRDTW9udGgoKSAhPT0gbmV3X21vbnRoO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdG5ld19tb250aCA9IG1vbnRoICsgZGlyO1xuXHRcdFx0XHRuZXdfZGF0ZS5zZXRVVENNb250aChuZXdfbW9udGgpO1xuXHRcdFx0XHQvLyBEZWMgLT4gSmFuICgxMikgb3IgSmFuIC0+IERlYyAoLTEpIC0tIGxpbWl0IGV4cGVjdGVkIGRhdGUgdG8gMC0xMVxuXHRcdFx0XHRuZXdfbW9udGggPSAobmV3X21vbnRoICsgMTIpICUgMTI7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gRm9yIG1hZ25pdHVkZXMgPjEsIG1vdmUgb25lIG1vbnRoIGF0IGEgdGltZS4uLlxuXHRcdFx0XHRmb3IgKHZhciBpPTA7IGkgPCBtYWc7IGkrKylcblx0XHRcdFx0XHQvLyAuLi53aGljaCBtaWdodCBkZWNyZWFzZSB0aGUgZGF5IChlZywgSmFuIDMxIHRvIEZlYiAyOCwgZXRjKS4uLlxuXHRcdFx0XHRcdG5ld19kYXRlID0gdGhpcy5tb3ZlTW9udGgobmV3X2RhdGUsIGRpcik7XG5cdFx0XHRcdC8vIC4uLnRoZW4gcmVzZXQgdGhlIGRheSwga2VlcGluZyBpdCBpbiB0aGUgbmV3IG1vbnRoXG5cdFx0XHRcdG5ld19tb250aCA9IG5ld19kYXRlLmdldFVUQ01vbnRoKCk7XG5cdFx0XHRcdG5ld19kYXRlLnNldFVUQ0RhdGUoZGF5KTtcblx0XHRcdFx0dGVzdCA9IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0cmV0dXJuIG5ld19tb250aCAhPT0gbmV3X2RhdGUuZ2V0VVRDTW9udGgoKTtcblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHRcdC8vIENvbW1vbiBkYXRlLXJlc2V0dGluZyBsb29wIC0tIGlmIGRhdGUgaXMgYmV5b25kIGVuZCBvZiBtb250aCwgbWFrZSBpdFxuXHRcdFx0Ly8gZW5kIG9mIG1vbnRoXG5cdFx0XHR3aGlsZSAodGVzdCgpKXtcblx0XHRcdFx0bmV3X2RhdGUuc2V0VVRDRGF0ZSgtLWRheSk7XG5cdFx0XHRcdG5ld19kYXRlLnNldFVUQ01vbnRoKG5ld19tb250aCk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbmV3X2RhdGU7XG5cdFx0fSxcblxuXHRcdG1vdmVZZWFyOiBmdW5jdGlvbihkYXRlLCBkaXIpe1xuXHRcdFx0cmV0dXJuIHRoaXMubW92ZU1vbnRoKGRhdGUsIGRpcioxMik7XG5cdFx0fSxcblxuXHRcdG1vdmVBdmFpbGFibGVEYXRlOiBmdW5jdGlvbihkYXRlLCBkaXIsIGZuKXtcblx0XHRcdGRvIHtcblx0XHRcdFx0ZGF0ZSA9IHRoaXNbZm5dKGRhdGUsIGRpcik7XG5cblx0XHRcdFx0aWYgKCF0aGlzLmRhdGVXaXRoaW5SYW5nZShkYXRlKSlcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0Zm4gPSAnbW92ZURheSc7XG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAodGhpcy5kYXRlSXNEaXNhYmxlZChkYXRlKSk7XG5cblx0XHRcdHJldHVybiBkYXRlO1xuXHRcdH0sXG5cblx0XHR3ZWVrT2ZEYXRlSXNEaXNhYmxlZDogZnVuY3Rpb24oZGF0ZSl7XG5cdFx0XHRyZXR1cm4gJC5pbkFycmF5KGRhdGUuZ2V0VVRDRGF5KCksIHRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQpICE9PSAtMTtcblx0XHR9LFxuXG5cdFx0ZGF0ZUlzRGlzYWJsZWQ6IGZ1bmN0aW9uKGRhdGUpe1xuXHRcdFx0cmV0dXJuIChcblx0XHRcdFx0dGhpcy53ZWVrT2ZEYXRlSXNEaXNhYmxlZChkYXRlKSB8fFxuXHRcdFx0XHQkLmdyZXAodGhpcy5vLmRhdGVzRGlzYWJsZWQsIGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRcdHJldHVybiBpc1VUQ0VxdWFscyhkYXRlLCBkKTtcblx0XHRcdFx0fSkubGVuZ3RoID4gMFxuXHRcdFx0KTtcblx0XHR9LFxuXG5cdFx0ZGF0ZVdpdGhpblJhbmdlOiBmdW5jdGlvbihkYXRlKXtcblx0XHRcdHJldHVybiBkYXRlID49IHRoaXMuby5zdGFydERhdGUgJiYgZGF0ZSA8PSB0aGlzLm8uZW5kRGF0ZTtcblx0XHR9LFxuXG5cdFx0a2V5ZG93bjogZnVuY3Rpb24oZSl7XG5cdFx0XHRpZiAoIXRoaXMucGlja2VyLmlzKCc6dmlzaWJsZScpKXtcblx0XHRcdFx0aWYgKGUua2V5Q29kZSA9PT0gNDAgfHwgZS5rZXlDb2RlID09PSAyNykgeyAvLyBhbGxvdyBkb3duIHRvIHJlLXNob3cgcGlja2VyXG5cdFx0XHRcdFx0dGhpcy5zaG93KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGF0ZUNoYW5nZWQgPSBmYWxzZSxcblx0XHRcdFx0ZGlyLCBuZXdWaWV3RGF0ZSxcblx0XHRcdFx0Zm9jdXNEYXRlID0gdGhpcy5mb2N1c0RhdGUgfHwgdGhpcy52aWV3RGF0ZTtcblx0XHRcdHN3aXRjaCAoZS5rZXlDb2RlKXtcblx0XHRcdFx0Y2FzZSAyNzogLy8gZXNjYXBlXG5cdFx0XHRcdFx0aWYgKHRoaXMuZm9jdXNEYXRlKXtcblx0XHRcdFx0XHRcdHRoaXMuZm9jdXNEYXRlID0gbnVsbDtcblx0XHRcdFx0XHRcdHRoaXMudmlld0RhdGUgPSB0aGlzLmRhdGVzLmdldCgtMSkgfHwgdGhpcy52aWV3RGF0ZTtcblx0XHRcdFx0XHRcdHRoaXMuZmlsbCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHR0aGlzLmhpZGUoKTtcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAzNzogLy8gbGVmdFxuXHRcdFx0XHRjYXNlIDM4OiAvLyB1cFxuXHRcdFx0XHRjYXNlIDM5OiAvLyByaWdodFxuXHRcdFx0XHRjYXNlIDQwOiAvLyBkb3duXG5cdFx0XHRcdFx0aWYgKCF0aGlzLm8ua2V5Ym9hcmROYXZpZ2F0aW9uIHx8IHRoaXMuby5kYXlzT2ZXZWVrRGlzYWJsZWQubGVuZ3RoID09PSA3KVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGlyID0gZS5rZXlDb2RlID09PSAzNyB8fCBlLmtleUNvZGUgPT09IDM4ID8gLTEgOiAxO1xuICAgICAgICAgIGlmICh0aGlzLnZpZXdNb2RlID09PSAwKSB7XG4gIFx0XHRcdFx0XHRpZiAoZS5jdHJsS2V5KXtcbiAgXHRcdFx0XHRcdFx0bmV3Vmlld0RhdGUgPSB0aGlzLm1vdmVBdmFpbGFibGVEYXRlKGZvY3VzRGF0ZSwgZGlyLCAnbW92ZVllYXInKTtcblxuICBcdFx0XHRcdFx0XHRpZiAobmV3Vmlld0RhdGUpXG4gIFx0XHRcdFx0XHRcdFx0dGhpcy5fdHJpZ2dlcignY2hhbmdlWWVhcicsIHRoaXMudmlld0RhdGUpO1xuICBcdFx0XHRcdFx0fSBlbHNlIGlmIChlLnNoaWZ0S2V5KXtcbiAgXHRcdFx0XHRcdFx0bmV3Vmlld0RhdGUgPSB0aGlzLm1vdmVBdmFpbGFibGVEYXRlKGZvY3VzRGF0ZSwgZGlyLCAnbW92ZU1vbnRoJyk7XG5cbiAgXHRcdFx0XHRcdFx0aWYgKG5ld1ZpZXdEYXRlKVxuICBcdFx0XHRcdFx0XHRcdHRoaXMuX3RyaWdnZXIoJ2NoYW5nZU1vbnRoJywgdGhpcy52aWV3RGF0ZSk7XG4gIFx0XHRcdFx0XHR9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gMzcgfHwgZS5rZXlDb2RlID09PSAzOSl7XG4gIFx0XHRcdFx0XHRcdG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShmb2N1c0RhdGUsIGRpciwgJ21vdmVEYXknKTtcbiAgXHRcdFx0XHRcdH0gZWxzZSBpZiAoIXRoaXMud2Vla09mRGF0ZUlzRGlzYWJsZWQoZm9jdXNEYXRlKSl7XG4gIFx0XHRcdFx0XHRcdG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShmb2N1c0RhdGUsIGRpciwgJ21vdmVXZWVrJyk7XG4gIFx0XHRcdFx0XHR9XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnZpZXdNb2RlID09PSAxKSB7XG4gICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAzOCB8fCBlLmtleUNvZGUgPT09IDQwKSB7XG4gICAgICAgICAgICAgIGRpciA9IGRpciAqIDQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdWaWV3RGF0ZSA9IHRoaXMubW92ZUF2YWlsYWJsZURhdGUoZm9jdXNEYXRlLCBkaXIsICdtb3ZlTW9udGgnKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMudmlld01vZGUgPT09IDIpIHtcbiAgICAgICAgICAgIGlmIChlLmtleUNvZGUgPT09IDM4IHx8IGUua2V5Q29kZSA9PT0gNDApIHtcbiAgICAgICAgICAgICAgZGlyID0gZGlyICogNDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlQXZhaWxhYmxlRGF0ZShmb2N1c0RhdGUsIGRpciwgJ21vdmVZZWFyJyk7XG4gICAgICAgICAgfVxuXHRcdFx0XHRcdGlmIChuZXdWaWV3RGF0ZSl7XG5cdFx0XHRcdFx0XHR0aGlzLmZvY3VzRGF0ZSA9IHRoaXMudmlld0RhdGUgPSBuZXdWaWV3RGF0ZTtcblx0XHRcdFx0XHRcdHRoaXMuc2V0VmFsdWUoKTtcblx0XHRcdFx0XHRcdHRoaXMuZmlsbCgpO1xuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSAxMzogLy8gZW50ZXJcblx0XHRcdFx0XHRpZiAoIXRoaXMuby5mb3JjZVBhcnNlKVxuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0Zm9jdXNEYXRlID0gdGhpcy5mb2N1c0RhdGUgfHwgdGhpcy5kYXRlcy5nZXQoLTEpIHx8IHRoaXMudmlld0RhdGU7XG5cdFx0XHRcdFx0aWYgKHRoaXMuby5rZXlib2FyZE5hdmlnYXRpb24pIHtcblx0XHRcdFx0XHRcdHRoaXMuX3RvZ2dsZV9tdWx0aWRhdGUoZm9jdXNEYXRlKTtcblx0XHRcdFx0XHRcdGRhdGVDaGFuZ2VkID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dGhpcy5mb2N1c0RhdGUgPSBudWxsO1xuXHRcdFx0XHRcdHRoaXMudmlld0RhdGUgPSB0aGlzLmRhdGVzLmdldCgtMSkgfHwgdGhpcy52aWV3RGF0ZTtcblx0XHRcdFx0XHR0aGlzLnNldFZhbHVlKCk7XG5cdFx0XHRcdFx0dGhpcy5maWxsKCk7XG5cdFx0XHRcdFx0aWYgKHRoaXMucGlja2VyLmlzKCc6dmlzaWJsZScpKXtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHRcdFx0XHRpZiAodGhpcy5vLmF1dG9jbG9zZSlcblx0XHRcdFx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIDk6IC8vIHRhYlxuXHRcdFx0XHRcdHRoaXMuZm9jdXNEYXRlID0gbnVsbDtcblx0XHRcdFx0XHR0aGlzLnZpZXdEYXRlID0gdGhpcy5kYXRlcy5nZXQoLTEpIHx8IHRoaXMudmlld0RhdGU7XG5cdFx0XHRcdFx0dGhpcy5maWxsKCk7XG5cdFx0XHRcdFx0dGhpcy5oaWRlKCk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZGF0ZUNoYW5nZWQpe1xuXHRcdFx0XHRpZiAodGhpcy5kYXRlcy5sZW5ndGgpXG5cdFx0XHRcdFx0dGhpcy5fdHJpZ2dlcignY2hhbmdlRGF0ZScpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0dGhpcy5fdHJpZ2dlcignY2xlYXJEYXRlJyk7XG5cdFx0XHRcdHRoaXMuaW5wdXRGaWVsZC50cmlnZ2VyKCdjaGFuZ2UnKTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0c2V0Vmlld01vZGU6IGZ1bmN0aW9uKHZpZXdNb2RlKXtcblx0XHRcdHRoaXMudmlld01vZGUgPSB2aWV3TW9kZTtcblx0XHRcdHRoaXMucGlja2VyXG5cdFx0XHRcdC5jaGlsZHJlbignZGl2Jylcblx0XHRcdFx0LmhpZGUoKVxuXHRcdFx0XHQuZmlsdGVyKCcuZGF0ZXBpY2tlci0nICsgRFBHbG9iYWwudmlld01vZGVzW3RoaXMudmlld01vZGVdLmNsc05hbWUpXG5cdFx0XHRcdFx0LnNob3coKTtcblx0XHRcdHRoaXMudXBkYXRlTmF2QXJyb3dzKCk7XG4gICAgICB0aGlzLl90cmlnZ2VyKCdjaGFuZ2VWaWV3TW9kZScsIG5ldyBEYXRlKHRoaXMudmlld0RhdGUpKTtcblx0XHR9XG5cdH07XG5cblx0dmFyIERhdGVSYW5nZVBpY2tlciA9IGZ1bmN0aW9uKGVsZW1lbnQsIG9wdGlvbnMpe1xuXHRcdCQuZGF0YShlbGVtZW50LCAnZGF0ZXBpY2tlcicsIHRoaXMpO1xuXHRcdHRoaXMuZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cdFx0dGhpcy5pbnB1dHMgPSAkLm1hcChvcHRpb25zLmlucHV0cywgZnVuY3Rpb24oaSl7XG5cdFx0XHRyZXR1cm4gaS5qcXVlcnkgPyBpWzBdIDogaTtcblx0XHR9KTtcblx0XHRkZWxldGUgb3B0aW9ucy5pbnB1dHM7XG5cblx0XHR0aGlzLmtlZXBFbXB0eVZhbHVlcyA9IG9wdGlvbnMua2VlcEVtcHR5VmFsdWVzO1xuXHRcdGRlbGV0ZSBvcHRpb25zLmtlZXBFbXB0eVZhbHVlcztcblxuXHRcdGRhdGVwaWNrZXJQbHVnaW4uY2FsbCgkKHRoaXMuaW5wdXRzKSwgb3B0aW9ucylcblx0XHRcdC5vbignY2hhbmdlRGF0ZScsICQucHJveHkodGhpcy5kYXRlVXBkYXRlZCwgdGhpcykpO1xuXG5cdFx0dGhpcy5waWNrZXJzID0gJC5tYXAodGhpcy5pbnB1dHMsIGZ1bmN0aW9uKGkpe1xuXHRcdFx0cmV0dXJuICQuZGF0YShpLCAnZGF0ZXBpY2tlcicpO1xuXHRcdH0pO1xuXHRcdHRoaXMudXBkYXRlRGF0ZXMoKTtcblx0fTtcblx0RGF0ZVJhbmdlUGlja2VyLnByb3RvdHlwZSA9IHtcblx0XHR1cGRhdGVEYXRlczogZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMuZGF0ZXMgPSAkLm1hcCh0aGlzLnBpY2tlcnMsIGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHRyZXR1cm4gaS5nZXRVVENEYXRlKCk7XG5cdFx0XHR9KTtcblx0XHRcdHRoaXMudXBkYXRlUmFuZ2VzKCk7XG5cdFx0fSxcblx0XHR1cGRhdGVSYW5nZXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgcmFuZ2UgPSAkLm1hcCh0aGlzLmRhdGVzLCBmdW5jdGlvbihkKXtcblx0XHRcdFx0cmV0dXJuIGQudmFsdWVPZigpO1xuXHRcdFx0fSk7XG5cdFx0XHQkLmVhY2godGhpcy5waWNrZXJzLCBmdW5jdGlvbihpLCBwKXtcblx0XHRcdFx0cC5zZXRSYW5nZShyYW5nZSk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGNsZWFyRGF0ZXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHQkLmVhY2godGhpcy5waWNrZXJzLCBmdW5jdGlvbihpLCBwKXtcblx0XHRcdFx0cC5jbGVhckRhdGVzKCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGRhdGVVcGRhdGVkOiBmdW5jdGlvbihlKXtcblx0XHRcdC8vIGB0aGlzLnVwZGF0aW5nYCBpcyBhIHdvcmthcm91bmQgZm9yIHByZXZlbnRpbmcgaW5maW5pdGUgcmVjdXJzaW9uXG5cdFx0XHQvLyBiZXR3ZWVuIGBjaGFuZ2VEYXRlYCB0cmlnZ2VyaW5nIGFuZCBgc2V0VVRDRGF0ZWAgY2FsbGluZy4gIFVudGlsXG5cdFx0XHQvLyB0aGVyZSBpcyBhIGJldHRlciBtZWNoYW5pc20uXG5cdFx0XHRpZiAodGhpcy51cGRhdGluZylcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dGhpcy51cGRhdGluZyA9IHRydWU7XG5cblx0XHRcdHZhciBkcCA9ICQuZGF0YShlLnRhcmdldCwgJ2RhdGVwaWNrZXInKTtcblxuXHRcdFx0aWYgKGRwID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgbmV3X2RhdGUgPSBkcC5nZXRVVENEYXRlKCksXG5cdFx0XHRcdGtlZXBfZW1wdHlfdmFsdWVzID0gdGhpcy5rZWVwRW1wdHlWYWx1ZXMsXG5cdFx0XHRcdGkgPSAkLmluQXJyYXkoZS50YXJnZXQsIHRoaXMuaW5wdXRzKSxcblx0XHRcdFx0aiA9IGkgLSAxLFxuXHRcdFx0XHRrID0gaSArIDEsXG5cdFx0XHRcdGwgPSB0aGlzLmlucHV0cy5sZW5ndGg7XG5cdFx0XHRpZiAoaSA9PT0gLTEpXG5cdFx0XHRcdHJldHVybjtcblxuXHRcdFx0JC5lYWNoKHRoaXMucGlja2VycywgZnVuY3Rpb24oaSwgcCl7XG5cdFx0XHRcdGlmICghcC5nZXRVVENEYXRlKCkgJiYgKHAgPT09IGRwIHx8ICFrZWVwX2VtcHR5X3ZhbHVlcykpXG5cdFx0XHRcdFx0cC5zZXRVVENEYXRlKG5ld19kYXRlKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAobmV3X2RhdGUgPCB0aGlzLmRhdGVzW2pdKXtcblx0XHRcdFx0Ly8gRGF0ZSBiZWluZyBtb3ZlZCBlYXJsaWVyL2xlZnRcblx0XHRcdFx0d2hpbGUgKGogPj0gMCAmJiBuZXdfZGF0ZSA8IHRoaXMuZGF0ZXNbal0pe1xuXHRcdFx0XHRcdHRoaXMucGlja2Vyc1tqLS1dLnNldFVUQ0RhdGUobmV3X2RhdGUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKG5ld19kYXRlID4gdGhpcy5kYXRlc1trXSl7XG5cdFx0XHRcdC8vIERhdGUgYmVpbmcgbW92ZWQgbGF0ZXIvcmlnaHRcblx0XHRcdFx0d2hpbGUgKGsgPCBsICYmIG5ld19kYXRlID4gdGhpcy5kYXRlc1trXSl7XG5cdFx0XHRcdFx0dGhpcy5waWNrZXJzW2srK10uc2V0VVRDRGF0ZShuZXdfZGF0ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHRoaXMudXBkYXRlRGF0ZXMoKTtcblxuXHRcdFx0ZGVsZXRlIHRoaXMudXBkYXRpbmc7XG5cdFx0fSxcblx0XHRkZXN0cm95OiBmdW5jdGlvbigpe1xuXHRcdFx0JC5tYXAodGhpcy5waWNrZXJzLCBmdW5jdGlvbihwKXsgcC5kZXN0cm95KCk7IH0pO1xuXHRcdFx0JCh0aGlzLmlucHV0cykub2ZmKCdjaGFuZ2VEYXRlJywgdGhpcy5kYXRlVXBkYXRlZCk7XG5cdFx0XHRkZWxldGUgdGhpcy5lbGVtZW50LmRhdGEoKS5kYXRlcGlja2VyO1xuXHRcdH0sXG5cdFx0cmVtb3ZlOiBhbGlhcygnZGVzdHJveScsICdNZXRob2QgYHJlbW92ZWAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIGluIHZlcnNpb24gMi4wLiBVc2UgYGRlc3Ryb3lgIGluc3RlYWQnKVxuXHR9O1xuXG5cdGZ1bmN0aW9uIG9wdHNfZnJvbV9lbChlbCwgcHJlZml4KXtcblx0XHQvLyBEZXJpdmUgb3B0aW9ucyBmcm9tIGVsZW1lbnQgZGF0YS1hdHRyc1xuXHRcdHZhciBkYXRhID0gJChlbCkuZGF0YSgpLFxuXHRcdFx0b3V0ID0ge30sIGlua2V5LFxuXHRcdFx0cmVwbGFjZSA9IG5ldyBSZWdFeHAoJ14nICsgcHJlZml4LnRvTG93ZXJDYXNlKCkgKyAnKFtBLVpdKScpO1xuXHRcdHByZWZpeCA9IG5ldyBSZWdFeHAoJ14nICsgcHJlZml4LnRvTG93ZXJDYXNlKCkpO1xuXHRcdGZ1bmN0aW9uIHJlX2xvd2VyKF8sYSl7XG5cdFx0XHRyZXR1cm4gYS50b0xvd2VyQ2FzZSgpO1xuXHRcdH1cblx0XHRmb3IgKHZhciBrZXkgaW4gZGF0YSlcblx0XHRcdGlmIChwcmVmaXgudGVzdChrZXkpKXtcblx0XHRcdFx0aW5rZXkgPSBrZXkucmVwbGFjZShyZXBsYWNlLCByZV9sb3dlcik7XG5cdFx0XHRcdG91dFtpbmtleV0gPSBkYXRhW2tleV07XG5cdFx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fVxuXG5cdGZ1bmN0aW9uIG9wdHNfZnJvbV9sb2NhbGUobGFuZyl7XG5cdFx0Ly8gRGVyaXZlIG9wdGlvbnMgZnJvbSBsb2NhbGUgcGx1Z2luc1xuXHRcdHZhciBvdXQgPSB7fTtcblx0XHQvLyBDaGVjayBpZiBcImRlLURFXCIgc3R5bGUgZGF0ZSBpcyBhdmFpbGFibGUsIGlmIG5vdCBsYW5ndWFnZSBzaG91bGRcblx0XHQvLyBmYWxsYmFjayB0byAyIGxldHRlciBjb2RlIGVnIFwiZGVcIlxuXHRcdGlmICghZGF0ZXNbbGFuZ10pe1xuXHRcdFx0bGFuZyA9IGxhbmcuc3BsaXQoJy0nKVswXTtcblx0XHRcdGlmICghZGF0ZXNbbGFuZ10pXG5cdFx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIGQgPSBkYXRlc1tsYW5nXTtcblx0XHQkLmVhY2gobG9jYWxlX29wdHMsIGZ1bmN0aW9uKGksayl7XG5cdFx0XHRpZiAoayBpbiBkKVxuXHRcdFx0XHRvdXRba10gPSBkW2tdO1xuXHRcdH0pO1xuXHRcdHJldHVybiBvdXQ7XG5cdH1cblxuXHR2YXIgb2xkID0gJC5mbi5kYXRlcGlja2VyO1xuXHR2YXIgZGF0ZXBpY2tlclBsdWdpbiA9IGZ1bmN0aW9uKG9wdGlvbil7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuXHRcdGFyZ3Muc2hpZnQoKTtcblx0XHR2YXIgaW50ZXJuYWxfcmV0dXJuO1xuXHRcdHRoaXMuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdFx0ZGF0YSA9ICR0aGlzLmRhdGEoJ2RhdGVwaWNrZXInKSxcblx0XHRcdFx0b3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT09ICdvYmplY3QnICYmIG9wdGlvbjtcblx0XHRcdGlmICghZGF0YSl7XG5cdFx0XHRcdHZhciBlbG9wdHMgPSBvcHRzX2Zyb21fZWwodGhpcywgJ2RhdGUnKSxcblx0XHRcdFx0XHQvLyBQcmVsaW1pbmFyeSBvdGlvbnNcblx0XHRcdFx0XHR4b3B0cyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgZWxvcHRzLCBvcHRpb25zKSxcblx0XHRcdFx0XHRsb2NvcHRzID0gb3B0c19mcm9tX2xvY2FsZSh4b3B0cy5sYW5ndWFnZSksXG5cdFx0XHRcdFx0Ly8gT3B0aW9ucyBwcmlvcml0eToganMgYXJncywgZGF0YS1hdHRycywgbG9jYWxlcywgZGVmYXVsdHNcblx0XHRcdFx0XHRvcHRzID0gJC5leHRlbmQoe30sIGRlZmF1bHRzLCBsb2NvcHRzLCBlbG9wdHMsIG9wdGlvbnMpO1xuXHRcdFx0XHRpZiAoJHRoaXMuaGFzQ2xhc3MoJ2lucHV0LWRhdGVyYW5nZScpIHx8IG9wdHMuaW5wdXRzKXtcblx0XHRcdFx0XHQkLmV4dGVuZChvcHRzLCB7XG5cdFx0XHRcdFx0XHRpbnB1dHM6IG9wdHMuaW5wdXRzIHx8ICR0aGlzLmZpbmQoJ2lucHV0JykudG9BcnJheSgpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBEYXRlUmFuZ2VQaWNrZXIodGhpcywgb3B0cyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZGF0YSA9IG5ldyBEYXRlcGlja2VyKHRoaXMsIG9wdHMpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdCR0aGlzLmRhdGEoJ2RhdGVwaWNrZXInLCBkYXRhKTtcblx0XHRcdH1cblx0XHRcdGlmICh0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgZGF0YVtvcHRpb25dID09PSAnZnVuY3Rpb24nKXtcblx0XHRcdFx0aW50ZXJuYWxfcmV0dXJuID0gZGF0YVtvcHRpb25dLmFwcGx5KGRhdGEsIGFyZ3MpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0aWYgKFxuXHRcdFx0aW50ZXJuYWxfcmV0dXJuID09PSB1bmRlZmluZWQgfHxcblx0XHRcdGludGVybmFsX3JldHVybiBpbnN0YW5jZW9mIERhdGVwaWNrZXIgfHxcblx0XHRcdGludGVybmFsX3JldHVybiBpbnN0YW5jZW9mIERhdGVSYW5nZVBpY2tlclxuXHRcdClcblx0XHRcdHJldHVybiB0aGlzO1xuXG5cdFx0aWYgKHRoaXMubGVuZ3RoID4gMSlcblx0XHRcdHRocm93IG5ldyBFcnJvcignVXNpbmcgb25seSBhbGxvd2VkIGZvciB0aGUgY29sbGVjdGlvbiBvZiBhIHNpbmdsZSBlbGVtZW50ICgnICsgb3B0aW9uICsgJyBmdW5jdGlvbiknKTtcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gaW50ZXJuYWxfcmV0dXJuO1xuXHR9O1xuXHQkLmZuLmRhdGVwaWNrZXIgPSBkYXRlcGlja2VyUGx1Z2luO1xuXG5cdHZhciBkZWZhdWx0cyA9ICQuZm4uZGF0ZXBpY2tlci5kZWZhdWx0cyA9IHtcblx0XHRhc3N1bWVOZWFyYnlZZWFyOiBmYWxzZSxcblx0XHRhdXRvY2xvc2U6IGZhbHNlLFxuXHRcdGJlZm9yZVNob3dEYXk6ICQubm9vcCxcblx0XHRiZWZvcmVTaG93TW9udGg6ICQubm9vcCxcblx0XHRiZWZvcmVTaG93WWVhcjogJC5ub29wLFxuXHRcdGJlZm9yZVNob3dEZWNhZGU6ICQubm9vcCxcblx0XHRiZWZvcmVTaG93Q2VudHVyeTogJC5ub29wLFxuXHRcdGNhbGVuZGFyV2Vla3M6IGZhbHNlLFxuXHRcdGNsZWFyQnRuOiBmYWxzZSxcblx0XHR0b2dnbGVBY3RpdmU6IGZhbHNlLFxuXHRcdGRheXNPZldlZWtEaXNhYmxlZDogW10sXG5cdFx0ZGF5c09mV2Vla0hpZ2hsaWdodGVkOiBbXSxcblx0XHRkYXRlc0Rpc2FibGVkOiBbXSxcblx0XHRlbmREYXRlOiBJbmZpbml0eSxcblx0XHRmb3JjZVBhcnNlOiB0cnVlLFxuXHRcdGZvcm1hdDogJ21tL2RkL3l5eXknLFxuXHRcdGtlZXBFbXB0eVZhbHVlczogZmFsc2UsXG5cdFx0a2V5Ym9hcmROYXZpZ2F0aW9uOiB0cnVlLFxuXHRcdGxhbmd1YWdlOiAnZW4nLFxuXHRcdG1pblZpZXdNb2RlOiAwLFxuXHRcdG1heFZpZXdNb2RlOiA0LFxuXHRcdG11bHRpZGF0ZTogZmFsc2UsXG5cdFx0bXVsdGlkYXRlU2VwYXJhdG9yOiAnLCcsXG5cdFx0b3JpZW50YXRpb246IFwiYXV0b1wiLFxuXHRcdHJ0bDogZmFsc2UsXG5cdFx0c3RhcnREYXRlOiAtSW5maW5pdHksXG5cdFx0c3RhcnRWaWV3OiAwLFxuXHRcdHRvZGF5QnRuOiBmYWxzZSxcblx0XHR0b2RheUhpZ2hsaWdodDogZmFsc2UsXG5cdFx0dXBkYXRlVmlld0RhdGU6IHRydWUsXG5cdFx0d2Vla1N0YXJ0OiAwLFxuXHRcdGRpc2FibGVUb3VjaEtleWJvYXJkOiBmYWxzZSxcblx0XHRlbmFibGVPblJlYWRvbmx5OiB0cnVlLFxuXHRcdHNob3dPbkZvY3VzOiB0cnVlLFxuXHRcdHpJbmRleE9mZnNldDogMTAsXG5cdFx0Y29udGFpbmVyOiAnYm9keScsXG5cdFx0aW1tZWRpYXRlVXBkYXRlczogZmFsc2UsXG5cdFx0dGl0bGU6ICcnLFxuXHRcdHRlbXBsYXRlczoge1xuXHRcdFx0bGVmdEFycm93OiAnJiN4MDBBQjsnLFxuXHRcdFx0cmlnaHRBcnJvdzogJyYjeDAwQkI7J1xuXHRcdH0sXG4gICAgc2hvd1dlZWtEYXlzOiB0cnVlXG5cdH07XG5cdHZhciBsb2NhbGVfb3B0cyA9ICQuZm4uZGF0ZXBpY2tlci5sb2NhbGVfb3B0cyA9IFtcblx0XHQnZm9ybWF0Jyxcblx0XHQncnRsJyxcblx0XHQnd2Vla1N0YXJ0J1xuXHRdO1xuXHQkLmZuLmRhdGVwaWNrZXIuQ29uc3RydWN0b3IgPSBEYXRlcGlja2VyO1xuXHR2YXIgZGF0ZXMgPSAkLmZuLmRhdGVwaWNrZXIuZGF0ZXMgPSB7XG5cdFx0ZW46IHtcblx0XHRcdGRheXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuXHRcdFx0ZGF5c1Nob3J0OiBbXCJTdW5cIiwgXCJNb25cIiwgXCJUdWVcIiwgXCJXZWRcIiwgXCJUaHVcIiwgXCJGcmlcIiwgXCJTYXRcIl0sXG5cdFx0XHRkYXlzTWluOiBbXCJTdVwiLCBcIk1vXCIsIFwiVHVcIiwgXCJXZVwiLCBcIlRoXCIsIFwiRnJcIiwgXCJTYVwiXSxcblx0XHRcdG1vbnRoczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG5cdFx0XHRtb250aHNTaG9ydDogW1wiSmFuXCIsIFwiRmViXCIsIFwiTWFyXCIsIFwiQXByXCIsIFwiTWF5XCIsIFwiSnVuXCIsIFwiSnVsXCIsIFwiQXVnXCIsIFwiU2VwXCIsIFwiT2N0XCIsIFwiTm92XCIsIFwiRGVjXCJdLFxuXHRcdFx0dG9kYXk6IFwiVG9kYXlcIixcblx0XHRcdGNsZWFyOiBcIkNsZWFyXCIsXG5cdFx0XHR0aXRsZUZvcm1hdDogXCJNTSB5eXl5XCJcblx0XHR9XG5cdH07XG5cblx0dmFyIERQR2xvYmFsID0ge1xuXHRcdHZpZXdNb2RlczogW1xuXHRcdFx0e1xuXHRcdFx0XHRuYW1lczogWydkYXlzJywgJ21vbnRoJ10sXG5cdFx0XHRcdGNsc05hbWU6ICdkYXlzJyxcblx0XHRcdFx0ZTogJ2NoYW5nZU1vbnRoJ1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZXM6IFsnbW9udGhzJywgJ3llYXInXSxcblx0XHRcdFx0Y2xzTmFtZTogJ21vbnRocycsXG5cdFx0XHRcdGU6ICdjaGFuZ2VZZWFyJyxcblx0XHRcdFx0bmF2U3RlcDogMVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZXM6IFsneWVhcnMnLCAnZGVjYWRlJ10sXG5cdFx0XHRcdGNsc05hbWU6ICd5ZWFycycsXG5cdFx0XHRcdGU6ICdjaGFuZ2VEZWNhZGUnLFxuXHRcdFx0XHRuYXZTdGVwOiAxMFxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0bmFtZXM6IFsnZGVjYWRlcycsICdjZW50dXJ5J10sXG5cdFx0XHRcdGNsc05hbWU6ICdkZWNhZGVzJyxcblx0XHRcdFx0ZTogJ2NoYW5nZUNlbnR1cnknLFxuXHRcdFx0XHRuYXZTdGVwOiAxMDBcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWVzOiBbJ2NlbnR1cmllcycsICdtaWxsZW5uaXVtJ10sXG5cdFx0XHRcdGNsc05hbWU6ICdjZW50dXJpZXMnLFxuXHRcdFx0XHRlOiAnY2hhbmdlTWlsbGVubml1bScsXG5cdFx0XHRcdG5hdlN0ZXA6IDEwMDBcblx0XHRcdH1cblx0XHRdLFxuXHRcdHZhbGlkUGFydHM6IC9kZD98REQ/fG1tP3xNTT98eXkoPzp5eSk/L2csXG5cdFx0bm9ucHVuY3R1YXRpb246IC9bXiAtXFwvOi1AXFx1NWU3NFxcdTY3MDhcXHU2NWU1XFxbLWB7LX5cXHRcXG5cXHJdKy9nLFxuXHRcdHBhcnNlRm9ybWF0OiBmdW5jdGlvbihmb3JtYXQpe1xuXHRcdFx0aWYgKHR5cGVvZiBmb3JtYXQudG9WYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZm9ybWF0LnRvRGlzcGxheSA9PT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgICAgICByZXR1cm4gZm9ybWF0O1xuICAgICAgICAgICAgLy8gSUUgdHJlYXRzIFxcMCBhcyBhIHN0cmluZyBlbmQgaW4gaW5wdXRzICh0cnVuY2F0aW5nIHRoZSB2YWx1ZSksXG5cdFx0XHQvLyBzbyBpdCdzIGEgYmFkIGZvcm1hdCBkZWxpbWl0ZXIsIGFueXdheVxuXHRcdFx0dmFyIHNlcGFyYXRvcnMgPSBmb3JtYXQucmVwbGFjZSh0aGlzLnZhbGlkUGFydHMsICdcXDAnKS5zcGxpdCgnXFwwJyksXG5cdFx0XHRcdHBhcnRzID0gZm9ybWF0Lm1hdGNoKHRoaXMudmFsaWRQYXJ0cyk7XG5cdFx0XHRpZiAoIXNlcGFyYXRvcnMgfHwgIXNlcGFyYXRvcnMubGVuZ3RoIHx8ICFwYXJ0cyB8fCBwYXJ0cy5sZW5ndGggPT09IDApe1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGRhdGUgZm9ybWF0LlwiKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB7c2VwYXJhdG9yczogc2VwYXJhdG9ycywgcGFydHM6IHBhcnRzfTtcblx0XHR9LFxuXHRcdHBhcnNlRGF0ZTogZnVuY3Rpb24oZGF0ZSwgZm9ybWF0LCBsYW5ndWFnZSwgYXNzdW1lTmVhcmJ5KXtcblx0XHRcdGlmICghZGF0ZSlcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHRcdGlmIChkYXRlIGluc3RhbmNlb2YgRGF0ZSlcblx0XHRcdFx0cmV0dXJuIGRhdGU7XG5cdFx0XHRpZiAodHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycpXG5cdFx0XHRcdGZvcm1hdCA9IERQR2xvYmFsLnBhcnNlRm9ybWF0KGZvcm1hdCk7XG5cdFx0XHRpZiAoZm9ybWF0LnRvVmFsdWUpXG5cdFx0XHRcdHJldHVybiBmb3JtYXQudG9WYWx1ZShkYXRlLCBmb3JtYXQsIGxhbmd1YWdlKTtcblx0XHRcdHZhciBmbl9tYXAgPSB7XG5cdFx0XHRcdFx0ZDogJ21vdmVEYXknLFxuXHRcdFx0XHRcdG06ICdtb3ZlTW9udGgnLFxuXHRcdFx0XHRcdHc6ICdtb3ZlV2VlaycsXG5cdFx0XHRcdFx0eTogJ21vdmVZZWFyJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRkYXRlQWxpYXNlcyA9IHtcblx0XHRcdFx0XHR5ZXN0ZXJkYXk6ICctMWQnLFxuXHRcdFx0XHRcdHRvZGF5OiAnKzBkJyxcblx0XHRcdFx0XHR0b21vcnJvdzogJysxZCdcblx0XHRcdFx0fSxcblx0XHRcdFx0cGFydHMsIHBhcnQsIGRpciwgaSwgZm47XG5cdFx0XHRpZiAoZGF0ZSBpbiBkYXRlQWxpYXNlcyl7XG5cdFx0XHRcdGRhdGUgPSBkYXRlQWxpYXNlc1tkYXRlXTtcblx0XHRcdH1cblx0XHRcdGlmICgvXltcXC0rXVxcZCtbZG13eV0oW1xccyxdK1tcXC0rXVxcZCtbZG13eV0pKiQvaS50ZXN0KGRhdGUpKXtcblx0XHRcdFx0cGFydHMgPSBkYXRlLm1hdGNoKC8oW1xcLStdXFxkKykoW2Rtd3ldKS9naSk7XG5cdFx0XHRcdGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0XHRmb3IgKGk9MDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0XHRwYXJ0ID0gcGFydHNbaV0ubWF0Y2goLyhbXFwtK11cXGQrKShbZG13eV0pL2kpO1xuXHRcdFx0XHRcdGRpciA9IE51bWJlcihwYXJ0WzFdKTtcblx0XHRcdFx0XHRmbiA9IGZuX21hcFtwYXJ0WzJdLnRvTG93ZXJDYXNlKCldO1xuXHRcdFx0XHRcdGRhdGUgPSBEYXRlcGlja2VyLnByb3RvdHlwZVtmbl0oZGF0ZSwgZGlyKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gRGF0ZXBpY2tlci5wcm90b3R5cGUuX3plcm9fdXRjX3RpbWUoZGF0ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHBhcnRzID0gZGF0ZSAmJiBkYXRlLm1hdGNoKHRoaXMubm9ucHVuY3R1YXRpb24pIHx8IFtdO1xuXG5cdFx0XHRmdW5jdGlvbiBhcHBseU5lYXJieVllYXIoeWVhciwgdGhyZXNob2xkKXtcblx0XHRcdFx0aWYgKHRocmVzaG9sZCA9PT0gdHJ1ZSlcblx0XHRcdFx0XHR0aHJlc2hvbGQgPSAxMDtcblxuXHRcdFx0XHQvLyBpZiB5ZWFyIGlzIDIgZGlnaXRzIG9yIGxlc3MsIHRoYW4gdGhlIHVzZXIgbW9zdCBsaWtlbHkgaXMgdHJ5aW5nIHRvIGdldCBhIHJlY2VudCBjZW50dXJ5XG5cdFx0XHRcdGlmICh5ZWFyIDwgMTAwKXtcblx0XHRcdFx0XHR5ZWFyICs9IDIwMDA7XG5cdFx0XHRcdFx0Ly8gaWYgdGhlIG5ldyB5ZWFyIGlzIG1vcmUgdGhhbiB0aHJlc2hvbGQgeWVhcnMgaW4gYWR2YW5jZSwgdXNlIGxhc3QgY2VudHVyeVxuXHRcdFx0XHRcdGlmICh5ZWFyID4gKChuZXcgRGF0ZSgpKS5nZXRGdWxsWWVhcigpK3RocmVzaG9sZCkpe1xuXHRcdFx0XHRcdFx0eWVhciAtPSAxMDA7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHllYXI7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBwYXJzZWQgPSB7fSxcblx0XHRcdFx0c2V0dGVyc19vcmRlciA9IFsneXl5eScsICd5eScsICdNJywgJ01NJywgJ20nLCAnbW0nLCAnZCcsICdkZCddLFxuXHRcdFx0XHRzZXR0ZXJzX21hcCA9IHtcblx0XHRcdFx0XHR5eXl5OiBmdW5jdGlvbihkLHYpe1xuXHRcdFx0XHRcdFx0cmV0dXJuIGQuc2V0VVRDRnVsbFllYXIoYXNzdW1lTmVhcmJ5ID8gYXBwbHlOZWFyYnlZZWFyKHYsIGFzc3VtZU5lYXJieSkgOiB2KTtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdG06IGZ1bmN0aW9uKGQsdil7XG5cdFx0XHRcdFx0XHRpZiAoaXNOYU4oZCkpXG5cdFx0XHRcdFx0XHRcdHJldHVybiBkO1xuXHRcdFx0XHRcdFx0diAtPSAxO1xuXHRcdFx0XHRcdFx0d2hpbGUgKHYgPCAwKSB2ICs9IDEyO1xuXHRcdFx0XHRcdFx0diAlPSAxMjtcblx0XHRcdFx0XHRcdGQuc2V0VVRDTW9udGgodik7XG5cdFx0XHRcdFx0XHR3aGlsZSAoZC5nZXRVVENNb250aCgpICE9PSB2KVxuXHRcdFx0XHRcdFx0XHRkLnNldFVUQ0RhdGUoZC5nZXRVVENEYXRlKCktMSk7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZDtcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGQ6IGZ1bmN0aW9uKGQsdil7XG5cdFx0XHRcdFx0XHRyZXR1cm4gZC5zZXRVVENEYXRlKHYpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSxcblx0XHRcdFx0dmFsLCBmaWx0ZXJlZDtcblx0XHRcdHNldHRlcnNfbWFwWyd5eSddID0gc2V0dGVyc19tYXBbJ3l5eXknXTtcblx0XHRcdHNldHRlcnNfbWFwWydNJ10gPSBzZXR0ZXJzX21hcFsnTU0nXSA9IHNldHRlcnNfbWFwWydtbSddID0gc2V0dGVyc19tYXBbJ20nXTtcblx0XHRcdHNldHRlcnNfbWFwWydkZCddID0gc2V0dGVyc19tYXBbJ2QnXTtcblx0XHRcdGRhdGUgPSBVVENUb2RheSgpO1xuXHRcdFx0dmFyIGZwYXJ0cyA9IGZvcm1hdC5wYXJ0cy5zbGljZSgpO1xuXHRcdFx0Ly8gUmVtb3ZlIG5vb3AgcGFydHNcblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggIT09IGZwYXJ0cy5sZW5ndGgpe1xuXHRcdFx0XHRmcGFydHMgPSAkKGZwYXJ0cykuZmlsdGVyKGZ1bmN0aW9uKGkscCl7XG5cdFx0XHRcdFx0cmV0dXJuICQuaW5BcnJheShwLCBzZXR0ZXJzX29yZGVyKSAhPT0gLTE7XG5cdFx0XHRcdH0pLnRvQXJyYXkoKTtcblx0XHRcdH1cblx0XHRcdC8vIFByb2Nlc3MgcmVtYWluZGVyXG5cdFx0XHRmdW5jdGlvbiBtYXRjaF9wYXJ0KCl7XG5cdFx0XHRcdHZhciBtID0gdGhpcy5zbGljZSgwLCBwYXJ0c1tpXS5sZW5ndGgpLFxuXHRcdFx0XHRcdHAgPSBwYXJ0c1tpXS5zbGljZSgwLCBtLmxlbmd0aCk7XG5cdFx0XHRcdHJldHVybiBtLnRvTG93ZXJDYXNlKCkgPT09IHAudG9Mb3dlckNhc2UoKTtcblx0XHRcdH1cblx0XHRcdGlmIChwYXJ0cy5sZW5ndGggPT09IGZwYXJ0cy5sZW5ndGgpe1xuXHRcdFx0XHR2YXIgY250O1xuXHRcdFx0XHRmb3IgKGk9MCwgY250ID0gZnBhcnRzLmxlbmd0aDsgaSA8IGNudDsgaSsrKXtcblx0XHRcdFx0XHR2YWwgPSBwYXJzZUludChwYXJ0c1tpXSwgMTApO1xuXHRcdFx0XHRcdHBhcnQgPSBmcGFydHNbaV07XG5cdFx0XHRcdFx0aWYgKGlzTmFOKHZhbCkpe1xuXHRcdFx0XHRcdFx0c3dpdGNoIChwYXJ0KXtcblx0XHRcdFx0XHRcdFx0Y2FzZSAnTU0nOlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlcmVkID0gJChkYXRlc1tsYW5ndWFnZV0ubW9udGhzKS5maWx0ZXIobWF0Y2hfcGFydCk7XG5cdFx0XHRcdFx0XHRcdFx0dmFsID0gJC5pbkFycmF5KGZpbHRlcmVkWzBdLCBkYXRlc1tsYW5ndWFnZV0ubW9udGhzKSArIDE7XG5cdFx0XHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0XHRcdGNhc2UgJ00nOlxuXHRcdFx0XHRcdFx0XHRcdGZpbHRlcmVkID0gJChkYXRlc1tsYW5ndWFnZV0ubW9udGhzU2hvcnQpLmZpbHRlcihtYXRjaF9wYXJ0KTtcblx0XHRcdFx0XHRcdFx0XHR2YWwgPSAkLmluQXJyYXkoZmlsdGVyZWRbMF0sIGRhdGVzW2xhbmd1YWdlXS5tb250aHNTaG9ydCkgKyAxO1xuXHRcdFx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRwYXJzZWRbcGFydF0gPSB2YWw7XG5cdFx0XHRcdH1cblx0XHRcdFx0dmFyIF9kYXRlLCBzO1xuXHRcdFx0XHRmb3IgKGk9MDsgaSA8IHNldHRlcnNfb3JkZXIubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHRcdHMgPSBzZXR0ZXJzX29yZGVyW2ldO1xuXHRcdFx0XHRcdGlmIChzIGluIHBhcnNlZCAmJiAhaXNOYU4ocGFyc2VkW3NdKSl7XG5cdFx0XHRcdFx0XHRfZGF0ZSA9IG5ldyBEYXRlKGRhdGUpO1xuXHRcdFx0XHRcdFx0c2V0dGVyc19tYXBbc10oX2RhdGUsIHBhcnNlZFtzXSk7XG5cdFx0XHRcdFx0XHRpZiAoIWlzTmFOKF9kYXRlKSlcblx0XHRcdFx0XHRcdFx0ZGF0ZSA9IF9kYXRlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGRhdGU7XG5cdFx0fSxcblx0XHRmb3JtYXREYXRlOiBmdW5jdGlvbihkYXRlLCBmb3JtYXQsIGxhbmd1YWdlKXtcblx0XHRcdGlmICghZGF0ZSlcblx0XHRcdFx0cmV0dXJuICcnO1xuXHRcdFx0aWYgKHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnKVxuXHRcdFx0XHRmb3JtYXQgPSBEUEdsb2JhbC5wYXJzZUZvcm1hdChmb3JtYXQpO1xuXHRcdFx0aWYgKGZvcm1hdC50b0Rpc3BsYXkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdC50b0Rpc3BsYXkoZGF0ZSwgZm9ybWF0LCBsYW5ndWFnZSk7XG4gICAgICAgICAgICB2YXIgdmFsID0ge1xuXHRcdFx0XHRkOiBkYXRlLmdldFVUQ0RhdGUoKSxcblx0XHRcdFx0RDogZGF0ZXNbbGFuZ3VhZ2VdLmRheXNTaG9ydFtkYXRlLmdldFVUQ0RheSgpXSxcblx0XHRcdFx0REQ6IGRhdGVzW2xhbmd1YWdlXS5kYXlzW2RhdGUuZ2V0VVRDRGF5KCldLFxuXHRcdFx0XHRtOiBkYXRlLmdldFVUQ01vbnRoKCkgKyAxLFxuXHRcdFx0XHRNOiBkYXRlc1tsYW5ndWFnZV0ubW9udGhzU2hvcnRbZGF0ZS5nZXRVVENNb250aCgpXSxcblx0XHRcdFx0TU06IGRhdGVzW2xhbmd1YWdlXS5tb250aHNbZGF0ZS5nZXRVVENNb250aCgpXSxcblx0XHRcdFx0eXk6IGRhdGUuZ2V0VVRDRnVsbFllYXIoKS50b1N0cmluZygpLnN1YnN0cmluZygyKSxcblx0XHRcdFx0eXl5eTogZGF0ZS5nZXRVVENGdWxsWWVhcigpXG5cdFx0XHR9O1xuXHRcdFx0dmFsLmRkID0gKHZhbC5kIDwgMTAgPyAnMCcgOiAnJykgKyB2YWwuZDtcblx0XHRcdHZhbC5tbSA9ICh2YWwubSA8IDEwID8gJzAnIDogJycpICsgdmFsLm07XG5cdFx0XHRkYXRlID0gW107XG5cdFx0XHR2YXIgc2VwcyA9ICQuZXh0ZW5kKFtdLCBmb3JtYXQuc2VwYXJhdG9ycyk7XG5cdFx0XHRmb3IgKHZhciBpPTAsIGNudCA9IGZvcm1hdC5wYXJ0cy5sZW5ndGg7IGkgPD0gY250OyBpKyspe1xuXHRcdFx0XHRpZiAoc2Vwcy5sZW5ndGgpXG5cdFx0XHRcdFx0ZGF0ZS5wdXNoKHNlcHMuc2hpZnQoKSk7XG5cdFx0XHRcdGRhdGUucHVzaCh2YWxbZm9ybWF0LnBhcnRzW2ldXSk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gZGF0ZS5qb2luKCcnKTtcblx0XHR9LFxuXHRcdGhlYWRUZW1wbGF0ZTogJzx0aGVhZD4nK1xuXHRcdFx0ICAgICAgICAgICAgICAnPHRyPicrXG5cdFx0XHQgICAgICAgICAgICAgICAgJzx0aCBjb2xzcGFuPVwiN1wiIGNsYXNzPVwiZGF0ZXBpY2tlci10aXRsZVwiPjwvdGg+Jytcblx0XHRcdCAgICAgICAgICAgICAgJzwvdHI+Jytcblx0XHRcdFx0XHRcdFx0Jzx0cj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8dGggY2xhc3M9XCJwcmV2XCI+JytkZWZhdWx0cy50ZW1wbGF0ZXMubGVmdEFycm93Kyc8L3RoPicrXG5cdFx0XHRcdFx0XHRcdFx0Jzx0aCBjb2xzcGFuPVwiNVwiIGNsYXNzPVwiZGF0ZXBpY2tlci1zd2l0Y2hcIj48L3RoPicrXG5cdFx0XHRcdFx0XHRcdFx0Jzx0aCBjbGFzcz1cIm5leHRcIj4nK2RlZmF1bHRzLnRlbXBsYXRlcy5yaWdodEFycm93Kyc8L3RoPicrXG5cdFx0XHRcdFx0XHRcdCc8L3RyPicrXG5cdFx0XHRcdFx0XHQnPC90aGVhZD4nLFxuXHRcdGNvbnRUZW1wbGF0ZTogJzx0Ym9keT48dHI+PHRkIGNvbHNwYW49XCI3XCI+PC90ZD48L3RyPjwvdGJvZHk+Jyxcblx0XHRmb290VGVtcGxhdGU6ICc8dGZvb3Q+Jytcblx0XHRcdFx0XHRcdFx0Jzx0cj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8dGggY29sc3Bhbj1cIjdcIiBjbGFzcz1cInRvZGF5XCI+PC90aD4nK1xuXHRcdFx0XHRcdFx0XHQnPC90cj4nK1xuXHRcdFx0XHRcdFx0XHQnPHRyPicrXG5cdFx0XHRcdFx0XHRcdFx0Jzx0aCBjb2xzcGFuPVwiN1wiIGNsYXNzPVwiY2xlYXJcIj48L3RoPicrXG5cdFx0XHRcdFx0XHRcdCc8L3RyPicrXG5cdFx0XHRcdFx0XHQnPC90Zm9vdD4nXG5cdH07XG5cdERQR2xvYmFsLnRlbXBsYXRlID0gJzxkaXYgY2xhc3M9XCJkYXRlcGlja2VyXCI+Jytcblx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJkYXRlcGlja2VyLWRheXNcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuaGVhZFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0Jzx0Ym9keT48L3Rib2R5PicrXG5cdFx0XHRcdFx0XHRcdFx0XHREUEdsb2JhbC5mb290VGVtcGxhdGUrXG5cdFx0XHRcdFx0XHRcdFx0JzwvdGFibGU+Jytcblx0XHRcdFx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci1tb250aHNcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuaGVhZFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuY29udFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuZm9vdFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3RhYmxlPicrXG5cdFx0XHRcdFx0XHRcdCc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImRhdGVwaWNrZXIteWVhcnNcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuaGVhZFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuY29udFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuZm9vdFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3RhYmxlPicrXG5cdFx0XHRcdFx0XHRcdCc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImRhdGVwaWNrZXItZGVjYWRlc1wiPicrXG5cdFx0XHRcdFx0XHRcdFx0Jzx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicrXG5cdFx0XHRcdFx0XHRcdFx0XHREUEdsb2JhbC5oZWFkVGVtcGxhdGUrXG5cdFx0XHRcdFx0XHRcdFx0XHREUEdsb2JhbC5jb250VGVtcGxhdGUrXG5cdFx0XHRcdFx0XHRcdFx0XHREUEdsb2JhbC5mb290VGVtcGxhdGUrXG5cdFx0XHRcdFx0XHRcdFx0JzwvdGFibGU+Jytcblx0XHRcdFx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiZGF0ZXBpY2tlci1jZW50dXJpZXNcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuaGVhZFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuY29udFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdFx0RFBHbG9iYWwuZm9vdFRlbXBsYXRlK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3RhYmxlPicrXG5cdFx0XHRcdFx0XHRcdCc8L2Rpdj4nK1xuXHRcdFx0XHRcdFx0JzwvZGl2Pic7XG5cblx0JC5mbi5kYXRlcGlja2VyLkRQR2xvYmFsID0gRFBHbG9iYWw7XG5cblxuXHQvKiBEQVRFUElDS0VSIE5PIENPTkZMSUNUXG5cdCogPT09PT09PT09PT09PT09PT09PSAqL1xuXG5cdCQuZm4uZGF0ZXBpY2tlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKXtcblx0XHQkLmZuLmRhdGVwaWNrZXIgPSBvbGQ7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH07XG5cblx0LyogREFURVBJQ0tFUiBWRVJTSU9OXG5cdCAqID09PT09PT09PT09PT09PT09PT0gKi9cblx0JC5mbi5kYXRlcGlja2VyLnZlcnNpb24gPSAnMS45LjAnO1xuXG5cdCQuZm4uZGF0ZXBpY2tlci5kZXByZWNhdGVkID0gZnVuY3Rpb24obXNnKXtcblx0XHR2YXIgY29uc29sZSA9IHdpbmRvdy5jb25zb2xlO1xuXHRcdGlmIChjb25zb2xlICYmIGNvbnNvbGUud2Fybikge1xuXHRcdFx0Y29uc29sZS53YXJuKCdERVBSRUNBVEVEOiAnICsgbXNnKTtcblx0XHR9XG5cdH07XG5cblxuXHQvKiBEQVRFUElDS0VSIERBVEEtQVBJXG5cdCogPT09PT09PT09PT09PT09PT09ICovXG5cblx0JChkb2N1bWVudCkub24oXG5cdFx0J2ZvY3VzLmRhdGVwaWNrZXIuZGF0YS1hcGkgY2xpY2suZGF0ZXBpY2tlci5kYXRhLWFwaScsXG5cdFx0J1tkYXRhLXByb3ZpZGU9XCJkYXRlcGlja2VyXCJdJyxcblx0XHRmdW5jdGlvbihlKXtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHRpZiAoJHRoaXMuZGF0YSgnZGF0ZXBpY2tlcicpKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHQvLyBjb21wb25lbnQgY2xpY2sgcmVxdWlyZXMgdXMgdG8gZXhwbGljaXRseSBzaG93IGl0XG5cdFx0XHRkYXRlcGlja2VyUGx1Z2luLmNhbGwoJHRoaXMsICdzaG93Jyk7XG5cdFx0fVxuXHQpO1xuXHQkKGZ1bmN0aW9uKCl7XG5cdFx0ZGF0ZXBpY2tlclBsdWdpbi5jYWxsKCQoJ1tkYXRhLXByb3ZpZGU9XCJkYXRlcGlja2VyLWlubGluZVwiXScpKTtcblx0fSk7XG5cbn0pKTtcbiIsIi8qISBodHRwOi8vbXRocy5iZS9wbGFjZWhvbGRlciB2Mi4wLjggYnkgQG1hdGhpYXMgKi9cbnZhciBqUXVlcnkgPSByZXF1aXJlKCdqcXVlcnknKTtcblxuOyhmdW5jdGlvbih3aW5kb3csIGRvY3VtZW50LCAkKSB7XG5cblx0Ly8gT3BlcmEgTWluaSB2NyBkb2VzbuKAmXQgc3VwcG9ydCBwbGFjZWhvbGRlciBhbHRob3VnaCBpdHMgRE9NIHNlZW1zIHRvIGluZGljYXRlIHNvXG5cdHZhciBpc09wZXJhTWluaSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh3aW5kb3cub3BlcmFtaW5pKSA9PSAnW29iamVjdCBPcGVyYU1pbmldJztcblx0dmFyIGlzSW5wdXRTdXBwb3J0ZWQgPSAncGxhY2Vob2xkZXInIGluIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgJiYgIWlzT3BlcmFNaW5pO1xuXHR2YXIgaXNUZXh0YXJlYVN1cHBvcnRlZCA9ICdwbGFjZWhvbGRlcicgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKSAmJiAhaXNPcGVyYU1pbmk7XG5cdHZhciBwcm90b3R5cGUgPSAkLmZuO1xuXHR2YXIgdmFsSG9va3MgPSAkLnZhbEhvb2tzO1xuXHR2YXIgcHJvcEhvb2tzID0gJC5wcm9wSG9va3M7XG5cdHZhciBob29rcztcblx0dmFyIHBsYWNlaG9sZGVyO1xuXG5cdGlmIChpc0lucHV0U3VwcG9ydGVkICYmIGlzVGV4dGFyZWFTdXBwb3J0ZWQpIHtcblxuXHRcdHBsYWNlaG9sZGVyID0gcHJvdG90eXBlLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0cGxhY2Vob2xkZXIuaW5wdXQgPSBwbGFjZWhvbGRlci50ZXh0YXJlYSA9IHRydWU7XG5cblx0fSBlbHNlIHtcblxuXHRcdHBsYWNlaG9sZGVyID0gcHJvdG90eXBlLnBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSB0aGlzO1xuXHRcdFx0JHRoaXNcblx0XHRcdFx0LmZpbHRlcigoaXNJbnB1dFN1cHBvcnRlZCA/ICd0ZXh0YXJlYScgOiAnOmlucHV0JykgKyAnW3BsYWNlaG9sZGVyXScpXG5cdFx0XHRcdC5ub3QoJy5wbGFjZWhvbGRlcicpXG5cdFx0XHRcdC5iaW5kKHtcblx0XHRcdFx0XHQnZm9jdXMucGxhY2Vob2xkZXInOiBjbGVhclBsYWNlaG9sZGVyLFxuXHRcdFx0XHRcdCdibHVyLnBsYWNlaG9sZGVyJzogc2V0UGxhY2Vob2xkZXJcblx0XHRcdFx0fSlcblx0XHRcdFx0LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnLCB0cnVlKVxuXHRcdFx0XHQudHJpZ2dlcignYmx1ci5wbGFjZWhvbGRlcicpO1xuXHRcdFx0cmV0dXJuICR0aGlzO1xuXHRcdH07XG5cblx0XHRwbGFjZWhvbGRlci5pbnB1dCA9IGlzSW5wdXRTdXBwb3J0ZWQ7XG5cdFx0cGxhY2Vob2xkZXIudGV4dGFyZWEgPSBpc1RleHRhcmVhU3VwcG9ydGVkO1xuXG5cdFx0aG9va3MgPSB7XG5cdFx0XHQnZ2V0JzogZnVuY3Rpb24oZWxlbWVudCkge1xuXHRcdFx0XHR2YXIgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xuXG5cdFx0XHRcdHZhciAkcGFzc3dvcmRJbnB1dCA9ICRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJyk7XG5cdFx0XHRcdGlmICgkcGFzc3dvcmRJbnB1dCkge1xuXHRcdFx0XHRcdHJldHVybiAkcGFzc3dvcmRJbnB1dFswXS52YWx1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiAkZWxlbWVudC5kYXRhKCdwbGFjZWhvbGRlci1lbmFibGVkJykgJiYgJGVsZW1lbnQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykgPyAnJyA6IGVsZW1lbnQudmFsdWU7XG5cdFx0XHR9LFxuXHRcdFx0J3NldCc6IGZ1bmN0aW9uKGVsZW1lbnQsIHZhbHVlKSB7XG5cdFx0XHRcdHZhciAkZWxlbWVudCA9ICQoZWxlbWVudCk7XG5cblx0XHRcdFx0dmFyICRwYXNzd29yZElucHV0ID0gJGVsZW1lbnQuZGF0YSgncGxhY2Vob2xkZXItcGFzc3dvcmQnKTtcblx0XHRcdFx0aWYgKCRwYXNzd29yZElucHV0KSB7XG5cdFx0XHRcdFx0cmV0dXJuICRwYXNzd29yZElucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoISRlbGVtZW50LmRhdGEoJ3BsYWNlaG9sZGVyLWVuYWJsZWQnKSkge1xuXHRcdFx0XHRcdHJldHVybiBlbGVtZW50LnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHZhbHVlID09ICcnKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC52YWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRcdC8vIElzc3VlICM1NjogU2V0dGluZyB0aGUgcGxhY2Vob2xkZXIgY2F1c2VzIHByb2JsZW1zIGlmIHRoZSBlbGVtZW50IGNvbnRpbnVlcyB0byBoYXZlIGZvY3VzLlxuXHRcdFx0XHRcdGlmIChlbGVtZW50ICE9IHNhZmVBY3RpdmVFbGVtZW50KCkpIHtcblx0XHRcdFx0XHRcdC8vIFdlIGNhbid0IHVzZSBgdHJpZ2dlckhhbmRsZXJgIGhlcmUgYmVjYXVzZSBvZiBkdW1teSB0ZXh0L3Bhc3N3b3JkIGlucHV0cyA6KFxuXHRcdFx0XHRcdFx0c2V0UGxhY2Vob2xkZXIuY2FsbChlbGVtZW50KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSBpZiAoJGVsZW1lbnQuaGFzQ2xhc3MoJ3BsYWNlaG9sZGVyJykpIHtcblx0XHRcdFx0XHRjbGVhclBsYWNlaG9sZGVyLmNhbGwoZWxlbWVudCwgdHJ1ZSwgdmFsdWUpIHx8IChlbGVtZW50LnZhbHVlID0gdmFsdWUpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGVsZW1lbnQudmFsdWUgPSB2YWx1ZTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvLyBgc2V0YCBjYW4gbm90IHJldHVybiBgdW5kZWZpbmVkYDsgc2VlIGh0dHA6Ly9qc2FwaS5pbmZvL2pxdWVyeS8xLjcuMS92YWwjTDIzNjNcblx0XHRcdFx0cmV0dXJuICRlbGVtZW50O1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRpZiAoIWlzSW5wdXRTdXBwb3J0ZWQpIHtcblx0XHRcdHZhbEhvb2tzLmlucHV0ID0gaG9va3M7XG5cdFx0XHRwcm9wSG9va3MudmFsdWUgPSBob29rcztcblx0XHR9XG5cdFx0aWYgKCFpc1RleHRhcmVhU3VwcG9ydGVkKSB7XG5cdFx0XHR2YWxIb29rcy50ZXh0YXJlYSA9IGhvb2tzO1xuXHRcdFx0cHJvcEhvb2tzLnZhbHVlID0gaG9va3M7XG5cdFx0fVxuXG5cdFx0JChmdW5jdGlvbigpIHtcblx0XHRcdC8vIExvb2sgZm9yIGZvcm1zXG5cdFx0XHQkKGRvY3VtZW50KS5kZWxlZ2F0ZSgnZm9ybScsICdzdWJtaXQucGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly8gQ2xlYXIgdGhlIHBsYWNlaG9sZGVyIHZhbHVlcyBzbyB0aGV5IGRvbid0IGdldCBzdWJtaXR0ZWRcblx0XHRcdFx0dmFyICRpbnB1dHMgPSAkKCcucGxhY2Vob2xkZXInLCB0aGlzKS5lYWNoKGNsZWFyUGxhY2Vob2xkZXIpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCRpbnB1dHMuZWFjaChzZXRQbGFjZWhvbGRlcik7XG5cdFx0XHRcdH0sIDEwKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXG5cdFx0Ly8gQ2xlYXIgcGxhY2Vob2xkZXIgdmFsdWVzIHVwb24gcGFnZSByZWxvYWRcblx0XHQkKHdpbmRvdykuYmluZCgnYmVmb3JldW5sb2FkLnBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHQkKCcucGxhY2Vob2xkZXInKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnZhbHVlID0gJyc7XG5cdFx0XHR9KTtcblx0XHR9KTtcblxuXHR9XG5cblx0ZnVuY3Rpb24gYXJncyhlbGVtKSB7XG5cdFx0Ly8gUmV0dXJuIGFuIG9iamVjdCBvZiBlbGVtZW50IGF0dHJpYnV0ZXNcblx0XHR2YXIgbmV3QXR0cnMgPSB7fTtcblx0XHR2YXIgcmlubGluZWpRdWVyeSA9IC9ealF1ZXJ5XFxkKyQvO1xuXHRcdCQuZWFjaChlbGVtLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGksIGF0dHIpIHtcblx0XHRcdGlmIChhdHRyLnNwZWNpZmllZCAmJiAhcmlubGluZWpRdWVyeS50ZXN0KGF0dHIubmFtZSkpIHtcblx0XHRcdFx0bmV3QXR0cnNbYXR0ci5uYW1lXSA9IGF0dHIudmFsdWU7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0F0dHJzO1xuXHR9XG5cblx0ZnVuY3Rpb24gY2xlYXJQbGFjZWhvbGRlcihldmVudCwgdmFsdWUpIHtcblx0XHR2YXIgaW5wdXQgPSB0aGlzO1xuXHRcdHZhciAkaW5wdXQgPSAkKGlucHV0KTtcblx0XHRpZiAoaW5wdXQudmFsdWUgPT0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJykgJiYgJGlucHV0Lmhhc0NsYXNzKCdwbGFjZWhvbGRlcicpKSB7XG5cdFx0XHRpZiAoJGlucHV0LmRhdGEoJ3BsYWNlaG9sZGVyLXBhc3N3b3JkJykpIHtcblx0XHRcdFx0JGlucHV0ID0gJGlucHV0LmhpZGUoKS5uZXh0KCkuc2hvdygpLmF0dHIoJ2lkJywgJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuZGF0YSgncGxhY2Vob2xkZXItaWQnKSk7XG5cdFx0XHRcdC8vIElmIGBjbGVhclBsYWNlaG9sZGVyYCB3YXMgY2FsbGVkIGZyb20gYCQudmFsSG9va3MuaW5wdXQuc2V0YFxuXHRcdFx0XHRpZiAoZXZlbnQgPT09IHRydWUpIHtcblx0XHRcdFx0XHRyZXR1cm4gJGlucHV0WzBdLnZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdFx0JGlucHV0LmZvY3VzKCk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpbnB1dC52YWx1ZSA9ICcnO1xuXHRcdFx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0XHRcdGlucHV0ID09IHNhZmVBY3RpdmVFbGVtZW50KCkgJiYgaW5wdXQuc2VsZWN0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2V0UGxhY2Vob2xkZXIoKSB7XG5cdFx0dmFyICRyZXBsYWNlbWVudDtcblx0XHR2YXIgaW5wdXQgPSB0aGlzO1xuXHRcdHZhciAkaW5wdXQgPSAkKGlucHV0KTtcblx0XHR2YXIgaWQgPSB0aGlzLmlkO1xuXHRcdGlmIChpbnB1dC52YWx1ZSA9PSAnJykge1xuXHRcdFx0aWYgKGlucHV0LnR5cGUgPT0gJ3Bhc3N3b3JkJykge1xuXHRcdFx0XHRpZiAoISRpbnB1dC5kYXRhKCdwbGFjZWhvbGRlci10ZXh0aW5wdXQnKSkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHQkcmVwbGFjZW1lbnQgPSAkaW5wdXQuY2xvbmUoKS5hdHRyKHsgJ3R5cGUnOiAndGV4dCcgfSk7XG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHQkcmVwbGFjZW1lbnQgPSAkKCc8aW5wdXQ+JykuYXR0cigkLmV4dGVuZChhcmdzKHRoaXMpLCB7ICd0eXBlJzogJ3RleHQnIH0pKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0JHJlcGxhY2VtZW50XG5cdFx0XHRcdFx0XHQucmVtb3ZlQXR0cignbmFtZScpXG5cdFx0XHRcdFx0XHQuZGF0YSh7XG5cdFx0XHRcdFx0XHRcdCdwbGFjZWhvbGRlci1wYXNzd29yZCc6ICRpbnB1dCxcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLWlkJzogaWRcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYmluZCgnZm9jdXMucGxhY2Vob2xkZXInLCBjbGVhclBsYWNlaG9sZGVyKTtcblx0XHRcdFx0XHQkaW5wdXRcblx0XHRcdFx0XHRcdC5kYXRhKHtcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLXRleHRpbnB1dCc6ICRyZXBsYWNlbWVudCxcblx0XHRcdFx0XHRcdFx0J3BsYWNlaG9sZGVyLWlkJzogaWRcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQuYmVmb3JlKCRyZXBsYWNlbWVudCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0JGlucHV0ID0gJGlucHV0LnJlbW92ZUF0dHIoJ2lkJykuaGlkZSgpLnByZXYoKS5hdHRyKCdpZCcsIGlkKS5zaG93KCk7XG5cdFx0XHRcdC8vIE5vdGU6IGAkaW5wdXRbMF0gIT0gaW5wdXRgIG5vdyFcblx0XHRcdH1cblx0XHRcdCRpbnB1dC5hZGRDbGFzcygncGxhY2Vob2xkZXInKTtcblx0XHRcdCRpbnB1dFswXS52YWx1ZSA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkaW5wdXQucmVtb3ZlQ2xhc3MoJ3BsYWNlaG9sZGVyJyk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2FmZUFjdGl2ZUVsZW1lbnQoKSB7XG5cdFx0Ly8gQXZvaWQgSUU5IGBkb2N1bWVudC5hY3RpdmVFbGVtZW50YCBvZiBkZWF0aFxuXHRcdC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9tYXRoaWFzYnluZW5zL2pxdWVyeS1wbGFjZWhvbGRlci9wdWxsLzk5XG5cdFx0dHJ5IHtcblx0XHRcdHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuXHRcdH0gY2F0Y2ggKGV4Y2VwdGlvbikge31cblx0fVxuXG59KHRoaXMsIGRvY3VtZW50LCBqUXVlcnkpKTtcbiIsIi8qISBNYWduaWZpYyBQb3B1cCAtIHYxLjEuMCAtIDIwMTYtMDItMjBcbiogaHR0cDovL2RpbXNlbWVub3YuY29tL3BsdWdpbnMvbWFnbmlmaWMtcG9wdXAvXG4qIENvcHlyaWdodCAoYykgMjAxNiBEbWl0cnkgU2VtZW5vdjsgKi9cbjsoZnVuY3Rpb24gKGZhY3RvcnkpIHsgXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7IFxuIC8vIEFNRC4gUmVnaXN0ZXIgYXMgYW4gYW5vbnltb3VzIG1vZHVsZS4gXG4gZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpOyBcbiB9IGVsc2UgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JykgeyBcbiAvLyBOb2RlL0NvbW1vbkpTIFxuIGZhY3RvcnkocmVxdWlyZSgnanF1ZXJ5JykpOyBcbiB9IGVsc2UgeyBcbiAvLyBCcm93c2VyIGdsb2JhbHMgXG4gZmFjdG9yeSh3aW5kb3cualF1ZXJ5IHx8IHdpbmRvdy5aZXB0byk7IFxuIH0gXG4gfShmdW5jdGlvbigkKSB7IFxuXG4vKj4+Y29yZSovXG4vKipcbiAqIFxuICogTWFnbmlmaWMgUG9wdXAgQ29yZSBKUyBmaWxlXG4gKiBcbiAqL1xuXG5cbi8qKlxuICogUHJpdmF0ZSBzdGF0aWMgY29uc3RhbnRzXG4gKi9cbnZhciBDTE9TRV9FVkVOVCA9ICdDbG9zZScsXG5cdEJFRk9SRV9DTE9TRV9FVkVOVCA9ICdCZWZvcmVDbG9zZScsXG5cdEFGVEVSX0NMT1NFX0VWRU5UID0gJ0FmdGVyQ2xvc2UnLFxuXHRCRUZPUkVfQVBQRU5EX0VWRU5UID0gJ0JlZm9yZUFwcGVuZCcsXG5cdE1BUktVUF9QQVJTRV9FVkVOVCA9ICdNYXJrdXBQYXJzZScsXG5cdE9QRU5fRVZFTlQgPSAnT3BlbicsXG5cdENIQU5HRV9FVkVOVCA9ICdDaGFuZ2UnLFxuXHROUyA9ICdtZnAnLFxuXHRFVkVOVF9OUyA9ICcuJyArIE5TLFxuXHRSRUFEWV9DTEFTUyA9ICdtZnAtcmVhZHknLFxuXHRSRU1PVklOR19DTEFTUyA9ICdtZnAtcmVtb3ZpbmcnLFxuXHRQUkVWRU5UX0NMT1NFX0NMQVNTID0gJ21mcC1wcmV2ZW50LWNsb3NlJztcblxuXG4vKipcbiAqIFByaXZhdGUgdmFycyBcbiAqL1xuLypqc2hpbnQgLVcwNzkgKi9cbnZhciBtZnAsIC8vIEFzIHdlIGhhdmUgb25seSBvbmUgaW5zdGFuY2Ugb2YgTWFnbmlmaWNQb3B1cCBvYmplY3QsIHdlIGRlZmluZSBpdCBsb2NhbGx5IHRvIG5vdCB0byB1c2UgJ3RoaXMnXG5cdE1hZ25pZmljUG9wdXAgPSBmdW5jdGlvbigpe30sXG5cdF9pc0pRID0gISEod2luZG93LmpRdWVyeSksXG5cdF9wcmV2U3RhdHVzLFxuXHRfd2luZG93ID0gJCh3aW5kb3cpLFxuXHRfZG9jdW1lbnQsXG5cdF9wcmV2Q29udGVudFR5cGUsXG5cdF93cmFwQ2xhc3Nlcyxcblx0X2N1cnJQb3B1cFR5cGU7XG5cblxuLyoqXG4gKiBQcml2YXRlIGZ1bmN0aW9uc1xuICovXG52YXIgX21mcE9uID0gZnVuY3Rpb24obmFtZSwgZikge1xuXHRcdG1mcC5ldi5vbihOUyArIG5hbWUgKyBFVkVOVF9OUywgZik7XG5cdH0sXG5cdF9nZXRFbCA9IGZ1bmN0aW9uKGNsYXNzTmFtZSwgYXBwZW5kVG8sIGh0bWwsIHJhdykge1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGVsLmNsYXNzTmFtZSA9ICdtZnAtJytjbGFzc05hbWU7XG5cdFx0aWYoaHRtbCkge1xuXHRcdFx0ZWwuaW5uZXJIVE1MID0gaHRtbDtcblx0XHR9XG5cdFx0aWYoIXJhdykge1xuXHRcdFx0ZWwgPSAkKGVsKTtcblx0XHRcdGlmKGFwcGVuZFRvKSB7XG5cdFx0XHRcdGVsLmFwcGVuZFRvKGFwcGVuZFRvKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYoYXBwZW5kVG8pIHtcblx0XHRcdGFwcGVuZFRvLmFwcGVuZENoaWxkKGVsKTtcblx0XHR9XG5cdFx0cmV0dXJuIGVsO1xuXHR9LFxuXHRfbWZwVHJpZ2dlciA9IGZ1bmN0aW9uKGUsIGRhdGEpIHtcblx0XHRtZnAuZXYudHJpZ2dlckhhbmRsZXIoTlMgKyBlLCBkYXRhKTtcblxuXHRcdGlmKG1mcC5zdC5jYWxsYmFja3MpIHtcblx0XHRcdC8vIGNvbnZlcnRzIFwibWZwRXZlbnROYW1lXCIgdG8gXCJldmVudE5hbWVcIiBjYWxsYmFjayBhbmQgdHJpZ2dlcnMgaXQgaWYgaXQncyBwcmVzZW50XG5cdFx0XHRlID0gZS5jaGFyQXQoMCkudG9Mb3dlckNhc2UoKSArIGUuc2xpY2UoMSk7XG5cdFx0XHRpZihtZnAuc3QuY2FsbGJhY2tzW2VdKSB7XG5cdFx0XHRcdG1mcC5zdC5jYWxsYmFja3NbZV0uYXBwbHkobWZwLCAkLmlzQXJyYXkoZGF0YSkgPyBkYXRhIDogW2RhdGFdKTtcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cdF9nZXRDbG9zZUJ0biA9IGZ1bmN0aW9uKHR5cGUpIHtcblx0XHRpZih0eXBlICE9PSBfY3VyclBvcHVwVHlwZSB8fCAhbWZwLmN1cnJUZW1wbGF0ZS5jbG9zZUJ0bikge1xuXHRcdFx0bWZwLmN1cnJUZW1wbGF0ZS5jbG9zZUJ0biA9ICQoIG1mcC5zdC5jbG9zZU1hcmt1cC5yZXBsYWNlKCcldGl0bGUlJywgbWZwLnN0LnRDbG9zZSApICk7XG5cdFx0XHRfY3VyclBvcHVwVHlwZSA9IHR5cGU7XG5cdFx0fVxuXHRcdHJldHVybiBtZnAuY3VyclRlbXBsYXRlLmNsb3NlQnRuO1xuXHR9LFxuXHQvLyBJbml0aWFsaXplIE1hZ25pZmljIFBvcHVwIG9ubHkgd2hlbiBjYWxsZWQgYXQgbGVhc3Qgb25jZVxuXHRfY2hlY2tJbnN0YW5jZSA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmKCEkLm1hZ25pZmljUG9wdXAuaW5zdGFuY2UpIHtcblx0XHRcdC8qanNoaW50IC1XMDIwICovXG5cdFx0XHRtZnAgPSBuZXcgTWFnbmlmaWNQb3B1cCgpO1xuXHRcdFx0bWZwLmluaXQoKTtcblx0XHRcdCQubWFnbmlmaWNQb3B1cC5pbnN0YW5jZSA9IG1mcDtcblx0XHR9XG5cdH0sXG5cdC8vIENTUyB0cmFuc2l0aW9uIGRldGVjdGlvbiwgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy83MjY0ODk5L2RldGVjdC1jc3MtdHJhbnNpdGlvbnMtdXNpbmctamF2YXNjcmlwdC1hbmQtd2l0aG91dC1tb2Rlcm5penJcblx0c3VwcG9ydHNUcmFuc2l0aW9ucyA9IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpLnN0eWxlLCAvLyAncycgZm9yIHN0eWxlLiBiZXR0ZXIgdG8gY3JlYXRlIGFuIGVsZW1lbnQgaWYgYm9keSB5ZXQgdG8gZXhpc3Rcblx0XHRcdHYgPSBbJ21zJywnTycsJ01veicsJ1dlYmtpdCddOyAvLyAndicgZm9yIHZlbmRvclxuXG5cdFx0aWYoIHNbJ3RyYW5zaXRpb24nXSAhPT0gdW5kZWZpbmVkICkge1xuXHRcdFx0cmV0dXJuIHRydWU7IFxuXHRcdH1cblx0XHRcdFxuXHRcdHdoaWxlKCB2Lmxlbmd0aCApIHtcblx0XHRcdGlmKCB2LnBvcCgpICsgJ1RyYW5zaXRpb24nIGluIHMgKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRcdFx0XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9O1xuXG5cblxuLyoqXG4gKiBQdWJsaWMgZnVuY3Rpb25zXG4gKi9cbk1hZ25pZmljUG9wdXAucHJvdG90eXBlID0ge1xuXG5cdGNvbnN0cnVjdG9yOiBNYWduaWZpY1BvcHVwLFxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplcyBNYWduaWZpYyBQb3B1cCBwbHVnaW4uIFxuXHQgKiBUaGlzIGZ1bmN0aW9uIGlzIHRyaWdnZXJlZCBvbmx5IG9uY2Ugd2hlbiAkLmZuLm1hZ25pZmljUG9wdXAgb3IgJC5tYWduaWZpY1BvcHVwIGlzIGV4ZWN1dGVkXG5cdCAqL1xuXHRpbml0OiBmdW5jdGlvbigpIHtcblx0XHR2YXIgYXBwVmVyc2lvbiA9IG5hdmlnYXRvci5hcHBWZXJzaW9uO1xuXHRcdG1mcC5pc0xvd0lFID0gbWZwLmlzSUU4ID0gZG9jdW1lbnQuYWxsICYmICFkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyO1xuXHRcdG1mcC5pc0FuZHJvaWQgPSAoL2FuZHJvaWQvZ2kpLnRlc3QoYXBwVmVyc2lvbik7XG5cdFx0bWZwLmlzSU9TID0gKC9pcGhvbmV8aXBhZHxpcG9kL2dpKS50ZXN0KGFwcFZlcnNpb24pO1xuXHRcdG1mcC5zdXBwb3J0c1RyYW5zaXRpb24gPSBzdXBwb3J0c1RyYW5zaXRpb25zKCk7XG5cblx0XHQvLyBXZSBkaXNhYmxlIGZpeGVkIHBvc2l0aW9uZWQgbGlnaHRib3ggb24gZGV2aWNlcyB0aGF0IGRvbid0IGhhbmRsZSBpdCBuaWNlbHkuXG5cdFx0Ly8gSWYgeW91IGtub3cgYSBiZXR0ZXIgd2F5IG9mIGRldGVjdGluZyB0aGlzIC0gbGV0IG1lIGtub3cuXG5cdFx0bWZwLnByb2JhYmx5TW9iaWxlID0gKG1mcC5pc0FuZHJvaWQgfHwgbWZwLmlzSU9TIHx8IC8oT3BlcmEgTWluaSl8S2luZGxlfHdlYk9TfEJsYWNrQmVycnl8KE9wZXJhIE1vYmkpfChXaW5kb3dzIFBob25lKXxJRU1vYmlsZS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgKTtcblx0XHRfZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcblxuXHRcdG1mcC5wb3B1cHNDYWNoZSA9IHt9O1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBPcGVucyBwb3B1cFxuXHQgKiBAcGFyYW0gIGRhdGEgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblx0b3BlbjogZnVuY3Rpb24oZGF0YSkge1xuXG5cdFx0dmFyIGk7XG5cblx0XHRpZihkYXRhLmlzT2JqID09PSBmYWxzZSkgeyBcblx0XHRcdC8vIGNvbnZlcnQgalF1ZXJ5IGNvbGxlY3Rpb24gdG8gYXJyYXkgdG8gYXZvaWQgY29uZmxpY3RzIGxhdGVyXG5cdFx0XHRtZnAuaXRlbXMgPSBkYXRhLml0ZW1zLnRvQXJyYXkoKTtcblxuXHRcdFx0bWZwLmluZGV4ID0gMDtcblx0XHRcdHZhciBpdGVtcyA9IGRhdGEuaXRlbXMsXG5cdFx0XHRcdGl0ZW07XG5cdFx0XHRmb3IoaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpdGVtID0gaXRlbXNbaV07XG5cdFx0XHRcdGlmKGl0ZW0ucGFyc2VkKSB7XG5cdFx0XHRcdFx0aXRlbSA9IGl0ZW0uZWxbMF07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYoaXRlbSA9PT0gZGF0YS5lbFswXSkge1xuXHRcdFx0XHRcdG1mcC5pbmRleCA9IGk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bWZwLml0ZW1zID0gJC5pc0FycmF5KGRhdGEuaXRlbXMpID8gZGF0YS5pdGVtcyA6IFtkYXRhLml0ZW1zXTtcblx0XHRcdG1mcC5pbmRleCA9IGRhdGEuaW5kZXggfHwgMDtcblx0XHR9XG5cblx0XHQvLyBpZiBwb3B1cCBpcyBhbHJlYWR5IG9wZW5lZCAtIHdlIGp1c3QgdXBkYXRlIHRoZSBjb250ZW50XG5cdFx0aWYobWZwLmlzT3Blbikge1xuXHRcdFx0bWZwLnVwZGF0ZUl0ZW1IVE1MKCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdG1mcC50eXBlcyA9IFtdOyBcblx0XHRfd3JhcENsYXNzZXMgPSAnJztcblx0XHRpZihkYXRhLm1haW5FbCAmJiBkYXRhLm1haW5FbC5sZW5ndGgpIHtcblx0XHRcdG1mcC5ldiA9IGRhdGEubWFpbkVsLmVxKDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtZnAuZXYgPSBfZG9jdW1lbnQ7XG5cdFx0fVxuXG5cdFx0aWYoZGF0YS5rZXkpIHtcblx0XHRcdGlmKCFtZnAucG9wdXBzQ2FjaGVbZGF0YS5rZXldKSB7XG5cdFx0XHRcdG1mcC5wb3B1cHNDYWNoZVtkYXRhLmtleV0gPSB7fTtcblx0XHRcdH1cblx0XHRcdG1mcC5jdXJyVGVtcGxhdGUgPSBtZnAucG9wdXBzQ2FjaGVbZGF0YS5rZXldO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRtZnAuY3VyclRlbXBsYXRlID0ge307XG5cdFx0fVxuXG5cblxuXHRcdG1mcC5zdCA9ICQuZXh0ZW5kKHRydWUsIHt9LCAkLm1hZ25pZmljUG9wdXAuZGVmYXVsdHMsIGRhdGEgKTsgXG5cdFx0bWZwLmZpeGVkQ29udGVudFBvcyA9IG1mcC5zdC5maXhlZENvbnRlbnRQb3MgPT09ICdhdXRvJyA/ICFtZnAucHJvYmFibHlNb2JpbGUgOiBtZnAuc3QuZml4ZWRDb250ZW50UG9zO1xuXG5cdFx0aWYobWZwLnN0Lm1vZGFsKSB7XG5cdFx0XHRtZnAuc3QuY2xvc2VPbkNvbnRlbnRDbGljayA9IGZhbHNlO1xuXHRcdFx0bWZwLnN0LmNsb3NlT25CZ0NsaWNrID0gZmFsc2U7XG5cdFx0XHRtZnAuc3Quc2hvd0Nsb3NlQnRuID0gZmFsc2U7XG5cdFx0XHRtZnAuc3QuZW5hYmxlRXNjYXBlS2V5ID0gZmFsc2U7XG5cdFx0fVxuXHRcdFxuXG5cdFx0Ly8gQnVpbGRpbmcgbWFya3VwXG5cdFx0Ly8gbWFpbiBjb250YWluZXJzIGFyZSBjcmVhdGVkIG9ubHkgb25jZVxuXHRcdGlmKCFtZnAuYmdPdmVybGF5KSB7XG5cblx0XHRcdC8vIERhcmsgb3ZlcmxheVxuXHRcdFx0bWZwLmJnT3ZlcmxheSA9IF9nZXRFbCgnYmcnKS5vbignY2xpY2snK0VWRU5UX05TLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bWZwLmNsb3NlKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bWZwLndyYXAgPSBfZ2V0RWwoJ3dyYXAnKS5hdHRyKCd0YWJpbmRleCcsIC0xKS5vbignY2xpY2snK0VWRU5UX05TLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmKG1mcC5fY2hlY2tJZkNsb3NlKGUudGFyZ2V0KSkge1xuXHRcdFx0XHRcdG1mcC5jbG9zZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0bWZwLmNvbnRhaW5lciA9IF9nZXRFbCgnY29udGFpbmVyJywgbWZwLndyYXApO1xuXHRcdH1cblxuXHRcdG1mcC5jb250ZW50Q29udGFpbmVyID0gX2dldEVsKCdjb250ZW50Jyk7XG5cdFx0aWYobWZwLnN0LnByZWxvYWRlcikge1xuXHRcdFx0bWZwLnByZWxvYWRlciA9IF9nZXRFbCgncHJlbG9hZGVyJywgbWZwLmNvbnRhaW5lciwgbWZwLnN0LnRMb2FkaW5nKTtcblx0XHR9XG5cblxuXHRcdC8vIEluaXRpYWxpemluZyBtb2R1bGVzXG5cdFx0dmFyIG1vZHVsZXMgPSAkLm1hZ25pZmljUG9wdXAubW9kdWxlcztcblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgbiA9IG1vZHVsZXNbaV07XG5cdFx0XHRuID0gbi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIG4uc2xpY2UoMSk7XG5cdFx0XHRtZnBbJ2luaXQnK25dLmNhbGwobWZwKTtcblx0XHR9XG5cdFx0X21mcFRyaWdnZXIoJ0JlZm9yZU9wZW4nKTtcblxuXG5cdFx0aWYobWZwLnN0LnNob3dDbG9zZUJ0bikge1xuXHRcdFx0Ly8gQ2xvc2UgYnV0dG9uXG5cdFx0XHRpZighbWZwLnN0LmNsb3NlQnRuSW5zaWRlKSB7XG5cdFx0XHRcdG1mcC53cmFwLmFwcGVuZCggX2dldENsb3NlQnRuKCkgKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdF9tZnBPbihNQVJLVVBfUEFSU0VfRVZFTlQsIGZ1bmN0aW9uKGUsIHRlbXBsYXRlLCB2YWx1ZXMsIGl0ZW0pIHtcblx0XHRcdFx0XHR2YWx1ZXMuY2xvc2VfcmVwbGFjZVdpdGggPSBfZ2V0Q2xvc2VCdG4oaXRlbS50eXBlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdF93cmFwQ2xhc3NlcyArPSAnIG1mcC1jbG9zZS1idG4taW4nO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKG1mcC5zdC5hbGlnblRvcCkge1xuXHRcdFx0X3dyYXBDbGFzc2VzICs9ICcgbWZwLWFsaWduLXRvcCc7XG5cdFx0fVxuXG5cdFxuXG5cdFx0aWYobWZwLmZpeGVkQ29udGVudFBvcykge1xuXHRcdFx0bWZwLndyYXAuY3NzKHtcblx0XHRcdFx0b3ZlcmZsb3c6IG1mcC5zdC5vdmVyZmxvd1ksXG5cdFx0XHRcdG92ZXJmbG93WDogJ2hpZGRlbicsXG5cdFx0XHRcdG92ZXJmbG93WTogbWZwLnN0Lm92ZXJmbG93WVxuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1mcC53cmFwLmNzcyh7IFxuXHRcdFx0XHR0b3A6IF93aW5kb3cuc2Nyb2xsVG9wKCksXG5cdFx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR9KTtcblx0XHR9XG5cdFx0aWYoIG1mcC5zdC5maXhlZEJnUG9zID09PSBmYWxzZSB8fCAobWZwLnN0LmZpeGVkQmdQb3MgPT09ICdhdXRvJyAmJiAhbWZwLmZpeGVkQ29udGVudFBvcykgKSB7XG5cdFx0XHRtZnAuYmdPdmVybGF5LmNzcyh7XG5cdFx0XHRcdGhlaWdodDogX2RvY3VtZW50LmhlaWdodCgpLFxuXHRcdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0XG5cblx0XHRpZihtZnAuc3QuZW5hYmxlRXNjYXBlS2V5KSB7XG5cdFx0XHQvLyBDbG9zZSBvbiBFU0Mga2V5XG5cdFx0XHRfZG9jdW1lbnQub24oJ2tleXVwJyArIEVWRU5UX05TLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGlmKGUua2V5Q29kZSA9PT0gMjcpIHtcblx0XHRcdFx0XHRtZnAuY2xvc2UoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0X3dpbmRvdy5vbigncmVzaXplJyArIEVWRU5UX05TLCBmdW5jdGlvbigpIHtcblx0XHRcdG1mcC51cGRhdGVTaXplKCk7XG5cdFx0fSk7XG5cblxuXHRcdGlmKCFtZnAuc3QuY2xvc2VPbkNvbnRlbnRDbGljaykge1xuXHRcdFx0X3dyYXBDbGFzc2VzICs9ICcgbWZwLWF1dG8tY3Vyc29yJztcblx0XHR9XG5cdFx0XG5cdFx0aWYoX3dyYXBDbGFzc2VzKVxuXHRcdFx0bWZwLndyYXAuYWRkQ2xhc3MoX3dyYXBDbGFzc2VzKTtcblxuXG5cdFx0Ly8gdGhpcyB0cmlnZ2VycyByZWNhbGN1bGF0aW9uIG9mIGxheW91dCwgc28gd2UgZ2V0IGl0IG9uY2UgdG8gbm90IHRvIHRyaWdnZXIgdHdpY2Vcblx0XHR2YXIgd2luZG93SGVpZ2h0ID0gbWZwLndIID0gX3dpbmRvdy5oZWlnaHQoKTtcblxuXHRcdFxuXHRcdHZhciB3aW5kb3dTdHlsZXMgPSB7fTtcblxuXHRcdGlmKCBtZnAuZml4ZWRDb250ZW50UG9zICkge1xuICAgICAgICAgICAgaWYobWZwLl9oYXNTY3JvbGxCYXIod2luZG93SGVpZ2h0KSl7XG4gICAgICAgICAgICAgICAgdmFyIHMgPSBtZnAuX2dldFNjcm9sbGJhclNpemUoKTtcbiAgICAgICAgICAgICAgICBpZihzKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd1N0eWxlcy5tYXJnaW5SaWdodCA9IHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblx0XHRpZihtZnAuZml4ZWRDb250ZW50UG9zKSB7XG5cdFx0XHRpZighbWZwLmlzSUU3KSB7XG5cdFx0XHRcdHdpbmRvd1N0eWxlcy5vdmVyZmxvdyA9ICdoaWRkZW4nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaWU3IGRvdWJsZS1zY3JvbGwgYnVnXG5cdFx0XHRcdCQoJ2JvZHksIGh0bWwnKS5jc3MoJ292ZXJmbG93JywgJ2hpZGRlbicpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdFxuXHRcdFxuXHRcdHZhciBjbGFzc2VzVG9hZGQgPSBtZnAuc3QubWFpbkNsYXNzO1xuXHRcdGlmKG1mcC5pc0lFNykge1xuXHRcdFx0Y2xhc3Nlc1RvYWRkICs9ICcgbWZwLWllNyc7XG5cdFx0fVxuXHRcdGlmKGNsYXNzZXNUb2FkZCkge1xuXHRcdFx0bWZwLl9hZGRDbGFzc1RvTUZQKCBjbGFzc2VzVG9hZGQgKTtcblx0XHR9XG5cblx0XHQvLyBhZGQgY29udGVudFxuXHRcdG1mcC51cGRhdGVJdGVtSFRNTCgpO1xuXG5cdFx0X21mcFRyaWdnZXIoJ0J1aWxkQ29udHJvbHMnKTtcblxuXHRcdC8vIHJlbW92ZSBzY3JvbGxiYXIsIGFkZCBtYXJnaW4gZS50LmNcblx0XHQkKCdodG1sJykuY3NzKHdpbmRvd1N0eWxlcyk7XG5cdFx0XG5cdFx0Ly8gYWRkIGV2ZXJ5dGhpbmcgdG8gRE9NXG5cdFx0bWZwLmJnT3ZlcmxheS5hZGQobWZwLndyYXApLnByZXBlbmRUbyggbWZwLnN0LnByZXBlbmRUbyB8fCAkKGRvY3VtZW50LmJvZHkpICk7XG5cblx0XHQvLyBTYXZlIGxhc3QgZm9jdXNlZCBlbGVtZW50XG5cdFx0bWZwLl9sYXN0Rm9jdXNlZEVsID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudDtcblx0XHRcblx0XHQvLyBXYWl0IGZvciBuZXh0IGN5Y2xlIHRvIGFsbG93IENTUyB0cmFuc2l0aW9uXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFxuXHRcdFx0aWYobWZwLmNvbnRlbnQpIHtcblx0XHRcdFx0bWZwLl9hZGRDbGFzc1RvTUZQKFJFQURZX0NMQVNTKTtcblx0XHRcdFx0bWZwLl9zZXRGb2N1cygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaWYgY29udGVudCBpcyBub3QgZGVmaW5lZCAobm90IGxvYWRlZCBlLnQuYykgd2UgYWRkIGNsYXNzIG9ubHkgZm9yIEJHXG5cdFx0XHRcdG1mcC5iZ092ZXJsYXkuYWRkQ2xhc3MoUkVBRFlfQ0xBU1MpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvLyBUcmFwIHRoZSBmb2N1cyBpbiBwb3B1cFxuXHRcdFx0X2RvY3VtZW50Lm9uKCdmb2N1c2luJyArIEVWRU5UX05TLCBtZnAuX29uRm9jdXNJbik7XG5cblx0XHR9LCAxNik7XG5cblx0XHRtZnAuaXNPcGVuID0gdHJ1ZTtcblx0XHRtZnAudXBkYXRlU2l6ZSh3aW5kb3dIZWlnaHQpO1xuXHRcdF9tZnBUcmlnZ2VyKE9QRU5fRVZFTlQpO1xuXG5cdFx0cmV0dXJuIGRhdGE7XG5cdH0sXG5cblx0LyoqXG5cdCAqIENsb3NlcyB0aGUgcG9wdXBcblx0ICovXG5cdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRpZighbWZwLmlzT3BlbikgcmV0dXJuO1xuXHRcdF9tZnBUcmlnZ2VyKEJFRk9SRV9DTE9TRV9FVkVOVCk7XG5cblx0XHRtZnAuaXNPcGVuID0gZmFsc2U7XG5cdFx0Ly8gZm9yIENTUzMgYW5pbWF0aW9uXG5cdFx0aWYobWZwLnN0LnJlbW92YWxEZWxheSAmJiAhbWZwLmlzTG93SUUgJiYgbWZwLnN1cHBvcnRzVHJhbnNpdGlvbiApICB7XG5cdFx0XHRtZnAuX2FkZENsYXNzVG9NRlAoUkVNT1ZJTkdfQ0xBU1MpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0bWZwLl9jbG9zZSgpO1xuXHRcdFx0fSwgbWZwLnN0LnJlbW92YWxEZWxheSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1mcC5fY2xvc2UoKTtcblx0XHR9XG5cdH0sXG5cblx0LyoqXG5cdCAqIEhlbHBlciBmb3IgY2xvc2UoKSBmdW5jdGlvblxuXHQgKi9cblx0X2Nsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRfbWZwVHJpZ2dlcihDTE9TRV9FVkVOVCk7XG5cblx0XHR2YXIgY2xhc3Nlc1RvUmVtb3ZlID0gUkVNT1ZJTkdfQ0xBU1MgKyAnICcgKyBSRUFEWV9DTEFTUyArICcgJztcblxuXHRcdG1mcC5iZ092ZXJsYXkuZGV0YWNoKCk7XG5cdFx0bWZwLndyYXAuZGV0YWNoKCk7XG5cdFx0bWZwLmNvbnRhaW5lci5lbXB0eSgpO1xuXG5cdFx0aWYobWZwLnN0Lm1haW5DbGFzcykge1xuXHRcdFx0Y2xhc3Nlc1RvUmVtb3ZlICs9IG1mcC5zdC5tYWluQ2xhc3MgKyAnICc7XG5cdFx0fVxuXG5cdFx0bWZwLl9yZW1vdmVDbGFzc0Zyb21NRlAoY2xhc3Nlc1RvUmVtb3ZlKTtcblxuXHRcdGlmKG1mcC5maXhlZENvbnRlbnRQb3MpIHtcblx0XHRcdHZhciB3aW5kb3dTdHlsZXMgPSB7bWFyZ2luUmlnaHQ6ICcnfTtcblx0XHRcdGlmKG1mcC5pc0lFNykge1xuXHRcdFx0XHQkKCdib2R5LCBodG1sJykuY3NzKCdvdmVyZmxvdycsICcnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdpbmRvd1N0eWxlcy5vdmVyZmxvdyA9ICcnO1xuXHRcdFx0fVxuXHRcdFx0JCgnaHRtbCcpLmNzcyh3aW5kb3dTdHlsZXMpO1xuXHRcdH1cblx0XHRcblx0XHRfZG9jdW1lbnQub2ZmKCdrZXl1cCcgKyBFVkVOVF9OUyArICcgZm9jdXNpbicgKyBFVkVOVF9OUyk7XG5cdFx0bWZwLmV2Lm9mZihFVkVOVF9OUyk7XG5cblx0XHQvLyBjbGVhbiB1cCBET00gZWxlbWVudHMgdGhhdCBhcmVuJ3QgcmVtb3ZlZFxuXHRcdG1mcC53cmFwLmF0dHIoJ2NsYXNzJywgJ21mcC13cmFwJykucmVtb3ZlQXR0cignc3R5bGUnKTtcblx0XHRtZnAuYmdPdmVybGF5LmF0dHIoJ2NsYXNzJywgJ21mcC1iZycpO1xuXHRcdG1mcC5jb250YWluZXIuYXR0cignY2xhc3MnLCAnbWZwLWNvbnRhaW5lcicpO1xuXG5cdFx0Ly8gcmVtb3ZlIGNsb3NlIGJ1dHRvbiBmcm9tIHRhcmdldCBlbGVtZW50XG5cdFx0aWYobWZwLnN0LnNob3dDbG9zZUJ0biAmJlxuXHRcdCghbWZwLnN0LmNsb3NlQnRuSW5zaWRlIHx8IG1mcC5jdXJyVGVtcGxhdGVbbWZwLmN1cnJJdGVtLnR5cGVdID09PSB0cnVlKSkge1xuXHRcdFx0aWYobWZwLmN1cnJUZW1wbGF0ZS5jbG9zZUJ0bilcblx0XHRcdFx0bWZwLmN1cnJUZW1wbGF0ZS5jbG9zZUJ0bi5kZXRhY2goKTtcblx0XHR9XG5cblxuXHRcdGlmKG1mcC5zdC5hdXRvRm9jdXNMYXN0ICYmIG1mcC5fbGFzdEZvY3VzZWRFbCkge1xuXHRcdFx0JChtZnAuX2xhc3RGb2N1c2VkRWwpLmZvY3VzKCk7IC8vIHB1dCB0YWIgZm9jdXMgYmFja1xuXHRcdH1cblx0XHRtZnAuY3Vyckl0ZW0gPSBudWxsO1x0XG5cdFx0bWZwLmNvbnRlbnQgPSBudWxsO1xuXHRcdG1mcC5jdXJyVGVtcGxhdGUgPSBudWxsO1xuXHRcdG1mcC5wcmV2SGVpZ2h0ID0gMDtcblxuXHRcdF9tZnBUcmlnZ2VyKEFGVEVSX0NMT1NFX0VWRU5UKTtcblx0fSxcblx0XG5cdHVwZGF0ZVNpemU6IGZ1bmN0aW9uKHdpbkhlaWdodCkge1xuXG5cdFx0aWYobWZwLmlzSU9TKSB7XG5cdFx0XHQvLyBmaXhlcyBpT1MgbmF2IGJhcnMgaHR0cHM6Ly9naXRodWIuY29tL2RpbXNlbWVub3YvTWFnbmlmaWMtUG9wdXAvaXNzdWVzLzJcblx0XHRcdHZhciB6b29tTGV2ZWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyB3aW5kb3cuaW5uZXJXaWR0aDtcblx0XHRcdHZhciBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiB6b29tTGV2ZWw7XG5cdFx0XHRtZnAud3JhcC5jc3MoJ2hlaWdodCcsIGhlaWdodCk7XG5cdFx0XHRtZnAud0ggPSBoZWlnaHQ7XG5cdFx0fSBlbHNlIHtcblx0XHRcdG1mcC53SCA9IHdpbkhlaWdodCB8fCBfd2luZG93LmhlaWdodCgpO1xuXHRcdH1cblx0XHQvLyBGaXhlcyAjODQ6IHBvcHVwIGluY29ycmVjdGx5IHBvc2l0aW9uZWQgd2l0aCBwb3NpdGlvbjpyZWxhdGl2ZSBvbiBib2R5XG5cdFx0aWYoIW1mcC5maXhlZENvbnRlbnRQb3MpIHtcblx0XHRcdG1mcC53cmFwLmNzcygnaGVpZ2h0JywgbWZwLndIKTtcblx0XHR9XG5cblx0XHRfbWZwVHJpZ2dlcignUmVzaXplJyk7XG5cblx0fSxcblxuXHQvKipcblx0ICogU2V0IGNvbnRlbnQgb2YgcG9wdXAgYmFzZWQgb24gY3VycmVudCBpbmRleFxuXHQgKi9cblx0dXBkYXRlSXRlbUhUTUw6IGZ1bmN0aW9uKCkge1xuXHRcdHZhciBpdGVtID0gbWZwLml0ZW1zW21mcC5pbmRleF07XG5cblx0XHQvLyBEZXRhY2ggYW5kIHBlcmZvcm0gbW9kaWZpY2F0aW9uc1xuXHRcdG1mcC5jb250ZW50Q29udGFpbmVyLmRldGFjaCgpO1xuXG5cdFx0aWYobWZwLmNvbnRlbnQpXG5cdFx0XHRtZnAuY29udGVudC5kZXRhY2goKTtcblxuXHRcdGlmKCFpdGVtLnBhcnNlZCkge1xuXHRcdFx0aXRlbSA9IG1mcC5wYXJzZUVsKCBtZnAuaW5kZXggKTtcblx0XHR9XG5cblx0XHR2YXIgdHlwZSA9IGl0ZW0udHlwZTtcblxuXHRcdF9tZnBUcmlnZ2VyKCdCZWZvcmVDaGFuZ2UnLCBbbWZwLmN1cnJJdGVtID8gbWZwLmN1cnJJdGVtLnR5cGUgOiAnJywgdHlwZV0pO1xuXHRcdC8vIEJlZm9yZUNoYW5nZSBldmVudCB3b3JrcyBsaWtlIHNvOlxuXHRcdC8vIF9tZnBPbignQmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZSwgcHJldlR5cGUsIG5ld1R5cGUpIHsgfSk7XG5cblx0XHRtZnAuY3Vyckl0ZW0gPSBpdGVtO1xuXG5cdFx0aWYoIW1mcC5jdXJyVGVtcGxhdGVbdHlwZV0pIHtcblx0XHRcdHZhciBtYXJrdXAgPSBtZnAuc3RbdHlwZV0gPyBtZnAuc3RbdHlwZV0ubWFya3VwIDogZmFsc2U7XG5cblx0XHRcdC8vIGFsbG93cyB0byBtb2RpZnkgbWFya3VwXG5cdFx0XHRfbWZwVHJpZ2dlcignRmlyc3RNYXJrdXBQYXJzZScsIG1hcmt1cCk7XG5cblx0XHRcdGlmKG1hcmt1cCkge1xuXHRcdFx0XHRtZnAuY3VyclRlbXBsYXRlW3R5cGVdID0gJChtYXJrdXApO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly8gaWYgdGhlcmUgaXMgbm8gbWFya3VwIGZvdW5kIHdlIGp1c3QgZGVmaW5lIHRoYXQgdGVtcGxhdGUgaXMgcGFyc2VkXG5cdFx0XHRcdG1mcC5jdXJyVGVtcGxhdGVbdHlwZV0gPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKF9wcmV2Q29udGVudFR5cGUgJiYgX3ByZXZDb250ZW50VHlwZSAhPT0gaXRlbS50eXBlKSB7XG5cdFx0XHRtZnAuY29udGFpbmVyLnJlbW92ZUNsYXNzKCdtZnAtJytfcHJldkNvbnRlbnRUeXBlKyctaG9sZGVyJyk7XG5cdFx0fVxuXG5cdFx0dmFyIG5ld0NvbnRlbnQgPSBtZnBbJ2dldCcgKyB0eXBlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdHlwZS5zbGljZSgxKV0oaXRlbSwgbWZwLmN1cnJUZW1wbGF0ZVt0eXBlXSk7XG5cdFx0bWZwLmFwcGVuZENvbnRlbnQobmV3Q29udGVudCwgdHlwZSk7XG5cblx0XHRpdGVtLnByZWxvYWRlZCA9IHRydWU7XG5cblx0XHRfbWZwVHJpZ2dlcihDSEFOR0VfRVZFTlQsIGl0ZW0pO1xuXHRcdF9wcmV2Q29udGVudFR5cGUgPSBpdGVtLnR5cGU7XG5cblx0XHQvLyBBcHBlbmQgY29udGFpbmVyIGJhY2sgYWZ0ZXIgaXRzIGNvbnRlbnQgY2hhbmdlZFxuXHRcdG1mcC5jb250YWluZXIucHJlcGVuZChtZnAuY29udGVudENvbnRhaW5lcik7XG5cblx0XHRfbWZwVHJpZ2dlcignQWZ0ZXJDaGFuZ2UnKTtcblx0fSxcblxuXG5cdC8qKlxuXHQgKiBTZXQgSFRNTCBjb250ZW50IG9mIHBvcHVwXG5cdCAqL1xuXHRhcHBlbmRDb250ZW50OiBmdW5jdGlvbihuZXdDb250ZW50LCB0eXBlKSB7XG5cdFx0bWZwLmNvbnRlbnQgPSBuZXdDb250ZW50O1xuXG5cdFx0aWYobmV3Q29udGVudCkge1xuXHRcdFx0aWYobWZwLnN0LnNob3dDbG9zZUJ0biAmJiBtZnAuc3QuY2xvc2VCdG5JbnNpZGUgJiZcblx0XHRcdFx0bWZwLmN1cnJUZW1wbGF0ZVt0eXBlXSA9PT0gdHJ1ZSkge1xuXHRcdFx0XHQvLyBpZiB0aGVyZSBpcyBubyBtYXJrdXAsIHdlIGp1c3QgYXBwZW5kIGNsb3NlIGJ1dHRvbiBlbGVtZW50IGluc2lkZVxuXHRcdFx0XHRpZighbWZwLmNvbnRlbnQuZmluZCgnLm1mcC1jbG9zZScpLmxlbmd0aCkge1xuXHRcdFx0XHRcdG1mcC5jb250ZW50LmFwcGVuZChfZ2V0Q2xvc2VCdG4oKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1mcC5jb250ZW50ID0gbmV3Q29udGVudDtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0bWZwLmNvbnRlbnQgPSAnJztcblx0XHR9XG5cblx0XHRfbWZwVHJpZ2dlcihCRUZPUkVfQVBQRU5EX0VWRU5UKTtcblx0XHRtZnAuY29udGFpbmVyLmFkZENsYXNzKCdtZnAtJyt0eXBlKyctaG9sZGVyJyk7XG5cblx0XHRtZnAuY29udGVudENvbnRhaW5lci5hcHBlbmQobWZwLmNvbnRlbnQpO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgTWFnbmlmaWMgUG9wdXAgZGF0YSBvYmplY3QgYmFzZWQgb24gZ2l2ZW4gZGF0YVxuXHQgKiBAcGFyYW0gIHtpbnR9IGluZGV4IEluZGV4IG9mIGl0ZW0gdG8gcGFyc2Vcblx0ICovXG5cdHBhcnNlRWw6IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0dmFyIGl0ZW0gPSBtZnAuaXRlbXNbaW5kZXhdLFxuXHRcdFx0dHlwZTtcblxuXHRcdGlmKGl0ZW0udGFnTmFtZSkge1xuXHRcdFx0aXRlbSA9IHsgZWw6ICQoaXRlbSkgfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dHlwZSA9IGl0ZW0udHlwZTtcblx0XHRcdGl0ZW0gPSB7IGRhdGE6IGl0ZW0sIHNyYzogaXRlbS5zcmMgfTtcblx0XHR9XG5cblx0XHRpZihpdGVtLmVsKSB7XG5cdFx0XHR2YXIgdHlwZXMgPSBtZnAudHlwZXM7XG5cblx0XHRcdC8vIGNoZWNrIGZvciAnbWZwLVRZUEUnIGNsYXNzXG5cdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0aWYoIGl0ZW0uZWwuaGFzQ2xhc3MoJ21mcC0nK3R5cGVzW2ldKSApIHtcblx0XHRcdFx0XHR0eXBlID0gdHlwZXNbaV07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0aXRlbS5zcmMgPSBpdGVtLmVsLmF0dHIoJ2RhdGEtbWZwLXNyYycpO1xuXHRcdFx0aWYoIWl0ZW0uc3JjKSB7XG5cdFx0XHRcdGl0ZW0uc3JjID0gaXRlbS5lbC5hdHRyKCdocmVmJyk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aXRlbS50eXBlID0gdHlwZSB8fCBtZnAuc3QudHlwZSB8fCAnaW5saW5lJztcblx0XHRpdGVtLmluZGV4ID0gaW5kZXg7XG5cdFx0aXRlbS5wYXJzZWQgPSB0cnVlO1xuXHRcdG1mcC5pdGVtc1tpbmRleF0gPSBpdGVtO1xuXHRcdF9tZnBUcmlnZ2VyKCdFbGVtZW50UGFyc2UnLCBpdGVtKTtcblxuXHRcdHJldHVybiBtZnAuaXRlbXNbaW5kZXhdO1xuXHR9LFxuXG5cblx0LyoqXG5cdCAqIEluaXRpYWxpemVzIHNpbmdsZSBwb3B1cCBvciBhIGdyb3VwIG9mIHBvcHVwc1xuXHQgKi9cblx0YWRkR3JvdXA6IGZ1bmN0aW9uKGVsLCBvcHRpb25zKSB7XG5cdFx0dmFyIGVIYW5kbGVyID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5tZnBFbCA9IHRoaXM7XG5cdFx0XHRtZnAuX29wZW5DbGljayhlLCBlbCwgb3B0aW9ucyk7XG5cdFx0fTtcblxuXHRcdGlmKCFvcHRpb25zKSB7XG5cdFx0XHRvcHRpb25zID0ge307XG5cdFx0fVxuXG5cdFx0dmFyIGVOYW1lID0gJ2NsaWNrLm1hZ25pZmljUG9wdXAnO1xuXHRcdG9wdGlvbnMubWFpbkVsID0gZWw7XG5cblx0XHRpZihvcHRpb25zLml0ZW1zKSB7XG5cdFx0XHRvcHRpb25zLmlzT2JqID0gdHJ1ZTtcblx0XHRcdGVsLm9mZihlTmFtZSkub24oZU5hbWUsIGVIYW5kbGVyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b3B0aW9ucy5pc09iaiA9IGZhbHNlO1xuXHRcdFx0aWYob3B0aW9ucy5kZWxlZ2F0ZSkge1xuXHRcdFx0XHRlbC5vZmYoZU5hbWUpLm9uKGVOYW1lLCBvcHRpb25zLmRlbGVnYXRlICwgZUhhbmRsZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3B0aW9ucy5pdGVtcyA9IGVsO1xuXHRcdFx0XHRlbC5vZmYoZU5hbWUpLm9uKGVOYW1lLCBlSGFuZGxlcik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9LFxuXHRfb3BlbkNsaWNrOiBmdW5jdGlvbihlLCBlbCwgb3B0aW9ucykge1xuXHRcdHZhciBtaWRDbGljayA9IG9wdGlvbnMubWlkQ2xpY2sgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubWlkQ2xpY2sgOiAkLm1hZ25pZmljUG9wdXAuZGVmYXVsdHMubWlkQ2xpY2s7XG5cblxuXHRcdGlmKCFtaWRDbGljayAmJiAoIGUud2hpY2ggPT09IDIgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLmFsdEtleSB8fCBlLnNoaWZ0S2V5ICkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGRpc2FibGVPbiA9IG9wdGlvbnMuZGlzYWJsZU9uICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmRpc2FibGVPbiA6ICQubWFnbmlmaWNQb3B1cC5kZWZhdWx0cy5kaXNhYmxlT247XG5cblx0XHRpZihkaXNhYmxlT24pIHtcblx0XHRcdGlmKCQuaXNGdW5jdGlvbihkaXNhYmxlT24pKSB7XG5cdFx0XHRcdGlmKCAhZGlzYWJsZU9uLmNhbGwobWZwKSApIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHsgLy8gZWxzZSBpdCdzIG51bWJlclxuXHRcdFx0XHRpZiggX3dpbmRvdy53aWR0aCgpIDwgZGlzYWJsZU9uICkge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYoZS50eXBlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIFRoaXMgd2lsbCBwcmV2ZW50IHBvcHVwIGZyb20gY2xvc2luZyBpZiBlbGVtZW50IGlzIGluc2lkZSBhbmQgcG9wdXAgaXMgYWxyZWFkeSBvcGVuZWRcblx0XHRcdGlmKG1mcC5pc09wZW4pIHtcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRvcHRpb25zLmVsID0gJChlLm1mcEVsKTtcblx0XHRpZihvcHRpb25zLmRlbGVnYXRlKSB7XG5cdFx0XHRvcHRpb25zLml0ZW1zID0gZWwuZmluZChvcHRpb25zLmRlbGVnYXRlKTtcblx0XHR9XG5cdFx0bWZwLm9wZW4ob3B0aW9ucyk7XG5cdH0sXG5cblxuXHQvKipcblx0ICogVXBkYXRlcyB0ZXh0IG9uIHByZWxvYWRlclxuXHQgKi9cblx0dXBkYXRlU3RhdHVzOiBmdW5jdGlvbihzdGF0dXMsIHRleHQpIHtcblxuXHRcdGlmKG1mcC5wcmVsb2FkZXIpIHtcblx0XHRcdGlmKF9wcmV2U3RhdHVzICE9PSBzdGF0dXMpIHtcblx0XHRcdFx0bWZwLmNvbnRhaW5lci5yZW1vdmVDbGFzcygnbWZwLXMtJytfcHJldlN0YXR1cyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCF0ZXh0ICYmIHN0YXR1cyA9PT0gJ2xvYWRpbmcnKSB7XG5cdFx0XHRcdHRleHQgPSBtZnAuc3QudExvYWRpbmc7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRzdGF0dXM6IHN0YXR1cyxcblx0XHRcdFx0dGV4dDogdGV4dFxuXHRcdFx0fTtcblx0XHRcdC8vIGFsbG93cyB0byBtb2RpZnkgc3RhdHVzXG5cdFx0XHRfbWZwVHJpZ2dlcignVXBkYXRlU3RhdHVzJywgZGF0YSk7XG5cblx0XHRcdHN0YXR1cyA9IGRhdGEuc3RhdHVzO1xuXHRcdFx0dGV4dCA9IGRhdGEudGV4dDtcblxuXHRcdFx0bWZwLnByZWxvYWRlci5odG1sKHRleHQpO1xuXG5cdFx0XHRtZnAucHJlbG9hZGVyLmZpbmQoJ2EnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bWZwLmNvbnRhaW5lci5hZGRDbGFzcygnbWZwLXMtJytzdGF0dXMpO1xuXHRcdFx0X3ByZXZTdGF0dXMgPSBzdGF0dXM7XG5cdFx0fVxuXHR9LFxuXG5cblx0Lypcblx0XHRcIlByaXZhdGVcIiBoZWxwZXJzIHRoYXQgYXJlbid0IHByaXZhdGUgYXQgYWxsXG5cdCAqL1xuXHQvLyBDaGVjayB0byBjbG9zZSBwb3B1cCBvciBub3Rcblx0Ly8gXCJ0YXJnZXRcIiBpcyBhbiBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWRcblx0X2NoZWNrSWZDbG9zZTogZnVuY3Rpb24odGFyZ2V0KSB7XG5cblx0XHRpZigkKHRhcmdldCkuaGFzQ2xhc3MoUFJFVkVOVF9DTE9TRV9DTEFTUykpIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHR2YXIgY2xvc2VPbkNvbnRlbnQgPSBtZnAuc3QuY2xvc2VPbkNvbnRlbnRDbGljaztcblx0XHR2YXIgY2xvc2VPbkJnID0gbWZwLnN0LmNsb3NlT25CZ0NsaWNrO1xuXG5cdFx0aWYoY2xvc2VPbkNvbnRlbnQgJiYgY2xvc2VPbkJnKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHQvLyBXZSBjbG9zZSB0aGUgcG9wdXAgaWYgY2xpY2sgaXMgb24gY2xvc2UgYnV0dG9uIG9yIG9uIHByZWxvYWRlci4gT3IgaWYgdGhlcmUgaXMgbm8gY29udGVudC5cblx0XHRcdGlmKCFtZnAuY29udGVudCB8fCAkKHRhcmdldCkuaGFzQ2xhc3MoJ21mcC1jbG9zZScpIHx8IChtZnAucHJlbG9hZGVyICYmIHRhcmdldCA9PT0gbWZwLnByZWxvYWRlclswXSkgKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBpZiBjbGljayBpcyBvdXRzaWRlIHRoZSBjb250ZW50XG5cdFx0XHRpZiggICh0YXJnZXQgIT09IG1mcC5jb250ZW50WzBdICYmICEkLmNvbnRhaW5zKG1mcC5jb250ZW50WzBdLCB0YXJnZXQpKSAgKSB7XG5cdFx0XHRcdGlmKGNsb3NlT25CZykge1xuXHRcdFx0XHRcdC8vIGxhc3QgY2hlY2ssIGlmIHRoZSBjbGlja2VkIGVsZW1lbnQgaXMgaW4gRE9NLCAoaW4gY2FzZSBpdCdzIHJlbW92ZWQgb25jbGljaylcblx0XHRcdFx0XHRpZiggJC5jb250YWlucyhkb2N1bWVudCwgdGFyZ2V0KSApIHtcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmKGNsb3NlT25Db250ZW50KSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblx0X2FkZENsYXNzVG9NRlA6IGZ1bmN0aW9uKGNOYW1lKSB7XG5cdFx0bWZwLmJnT3ZlcmxheS5hZGRDbGFzcyhjTmFtZSk7XG5cdFx0bWZwLndyYXAuYWRkQ2xhc3MoY05hbWUpO1xuXHR9LFxuXHRfcmVtb3ZlQ2xhc3NGcm9tTUZQOiBmdW5jdGlvbihjTmFtZSkge1xuXHRcdHRoaXMuYmdPdmVybGF5LnJlbW92ZUNsYXNzKGNOYW1lKTtcblx0XHRtZnAud3JhcC5yZW1vdmVDbGFzcyhjTmFtZSk7XG5cdH0sXG5cdF9oYXNTY3JvbGxCYXI6IGZ1bmN0aW9uKHdpbkhlaWdodCkge1xuXHRcdHJldHVybiAoICAobWZwLmlzSUU3ID8gX2RvY3VtZW50LmhlaWdodCgpIDogZG9jdW1lbnQuYm9keS5zY3JvbGxIZWlnaHQpID4gKHdpbkhlaWdodCB8fCBfd2luZG93LmhlaWdodCgpKSApO1xuXHR9LFxuXHRfc2V0Rm9jdXM6IGZ1bmN0aW9uKCkge1xuXHRcdChtZnAuc3QuZm9jdXMgPyBtZnAuY29udGVudC5maW5kKG1mcC5zdC5mb2N1cykuZXEoMCkgOiBtZnAud3JhcCkuZm9jdXMoKTtcblx0fSxcblx0X29uRm9jdXNJbjogZnVuY3Rpb24oZSkge1xuXHRcdGlmKCBlLnRhcmdldCAhPT0gbWZwLndyYXBbMF0gJiYgISQuY29udGFpbnMobWZwLndyYXBbMF0sIGUudGFyZ2V0KSApIHtcblx0XHRcdG1mcC5fc2V0Rm9jdXMoKTtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cdH0sXG5cdF9wYXJzZU1hcmt1cDogZnVuY3Rpb24odGVtcGxhdGUsIHZhbHVlcywgaXRlbSkge1xuXHRcdHZhciBhcnI7XG5cdFx0aWYoaXRlbS5kYXRhKSB7XG5cdFx0XHR2YWx1ZXMgPSAkLmV4dGVuZChpdGVtLmRhdGEsIHZhbHVlcyk7XG5cdFx0fVxuXHRcdF9tZnBUcmlnZ2VyKE1BUktVUF9QQVJTRV9FVkVOVCwgW3RlbXBsYXRlLCB2YWx1ZXMsIGl0ZW1dICk7XG5cblx0XHQkLmVhY2godmFsdWVzLCBmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRpZih2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHZhbHVlID09PSBmYWxzZSkge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGFyciA9IGtleS5zcGxpdCgnXycpO1xuXHRcdFx0aWYoYXJyLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0dmFyIGVsID0gdGVtcGxhdGUuZmluZChFVkVOVF9OUyArICctJythcnJbMF0pO1xuXG5cdFx0XHRcdGlmKGVsLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHR2YXIgYXR0ciA9IGFyclsxXTtcblx0XHRcdFx0XHRpZihhdHRyID09PSAncmVwbGFjZVdpdGgnKSB7XG5cdFx0XHRcdFx0XHRpZihlbFswXSAhPT0gdmFsdWVbMF0pIHtcblx0XHRcdFx0XHRcdFx0ZWwucmVwbGFjZVdpdGgodmFsdWUpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0gZWxzZSBpZihhdHRyID09PSAnaW1nJykge1xuXHRcdFx0XHRcdFx0aWYoZWwuaXMoJ2ltZycpKSB7XG5cdFx0XHRcdFx0XHRcdGVsLmF0dHIoJ3NyYycsIHZhbHVlKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGVsLnJlcGxhY2VXaXRoKCAkKCc8aW1nPicpLmF0dHIoJ3NyYycsIHZhbHVlKS5hdHRyKCdjbGFzcycsIGVsLmF0dHIoJ2NsYXNzJykpICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdGVsLmF0dHIoYXJyWzFdLCB2YWx1ZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRlbXBsYXRlLmZpbmQoRVZFTlRfTlMgKyAnLScra2V5KS5odG1sKHZhbHVlKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSxcblxuXHRfZ2V0U2Nyb2xsYmFyU2l6ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8gdGh4IERhdmlkXG5cdFx0aWYobWZwLnNjcm9sbGJhclNpemUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0dmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0XHRzY3JvbGxEaXYuc3R5bGUuY3NzVGV4dCA9ICd3aWR0aDogOTlweDsgaGVpZ2h0OiA5OXB4OyBvdmVyZmxvdzogc2Nyb2xsOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDogLTk5OTlweDsnO1xuXHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzY3JvbGxEaXYpO1xuXHRcdFx0bWZwLnNjcm9sbGJhclNpemUgPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcm9sbERpdik7XG5cdFx0fVxuXHRcdHJldHVybiBtZnAuc2Nyb2xsYmFyU2l6ZTtcblx0fVxuXG59OyAvKiBNYWduaWZpY1BvcHVwIGNvcmUgcHJvdG90eXBlIGVuZCAqL1xuXG5cblxuXG4vKipcbiAqIFB1YmxpYyBzdGF0aWMgZnVuY3Rpb25zXG4gKi9cbiQubWFnbmlmaWNQb3B1cCA9IHtcblx0aW5zdGFuY2U6IG51bGwsXG5cdHByb3RvOiBNYWduaWZpY1BvcHVwLnByb3RvdHlwZSxcblx0bW9kdWxlczogW10sXG5cblx0b3BlbjogZnVuY3Rpb24ob3B0aW9ucywgaW5kZXgpIHtcblx0XHRfY2hlY2tJbnN0YW5jZSgpO1xuXG5cdFx0aWYoIW9wdGlvbnMpIHtcblx0XHRcdG9wdGlvbnMgPSB7fTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBvcHRpb25zKTtcblx0XHR9XG5cblx0XHRvcHRpb25zLmlzT2JqID0gdHJ1ZTtcblx0XHRvcHRpb25zLmluZGV4ID0gaW5kZXggfHwgMDtcblx0XHRyZXR1cm4gdGhpcy5pbnN0YW5jZS5vcGVuKG9wdGlvbnMpO1xuXHR9LFxuXG5cdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gJC5tYWduaWZpY1BvcHVwLmluc3RhbmNlICYmICQubWFnbmlmaWNQb3B1cC5pbnN0YW5jZS5jbG9zZSgpO1xuXHR9LFxuXG5cdHJlZ2lzdGVyTW9kdWxlOiBmdW5jdGlvbihuYW1lLCBtb2R1bGUpIHtcblx0XHRpZihtb2R1bGUub3B0aW9ucykge1xuXHRcdFx0JC5tYWduaWZpY1BvcHVwLmRlZmF1bHRzW25hbWVdID0gbW9kdWxlLm9wdGlvbnM7XG5cdFx0fVxuXHRcdCQuZXh0ZW5kKHRoaXMucHJvdG8sIG1vZHVsZS5wcm90byk7XG5cdFx0dGhpcy5tb2R1bGVzLnB1c2gobmFtZSk7XG5cdH0sXG5cblx0ZGVmYXVsdHM6IHtcblxuXHRcdC8vIEluZm8gYWJvdXQgb3B0aW9ucyBpcyBpbiBkb2NzOlxuXHRcdC8vIGh0dHA6Ly9kaW1zZW1lbm92LmNvbS9wbHVnaW5zL21hZ25pZmljLXBvcHVwL2RvY3VtZW50YXRpb24uaHRtbCNvcHRpb25zXG5cblx0XHRkaXNhYmxlT246IDAsXG5cblx0XHRrZXk6IG51bGwsXG5cblx0XHRtaWRDbGljazogZmFsc2UsXG5cblx0XHRtYWluQ2xhc3M6ICcnLFxuXG5cdFx0cHJlbG9hZGVyOiB0cnVlLFxuXG5cdFx0Zm9jdXM6ICcnLCAvLyBDU1Mgc2VsZWN0b3Igb2YgaW5wdXQgdG8gZm9jdXMgYWZ0ZXIgcG9wdXAgaXMgb3BlbmVkXG5cblx0XHRjbG9zZU9uQ29udGVudENsaWNrOiBmYWxzZSxcblxuXHRcdGNsb3NlT25CZ0NsaWNrOiB0cnVlLFxuXG5cdFx0Y2xvc2VCdG5JbnNpZGU6IHRydWUsXG5cblx0XHRzaG93Q2xvc2VCdG46IHRydWUsXG5cblx0XHRlbmFibGVFc2NhcGVLZXk6IHRydWUsXG5cblx0XHRtb2RhbDogZmFsc2UsXG5cblx0XHRhbGlnblRvcDogZmFsc2UsXG5cblx0XHRyZW1vdmFsRGVsYXk6IDAsXG5cblx0XHRwcmVwZW5kVG86IG51bGwsXG5cblx0XHRmaXhlZENvbnRlbnRQb3M6ICdhdXRvJyxcblxuXHRcdGZpeGVkQmdQb3M6ICdhdXRvJyxcblxuXHRcdG92ZXJmbG93WTogJ2F1dG8nLFxuXG5cdFx0Y2xvc2VNYXJrdXA6ICc8YnV0dG9uIHRpdGxlPVwiJXRpdGxlJVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm1mcC1jbG9zZVwiPiYjMjE1OzwvYnV0dG9uPicsXG5cblx0XHR0Q2xvc2U6ICdDbG9zZSAoRXNjKScsXG5cblx0XHR0TG9hZGluZzogJ0xvYWRpbmcuLi4nLFxuXG5cdFx0YXV0b0ZvY3VzTGFzdDogdHJ1ZVxuXG5cdH1cbn07XG5cblxuXG4kLmZuLm1hZ25pZmljUG9wdXAgPSBmdW5jdGlvbihvcHRpb25zKSB7XG5cdF9jaGVja0luc3RhbmNlKCk7XG5cblx0dmFyIGpxRWwgPSAkKHRoaXMpO1xuXG5cdC8vIFdlIGNhbGwgc29tZSBBUEkgbWV0aG9kIG9mIGZpcnN0IHBhcmFtIGlzIGEgc3RyaW5nXG5cdGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJzdHJpbmdcIiApIHtcblxuXHRcdGlmKG9wdGlvbnMgPT09ICdvcGVuJykge1xuXHRcdFx0dmFyIGl0ZW1zLFxuXHRcdFx0XHRpdGVtT3B0cyA9IF9pc0pRID8ganFFbC5kYXRhKCdtYWduaWZpY1BvcHVwJykgOiBqcUVsWzBdLm1hZ25pZmljUG9wdXAsXG5cdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQoYXJndW1lbnRzWzFdLCAxMCkgfHwgMDtcblxuXHRcdFx0aWYoaXRlbU9wdHMuaXRlbXMpIHtcblx0XHRcdFx0aXRlbXMgPSBpdGVtT3B0cy5pdGVtc1tpbmRleF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpdGVtcyA9IGpxRWw7XG5cdFx0XHRcdGlmKGl0ZW1PcHRzLmRlbGVnYXRlKSB7XG5cdFx0XHRcdFx0aXRlbXMgPSBpdGVtcy5maW5kKGl0ZW1PcHRzLmRlbGVnYXRlKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpdGVtcyA9IGl0ZW1zLmVxKCBpbmRleCApO1xuXHRcdFx0fVxuXHRcdFx0bWZwLl9vcGVuQ2xpY2soe21mcEVsOml0ZW1zfSwganFFbCwgaXRlbU9wdHMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZihtZnAuaXNPcGVuKVxuXHRcdFx0XHRtZnBbb3B0aW9uc10uYXBwbHkobWZwLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcblx0XHR9XG5cblx0fSBlbHNlIHtcblx0XHQvLyBjbG9uZSBvcHRpb25zIG9ialxuXHRcdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgb3B0aW9ucyk7XG5cblx0XHQvKlxuXHRcdCAqIEFzIFplcHRvIGRvZXNuJ3Qgc3VwcG9ydCAuZGF0YSgpIG1ldGhvZCBmb3Igb2JqZWN0c1xuXHRcdCAqIGFuZCBpdCB3b3JrcyBvbmx5IGluIG5vcm1hbCBicm93c2Vyc1xuXHRcdCAqIHdlIGFzc2lnbiBcIm9wdGlvbnNcIiBvYmplY3QgZGlyZWN0bHkgdG8gdGhlIERPTSBlbGVtZW50LiBGVFchXG5cdFx0ICovXG5cdFx0aWYoX2lzSlEpIHtcblx0XHRcdGpxRWwuZGF0YSgnbWFnbmlmaWNQb3B1cCcsIG9wdGlvbnMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRqcUVsWzBdLm1hZ25pZmljUG9wdXAgPSBvcHRpb25zO1xuXHRcdH1cblxuXHRcdG1mcC5hZGRHcm91cChqcUVsLCBvcHRpb25zKTtcblxuXHR9XG5cdHJldHVybiBqcUVsO1xufTtcblxuLyo+PmNvcmUqL1xuXG4vKj4+aW5saW5lKi9cblxudmFyIElOTElORV9OUyA9ICdpbmxpbmUnLFxuXHRfaGlkZGVuQ2xhc3MsXG5cdF9pbmxpbmVQbGFjZWhvbGRlcixcblx0X2xhc3RJbmxpbmVFbGVtZW50LFxuXHRfcHV0SW5saW5lRWxlbWVudHNCYWNrID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoX2xhc3RJbmxpbmVFbGVtZW50KSB7XG5cdFx0XHRfaW5saW5lUGxhY2Vob2xkZXIuYWZ0ZXIoIF9sYXN0SW5saW5lRWxlbWVudC5hZGRDbGFzcyhfaGlkZGVuQ2xhc3MpICkuZGV0YWNoKCk7XG5cdFx0XHRfbGFzdElubGluZUVsZW1lbnQgPSBudWxsO1xuXHRcdH1cblx0fTtcblxuJC5tYWduaWZpY1BvcHVwLnJlZ2lzdGVyTW9kdWxlKElOTElORV9OUywge1xuXHRvcHRpb25zOiB7XG5cdFx0aGlkZGVuQ2xhc3M6ICdoaWRlJywgLy8gd2lsbCBiZSBhcHBlbmRlZCB3aXRoIGBtZnAtYCBwcmVmaXhcblx0XHRtYXJrdXA6ICcnLFxuXHRcdHROb3RGb3VuZDogJ0NvbnRlbnQgbm90IGZvdW5kJ1xuXHR9LFxuXHRwcm90bzoge1xuXG5cdFx0aW5pdElubGluZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRtZnAudHlwZXMucHVzaChJTkxJTkVfTlMpO1xuXG5cdFx0XHRfbWZwT24oQ0xPU0VfRVZFTlQrJy4nK0lOTElORV9OUywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF9wdXRJbmxpbmVFbGVtZW50c0JhY2soKTtcblx0XHRcdH0pO1xuXHRcdH0sXG5cblx0XHRnZXRJbmxpbmU6IGZ1bmN0aW9uKGl0ZW0sIHRlbXBsYXRlKSB7XG5cblx0XHRcdF9wdXRJbmxpbmVFbGVtZW50c0JhY2soKTtcblxuXHRcdFx0aWYoaXRlbS5zcmMpIHtcblx0XHRcdFx0dmFyIGlubGluZVN0ID0gbWZwLnN0LmlubGluZSxcblx0XHRcdFx0XHRlbCA9ICQoaXRlbS5zcmMpO1xuXG5cdFx0XHRcdGlmKGVsLmxlbmd0aCkge1xuXG5cdFx0XHRcdFx0Ly8gSWYgdGFyZ2V0IGVsZW1lbnQgaGFzIHBhcmVudCAtIHdlIHJlcGxhY2UgaXQgd2l0aCBwbGFjZWhvbGRlciBhbmQgcHV0IGl0IGJhY2sgYWZ0ZXIgcG9wdXAgaXMgY2xvc2VkXG5cdFx0XHRcdFx0dmFyIHBhcmVudCA9IGVsWzBdLnBhcmVudE5vZGU7XG5cdFx0XHRcdFx0aWYocGFyZW50ICYmIHBhcmVudC50YWdOYW1lKSB7XG5cdFx0XHRcdFx0XHRpZighX2lubGluZVBsYWNlaG9sZGVyKSB7XG5cdFx0XHRcdFx0XHRcdF9oaWRkZW5DbGFzcyA9IGlubGluZVN0LmhpZGRlbkNsYXNzO1xuXHRcdFx0XHRcdFx0XHRfaW5saW5lUGxhY2Vob2xkZXIgPSBfZ2V0RWwoX2hpZGRlbkNsYXNzKTtcblx0XHRcdFx0XHRcdFx0X2hpZGRlbkNsYXNzID0gJ21mcC0nK19oaWRkZW5DbGFzcztcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdC8vIHJlcGxhY2UgdGFyZ2V0IGlubGluZSBlbGVtZW50IHdpdGggcGxhY2Vob2xkZXJcblx0XHRcdFx0XHRcdF9sYXN0SW5saW5lRWxlbWVudCA9IGVsLmFmdGVyKF9pbmxpbmVQbGFjZWhvbGRlcikuZGV0YWNoKCkucmVtb3ZlQ2xhc3MoX2hpZGRlbkNsYXNzKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRtZnAudXBkYXRlU3RhdHVzKCdyZWFkeScpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG1mcC51cGRhdGVTdGF0dXMoJ2Vycm9yJywgaW5saW5lU3QudE5vdEZvdW5kKTtcblx0XHRcdFx0XHRlbCA9ICQoJzxkaXY+Jyk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpdGVtLmlubGluZUVsZW1lbnQgPSBlbDtcblx0XHRcdFx0cmV0dXJuIGVsO1xuXHRcdFx0fVxuXG5cdFx0XHRtZnAudXBkYXRlU3RhdHVzKCdyZWFkeScpO1xuXHRcdFx0bWZwLl9wYXJzZU1hcmt1cCh0ZW1wbGF0ZSwge30sIGl0ZW0pO1xuXHRcdFx0cmV0dXJuIHRlbXBsYXRlO1xuXHRcdH1cblx0fVxufSk7XG5cbi8qPj5pbmxpbmUqL1xuXG4vKj4+YWpheCovXG52YXIgQUpBWF9OUyA9ICdhamF4Jyxcblx0X2FqYXhDdXIsXG5cdF9yZW1vdmVBamF4Q3Vyc29yID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoX2FqYXhDdXIpIHtcblx0XHRcdCQoZG9jdW1lbnQuYm9keSkucmVtb3ZlQ2xhc3MoX2FqYXhDdXIpO1xuXHRcdH1cblx0fSxcblx0X2Rlc3Ryb3lBamF4UmVxdWVzdCA9IGZ1bmN0aW9uKCkge1xuXHRcdF9yZW1vdmVBamF4Q3Vyc29yKCk7XG5cdFx0aWYobWZwLnJlcSkge1xuXHRcdFx0bWZwLnJlcS5hYm9ydCgpO1xuXHRcdH1cblx0fTtcblxuJC5tYWduaWZpY1BvcHVwLnJlZ2lzdGVyTW9kdWxlKEFKQVhfTlMsIHtcblxuXHRvcHRpb25zOiB7XG5cdFx0c2V0dGluZ3M6IG51bGwsXG5cdFx0Y3Vyc29yOiAnbWZwLWFqYXgtY3VyJyxcblx0XHR0RXJyb3I6ICc8YSBocmVmPVwiJXVybCVcIj5UaGUgY29udGVudDwvYT4gY291bGQgbm90IGJlIGxvYWRlZC4nXG5cdH0sXG5cblx0cHJvdG86IHtcblx0XHRpbml0QWpheDogZnVuY3Rpb24oKSB7XG5cdFx0XHRtZnAudHlwZXMucHVzaChBSkFYX05TKTtcblx0XHRcdF9hamF4Q3VyID0gbWZwLnN0LmFqYXguY3Vyc29yO1xuXG5cdFx0XHRfbWZwT24oQ0xPU0VfRVZFTlQrJy4nK0FKQVhfTlMsIF9kZXN0cm95QWpheFJlcXVlc3QpO1xuXHRcdFx0X21mcE9uKCdCZWZvcmVDaGFuZ2UuJyArIEFKQVhfTlMsIF9kZXN0cm95QWpheFJlcXVlc3QpO1xuXHRcdH0sXG5cdFx0Z2V0QWpheDogZnVuY3Rpb24oaXRlbSkge1xuXG5cdFx0XHRpZihfYWpheEN1cikge1xuXHRcdFx0XHQkKGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKF9hamF4Q3VyKTtcblx0XHRcdH1cblxuXHRcdFx0bWZwLnVwZGF0ZVN0YXR1cygnbG9hZGluZycpO1xuXG5cdFx0XHR2YXIgb3B0cyA9ICQuZXh0ZW5kKHtcblx0XHRcdFx0dXJsOiBpdGVtLnNyYyxcblx0XHRcdFx0c3VjY2VzczogZnVuY3Rpb24oZGF0YSwgdGV4dFN0YXR1cywganFYSFIpIHtcblx0XHRcdFx0XHR2YXIgdGVtcCA9IHtcblx0XHRcdFx0XHRcdGRhdGE6ZGF0YSxcblx0XHRcdFx0XHRcdHhocjpqcVhIUlxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRfbWZwVHJpZ2dlcignUGFyc2VBamF4JywgdGVtcCk7XG5cblx0XHRcdFx0XHRtZnAuYXBwZW5kQ29udGVudCggJCh0ZW1wLmRhdGEpLCBBSkFYX05TICk7XG5cblx0XHRcdFx0XHRpdGVtLmZpbmlzaGVkID0gdHJ1ZTtcblxuXHRcdFx0XHRcdF9yZW1vdmVBamF4Q3Vyc29yKCk7XG5cblx0XHRcdFx0XHRtZnAuX3NldEZvY3VzKCk7XG5cblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0bWZwLndyYXAuYWRkQ2xhc3MoUkVBRFlfQ0xBU1MpO1xuXHRcdFx0XHRcdH0sIDE2KTtcblxuXHRcdFx0XHRcdG1mcC51cGRhdGVTdGF0dXMoJ3JlYWR5Jyk7XG5cblx0XHRcdFx0XHRfbWZwVHJpZ2dlcignQWpheENvbnRlbnRBZGRlZCcpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRlcnJvcjogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0X3JlbW92ZUFqYXhDdXJzb3IoKTtcblx0XHRcdFx0XHRpdGVtLmZpbmlzaGVkID0gaXRlbS5sb2FkRXJyb3IgPSB0cnVlO1xuXHRcdFx0XHRcdG1mcC51cGRhdGVTdGF0dXMoJ2Vycm9yJywgbWZwLnN0LmFqYXgudEVycm9yLnJlcGxhY2UoJyV1cmwlJywgaXRlbS5zcmMpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSwgbWZwLnN0LmFqYXguc2V0dGluZ3MpO1xuXG5cdFx0XHRtZnAucmVxID0gJC5hamF4KG9wdHMpO1xuXG5cdFx0XHRyZXR1cm4gJyc7XG5cdFx0fVxuXHR9XG59KTtcblxuLyo+PmFqYXgqL1xuXG4vKj4+aW1hZ2UqL1xudmFyIF9pbWdJbnRlcnZhbCxcblx0X2dldFRpdGxlID0gZnVuY3Rpb24oaXRlbSkge1xuXHRcdGlmKGl0ZW0uZGF0YSAmJiBpdGVtLmRhdGEudGl0bGUgIT09IHVuZGVmaW5lZClcblx0XHRcdHJldHVybiBpdGVtLmRhdGEudGl0bGU7XG5cblx0XHR2YXIgc3JjID0gbWZwLnN0LmltYWdlLnRpdGxlU3JjO1xuXG5cdFx0aWYoc3JjKSB7XG5cdFx0XHRpZigkLmlzRnVuY3Rpb24oc3JjKSkge1xuXHRcdFx0XHRyZXR1cm4gc3JjLmNhbGwobWZwLCBpdGVtKTtcblx0XHRcdH0gZWxzZSBpZihpdGVtLmVsKSB7XG5cdFx0XHRcdHJldHVybiBpdGVtLmVsLmF0dHIoc3JjKSB8fCAnJztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuICcnO1xuXHR9O1xuXG4kLm1hZ25pZmljUG9wdXAucmVnaXN0ZXJNb2R1bGUoJ2ltYWdlJywge1xuXG5cdG9wdGlvbnM6IHtcblx0XHRtYXJrdXA6ICc8ZGl2IGNsYXNzPVwibWZwLWZpZ3VyZVwiPicrXG5cdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJtZnAtY2xvc2VcIj48L2Rpdj4nK1xuXHRcdFx0XHRcdCc8ZmlndXJlPicrXG5cdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIm1mcC1pbWdcIj48L2Rpdj4nK1xuXHRcdFx0XHRcdFx0JzxmaWdjYXB0aW9uPicrXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwibWZwLWJvdHRvbS1iYXJcIj4nK1xuXHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwibWZwLXRpdGxlXCI+PC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIm1mcC1jb3VudGVyXCI+PC9kaXY+Jytcblx0XHRcdFx0XHRcdFx0JzwvZGl2PicrXG5cdFx0XHRcdFx0XHQnPC9maWdjYXB0aW9uPicrXG5cdFx0XHRcdFx0JzwvZmlndXJlPicrXG5cdFx0XHRcdCc8L2Rpdj4nLFxuXHRcdGN1cnNvcjogJ21mcC16b29tLW91dC1jdXInLFxuXHRcdHRpdGxlU3JjOiAndGl0bGUnLFxuXHRcdHZlcnRpY2FsRml0OiB0cnVlLFxuXHRcdHRFcnJvcjogJzxhIGhyZWY9XCIldXJsJVwiPlRoZSBpbWFnZTwvYT4gY291bGQgbm90IGJlIGxvYWRlZC4nXG5cdH0sXG5cblx0cHJvdG86IHtcblx0XHRpbml0SW1hZ2U6IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGltZ1N0ID0gbWZwLnN0LmltYWdlLFxuXHRcdFx0XHRucyA9ICcuaW1hZ2UnO1xuXG5cdFx0XHRtZnAudHlwZXMucHVzaCgnaW1hZ2UnKTtcblxuXHRcdFx0X21mcE9uKE9QRU5fRVZFTlQrbnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihtZnAuY3Vyckl0ZW0udHlwZSA9PT0gJ2ltYWdlJyAmJiBpbWdTdC5jdXJzb3IpIHtcblx0XHRcdFx0XHQkKGRvY3VtZW50LmJvZHkpLmFkZENsYXNzKGltZ1N0LmN1cnNvcik7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRfbWZwT24oQ0xPU0VfRVZFTlQrbnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihpbWdTdC5jdXJzb3IpIHtcblx0XHRcdFx0XHQkKGRvY3VtZW50LmJvZHkpLnJlbW92ZUNsYXNzKGltZ1N0LmN1cnNvcik7XG5cdFx0XHRcdH1cblx0XHRcdFx0X3dpbmRvdy5vZmYoJ3Jlc2l6ZScgKyBFVkVOVF9OUyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0X21mcE9uKCdSZXNpemUnK25zLCBtZnAucmVzaXplSW1hZ2UpO1xuXHRcdFx0aWYobWZwLmlzTG93SUUpIHtcblx0XHRcdFx0X21mcE9uKCdBZnRlckNoYW5nZScsIG1mcC5yZXNpemVJbWFnZSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZXNpemVJbWFnZTogZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1mcC5jdXJySXRlbTtcblx0XHRcdGlmKCFpdGVtIHx8ICFpdGVtLmltZykgcmV0dXJuO1xuXG5cdFx0XHRpZihtZnAuc3QuaW1hZ2UudmVydGljYWxGaXQpIHtcblx0XHRcdFx0dmFyIGRlY3IgPSAwO1xuXHRcdFx0XHQvLyBmaXggYm94LXNpemluZyBpbiBpZTcvOFxuXHRcdFx0XHRpZihtZnAuaXNMb3dJRSkge1xuXHRcdFx0XHRcdGRlY3IgPSBwYXJzZUludChpdGVtLmltZy5jc3MoJ3BhZGRpbmctdG9wJyksIDEwKSArIHBhcnNlSW50KGl0ZW0uaW1nLmNzcygncGFkZGluZy1ib3R0b20nKSwxMCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aXRlbS5pbWcuY3NzKCdtYXgtaGVpZ2h0JywgbWZwLndILWRlY3IpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0X29uSW1hZ2VIYXNTaXplOiBmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRpZihpdGVtLmltZykge1xuXG5cdFx0XHRcdGl0ZW0uaGFzU2l6ZSA9IHRydWU7XG5cblx0XHRcdFx0aWYoX2ltZ0ludGVydmFsKSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbChfaW1nSW50ZXJ2YWwpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aXRlbS5pc0NoZWNraW5nSW1nU2l6ZSA9IGZhbHNlO1xuXG5cdFx0XHRcdF9tZnBUcmlnZ2VyKCdJbWFnZUhhc1NpemUnLCBpdGVtKTtcblxuXHRcdFx0XHRpZihpdGVtLmltZ0hpZGRlbikge1xuXHRcdFx0XHRcdGlmKG1mcC5jb250ZW50KVxuXHRcdFx0XHRcdFx0bWZwLmNvbnRlbnQucmVtb3ZlQ2xhc3MoJ21mcC1sb2FkaW5nJyk7XG5cblx0XHRcdFx0XHRpdGVtLmltZ0hpZGRlbiA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0LyoqXG5cdFx0ICogRnVuY3Rpb24gdGhhdCBsb29wcyB1bnRpbCB0aGUgaW1hZ2UgaGFzIHNpemUgdG8gZGlzcGxheSBlbGVtZW50cyB0aGF0IHJlbHkgb24gaXQgYXNhcFxuXHRcdCAqL1xuXHRcdGZpbmRJbWFnZVNpemU6IGZ1bmN0aW9uKGl0ZW0pIHtcblxuXHRcdFx0dmFyIGNvdW50ZXIgPSAwLFxuXHRcdFx0XHRpbWcgPSBpdGVtLmltZ1swXSxcblx0XHRcdFx0bWZwU2V0SW50ZXJ2YWwgPSBmdW5jdGlvbihkZWxheSkge1xuXG5cdFx0XHRcdFx0aWYoX2ltZ0ludGVydmFsKSB7XG5cdFx0XHRcdFx0XHRjbGVhckludGVydmFsKF9pbWdJbnRlcnZhbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIGRlY2VsZXJhdGluZyBpbnRlcnZhbCB0aGF0IGNoZWNrcyBmb3Igc2l6ZSBvZiBhbiBpbWFnZVxuXHRcdFx0XHRcdF9pbWdJbnRlcnZhbCA9IHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYoaW1nLm5hdHVyYWxXaWR0aCA+IDApIHtcblx0XHRcdFx0XHRcdFx0bWZwLl9vbkltYWdlSGFzU2l6ZShpdGVtKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZihjb3VudGVyID4gMjAwKSB7XG5cdFx0XHRcdFx0XHRcdGNsZWFySW50ZXJ2YWwoX2ltZ0ludGVydmFsKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0Y291bnRlcisrO1xuXHRcdFx0XHRcdFx0aWYoY291bnRlciA9PT0gMykge1xuXHRcdFx0XHRcdFx0XHRtZnBTZXRJbnRlcnZhbCgxMCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoY291bnRlciA9PT0gNDApIHtcblx0XHRcdFx0XHRcdFx0bWZwU2V0SW50ZXJ2YWwoNTApO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmKGNvdW50ZXIgPT09IDEwMCkge1xuXHRcdFx0XHRcdFx0XHRtZnBTZXRJbnRlcnZhbCg1MDApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0sIGRlbGF5KTtcblx0XHRcdFx0fTtcblxuXHRcdFx0bWZwU2V0SW50ZXJ2YWwoMSk7XG5cdFx0fSxcblxuXHRcdGdldEltYWdlOiBmdW5jdGlvbihpdGVtLCB0ZW1wbGF0ZSkge1xuXG5cdFx0XHR2YXIgZ3VhcmQgPSAwLFxuXG5cdFx0XHRcdC8vIGltYWdlIGxvYWQgY29tcGxldGUgaGFuZGxlclxuXHRcdFx0XHRvbkxvYWRDb21wbGV0ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKGl0ZW0pIHtcblx0XHRcdFx0XHRcdGlmIChpdGVtLmltZ1swXS5jb21wbGV0ZSkge1xuXHRcdFx0XHRcdFx0XHRpdGVtLmltZy5vZmYoJy5tZnBsb2FkZXInKTtcblxuXHRcdFx0XHRcdFx0XHRpZihpdGVtID09PSBtZnAuY3Vyckl0ZW0pe1xuXHRcdFx0XHRcdFx0XHRcdG1mcC5fb25JbWFnZUhhc1NpemUoaXRlbSk7XG5cblx0XHRcdFx0XHRcdFx0XHRtZnAudXBkYXRlU3RhdHVzKCdyZWFkeScpO1xuXHRcdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdFx0aXRlbS5oYXNTaXplID0gdHJ1ZTtcblx0XHRcdFx0XHRcdFx0aXRlbS5sb2FkZWQgPSB0cnVlO1xuXG5cdFx0XHRcdFx0XHRcdF9tZnBUcmlnZ2VyKCdJbWFnZUxvYWRDb21wbGV0ZScpO1xuXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0Ly8gaWYgaW1hZ2UgY29tcGxldGUgY2hlY2sgZmFpbHMgMjAwIHRpbWVzICgyMCBzZWMpLCB3ZSBhc3N1bWUgdGhhdCB0aGVyZSB3YXMgYW4gZXJyb3IuXG5cdFx0XHRcdFx0XHRcdGd1YXJkKys7XG5cdFx0XHRcdFx0XHRcdGlmKGd1YXJkIDwgMjAwKSB7XG5cdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChvbkxvYWRDb21wbGV0ZSwxMDApO1xuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdG9uTG9hZEVycm9yKCk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0Ly8gaW1hZ2UgZXJyb3IgaGFuZGxlclxuXHRcdFx0XHRvbkxvYWRFcnJvciA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGlmKGl0ZW0pIHtcblx0XHRcdFx0XHRcdGl0ZW0uaW1nLm9mZignLm1mcGxvYWRlcicpO1xuXHRcdFx0XHRcdFx0aWYoaXRlbSA9PT0gbWZwLmN1cnJJdGVtKXtcblx0XHRcdFx0XHRcdFx0bWZwLl9vbkltYWdlSGFzU2l6ZShpdGVtKTtcblx0XHRcdFx0XHRcdFx0bWZwLnVwZGF0ZVN0YXR1cygnZXJyb3InLCBpbWdTdC50RXJyb3IucmVwbGFjZSgnJXVybCUnLCBpdGVtLnNyYykgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aXRlbS5oYXNTaXplID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGl0ZW0ubG9hZGVkID0gdHJ1ZTtcblx0XHRcdFx0XHRcdGl0ZW0ubG9hZEVycm9yID0gdHJ1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGltZ1N0ID0gbWZwLnN0LmltYWdlO1xuXG5cblx0XHRcdHZhciBlbCA9IHRlbXBsYXRlLmZpbmQoJy5tZnAtaW1nJyk7XG5cdFx0XHRpZihlbC5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIGltZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuXHRcdFx0XHRpbWcuY2xhc3NOYW1lID0gJ21mcC1pbWcnO1xuXHRcdFx0XHRpZihpdGVtLmVsICYmIGl0ZW0uZWwuZmluZCgnaW1nJykubGVuZ3RoKSB7XG5cdFx0XHRcdFx0aW1nLmFsdCA9IGl0ZW0uZWwuZmluZCgnaW1nJykuYXR0cignYWx0Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aXRlbS5pbWcgPSAkKGltZykub24oJ2xvYWQubWZwbG9hZGVyJywgb25Mb2FkQ29tcGxldGUpLm9uKCdlcnJvci5tZnBsb2FkZXInLCBvbkxvYWRFcnJvcik7XG5cdFx0XHRcdGltZy5zcmMgPSBpdGVtLnNyYztcblxuXHRcdFx0XHQvLyB3aXRob3V0IGNsb25lKCkgXCJlcnJvclwiIGV2ZW50IGlzIG5vdCBmaXJpbmcgd2hlbiBJTUcgaXMgcmVwbGFjZWQgYnkgbmV3IElNR1xuXHRcdFx0XHQvLyBUT0RPOiBmaW5kIGEgd2F5IHRvIGF2b2lkIHN1Y2ggY2xvbmluZ1xuXHRcdFx0XHRpZihlbC5pcygnaW1nJykpIHtcblx0XHRcdFx0XHRpdGVtLmltZyA9IGl0ZW0uaW1nLmNsb25lKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpbWcgPSBpdGVtLmltZ1swXTtcblx0XHRcdFx0aWYoaW1nLm5hdHVyYWxXaWR0aCA+IDApIHtcblx0XHRcdFx0XHRpdGVtLmhhc1NpemUgPSB0cnVlO1xuXHRcdFx0XHR9IGVsc2UgaWYoIWltZy53aWR0aCkge1xuXHRcdFx0XHRcdGl0ZW0uaGFzU2l6ZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdG1mcC5fcGFyc2VNYXJrdXAodGVtcGxhdGUsIHtcblx0XHRcdFx0dGl0bGU6IF9nZXRUaXRsZShpdGVtKSxcblx0XHRcdFx0aW1nX3JlcGxhY2VXaXRoOiBpdGVtLmltZ1xuXHRcdFx0fSwgaXRlbSk7XG5cblx0XHRcdG1mcC5yZXNpemVJbWFnZSgpO1xuXG5cdFx0XHRpZihpdGVtLmhhc1NpemUpIHtcblx0XHRcdFx0aWYoX2ltZ0ludGVydmFsKSBjbGVhckludGVydmFsKF9pbWdJbnRlcnZhbCk7XG5cblx0XHRcdFx0aWYoaXRlbS5sb2FkRXJyb3IpIHtcblx0XHRcdFx0XHR0ZW1wbGF0ZS5hZGRDbGFzcygnbWZwLWxvYWRpbmcnKTtcblx0XHRcdFx0XHRtZnAudXBkYXRlU3RhdHVzKCdlcnJvcicsIGltZ1N0LnRFcnJvci5yZXBsYWNlKCcldXJsJScsIGl0ZW0uc3JjKSApO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRlbXBsYXRlLnJlbW92ZUNsYXNzKCdtZnAtbG9hZGluZycpO1xuXHRcdFx0XHRcdG1mcC51cGRhdGVTdGF0dXMoJ3JlYWR5Jyk7XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuIHRlbXBsYXRlO1xuXHRcdFx0fVxuXG5cdFx0XHRtZnAudXBkYXRlU3RhdHVzKCdsb2FkaW5nJyk7XG5cdFx0XHRpdGVtLmxvYWRpbmcgPSB0cnVlO1xuXG5cdFx0XHRpZighaXRlbS5oYXNTaXplKSB7XG5cdFx0XHRcdGl0ZW0uaW1nSGlkZGVuID0gdHJ1ZTtcblx0XHRcdFx0dGVtcGxhdGUuYWRkQ2xhc3MoJ21mcC1sb2FkaW5nJyk7XG5cdFx0XHRcdG1mcC5maW5kSW1hZ2VTaXplKGl0ZW0pO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gdGVtcGxhdGU7XG5cdFx0fVxuXHR9XG59KTtcblxuLyo+PmltYWdlKi9cblxuLyo+Pnpvb20qL1xudmFyIGhhc01velRyYW5zZm9ybSxcblx0Z2V0SGFzTW96VHJhbnNmb3JtID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoaGFzTW96VHJhbnNmb3JtID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGhhc01velRyYW5zZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKS5zdHlsZS5Nb3pUcmFuc2Zvcm0gIT09IHVuZGVmaW5lZDtcblx0XHR9XG5cdFx0cmV0dXJuIGhhc01velRyYW5zZm9ybTtcblx0fTtcblxuJC5tYWduaWZpY1BvcHVwLnJlZ2lzdGVyTW9kdWxlKCd6b29tJywge1xuXG5cdG9wdGlvbnM6IHtcblx0XHRlbmFibGVkOiBmYWxzZSxcblx0XHRlYXNpbmc6ICdlYXNlLWluLW91dCcsXG5cdFx0ZHVyYXRpb246IDMwMCxcblx0XHRvcGVuZXI6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50LmlzKCdpbWcnKSA/IGVsZW1lbnQgOiBlbGVtZW50LmZpbmQoJ2ltZycpO1xuXHRcdH1cblx0fSxcblxuXHRwcm90bzoge1xuXG5cdFx0aW5pdFpvb206IGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHpvb21TdCA9IG1mcC5zdC56b29tLFxuXHRcdFx0XHRucyA9ICcuem9vbScsXG5cdFx0XHRcdGltYWdlO1xuXG5cdFx0XHRpZighem9vbVN0LmVuYWJsZWQgfHwgIW1mcC5zdXBwb3J0c1RyYW5zaXRpb24pIHtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgZHVyYXRpb24gPSB6b29tU3QuZHVyYXRpb24sXG5cdFx0XHRcdGdldEVsVG9BbmltYXRlID0gZnVuY3Rpb24oaW1hZ2UpIHtcblx0XHRcdFx0XHR2YXIgbmV3SW1nID0gaW1hZ2UuY2xvbmUoKS5yZW1vdmVBdHRyKCdzdHlsZScpLnJlbW92ZUF0dHIoJ2NsYXNzJykuYWRkQ2xhc3MoJ21mcC1hbmltYXRlZC1pbWFnZScpLFxuXHRcdFx0XHRcdFx0dHJhbnNpdGlvbiA9ICdhbGwgJysoem9vbVN0LmR1cmF0aW9uLzEwMDApKydzICcgKyB6b29tU3QuZWFzaW5nLFxuXHRcdFx0XHRcdFx0Y3NzT2JqID0ge1xuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogJ2ZpeGVkJyxcblx0XHRcdFx0XHRcdFx0ekluZGV4OiA5OTk5LFxuXHRcdFx0XHRcdFx0XHRsZWZ0OiAwLFxuXHRcdFx0XHRcdFx0XHR0b3A6IDAsXG5cdFx0XHRcdFx0XHRcdCctd2Via2l0LWJhY2tmYWNlLXZpc2liaWxpdHknOiAnaGlkZGVuJ1xuXHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdHQgPSAndHJhbnNpdGlvbic7XG5cblx0XHRcdFx0XHRjc3NPYmpbJy13ZWJraXQtJyt0XSA9IGNzc09ialsnLW1vei0nK3RdID0gY3NzT2JqWyctby0nK3RdID0gY3NzT2JqW3RdID0gdHJhbnNpdGlvbjtcblxuXHRcdFx0XHRcdG5ld0ltZy5jc3MoY3NzT2JqKTtcblx0XHRcdFx0XHRyZXR1cm4gbmV3SW1nO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzaG93TWFpbkNvbnRlbnQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRtZnAuY29udGVudC5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRvcGVuVGltZW91dCxcblx0XHRcdFx0YW5pbWF0ZWRJbWc7XG5cblx0XHRcdF9tZnBPbignQnVpbGRDb250cm9scycrbnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihtZnAuX2FsbG93Wm9vbSgpKSB7XG5cblx0XHRcdFx0XHRjbGVhclRpbWVvdXQob3BlblRpbWVvdXQpO1xuXHRcdFx0XHRcdG1mcC5jb250ZW50LmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblxuXHRcdFx0XHRcdC8vIEJhc2ljYWxseSwgYWxsIGNvZGUgYmVsb3cgZG9lcyBpcyBjbG9uZXMgZXhpc3RpbmcgaW1hZ2UsIHB1dHMgaW4gb24gdG9wIG9mIHRoZSBjdXJyZW50IG9uZSBhbmQgYW5pbWF0ZWQgaXRcblxuXHRcdFx0XHRcdGltYWdlID0gbWZwLl9nZXRJdGVtVG9ab29tKCk7XG5cblx0XHRcdFx0XHRpZighaW1hZ2UpIHtcblx0XHRcdFx0XHRcdHNob3dNYWluQ29udGVudCgpO1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGFuaW1hdGVkSW1nID0gZ2V0RWxUb0FuaW1hdGUoaW1hZ2UpO1xuXG5cdFx0XHRcdFx0YW5pbWF0ZWRJbWcuY3NzKCBtZnAuX2dldE9mZnNldCgpICk7XG5cblx0XHRcdFx0XHRtZnAud3JhcC5hcHBlbmQoYW5pbWF0ZWRJbWcpO1xuXG5cdFx0XHRcdFx0b3BlblRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0YW5pbWF0ZWRJbWcuY3NzKCBtZnAuX2dldE9mZnNldCggdHJ1ZSApICk7XG5cdFx0XHRcdFx0XHRvcGVuVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0XHRcdFx0c2hvd01haW5Db250ZW50KCk7XG5cblx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRhbmltYXRlZEltZy5yZW1vdmUoKTtcblx0XHRcdFx0XHRcdFx0XHRpbWFnZSA9IGFuaW1hdGVkSW1nID0gbnVsbDtcblx0XHRcdFx0XHRcdFx0XHRfbWZwVHJpZ2dlcignWm9vbUFuaW1hdGlvbkVuZGVkJyk7XG5cdFx0XHRcdFx0XHRcdH0sIDE2KTsgLy8gYXZvaWQgYmxpbmsgd2hlbiBzd2l0Y2hpbmcgaW1hZ2VzXG5cblx0XHRcdFx0XHRcdH0sIGR1cmF0aW9uKTsgLy8gdGhpcyB0aW1lb3V0IGVxdWFscyBhbmltYXRpb24gZHVyYXRpb25cblxuXHRcdFx0XHRcdH0sIDE2KTsgLy8gYnkgYWRkaW5nIHRoaXMgdGltZW91dCB3ZSBhdm9pZCBzaG9ydCBnbGl0Y2ggYXQgdGhlIGJlZ2lubmluZyBvZiBhbmltYXRpb25cblxuXG5cdFx0XHRcdFx0Ly8gTG90cyBvZiB0aW1lb3V0cy4uLlxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdF9tZnBPbihCRUZPUkVfQ0xPU0VfRVZFTlQrbnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihtZnAuX2FsbG93Wm9vbSgpKSB7XG5cblx0XHRcdFx0XHRjbGVhclRpbWVvdXQob3BlblRpbWVvdXQpO1xuXG5cdFx0XHRcdFx0bWZwLnN0LnJlbW92YWxEZWxheSA9IGR1cmF0aW9uO1xuXG5cdFx0XHRcdFx0aWYoIWltYWdlKSB7XG5cdFx0XHRcdFx0XHRpbWFnZSA9IG1mcC5fZ2V0SXRlbVRvWm9vbSgpO1xuXHRcdFx0XHRcdFx0aWYoIWltYWdlKSB7XG5cdFx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGFuaW1hdGVkSW1nID0gZ2V0RWxUb0FuaW1hdGUoaW1hZ2UpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGFuaW1hdGVkSW1nLmNzcyggbWZwLl9nZXRPZmZzZXQodHJ1ZSkgKTtcblx0XHRcdFx0XHRtZnAud3JhcC5hcHBlbmQoYW5pbWF0ZWRJbWcpO1xuXHRcdFx0XHRcdG1mcC5jb250ZW50LmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcblxuXHRcdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRhbmltYXRlZEltZy5jc3MoIG1mcC5fZ2V0T2Zmc2V0KCkgKTtcblx0XHRcdFx0XHR9LCAxNik7XG5cdFx0XHRcdH1cblxuXHRcdFx0fSk7XG5cblx0XHRcdF9tZnBPbihDTE9TRV9FVkVOVCtucywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKG1mcC5fYWxsb3dab29tKCkpIHtcblx0XHRcdFx0XHRzaG93TWFpbkNvbnRlbnQoKTtcblx0XHRcdFx0XHRpZihhbmltYXRlZEltZykge1xuXHRcdFx0XHRcdFx0YW5pbWF0ZWRJbWcucmVtb3ZlKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGltYWdlID0gbnVsbDtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fSxcblxuXHRcdF9hbGxvd1pvb206IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIG1mcC5jdXJySXRlbS50eXBlID09PSAnaW1hZ2UnO1xuXHRcdH0sXG5cblx0XHRfZ2V0SXRlbVRvWm9vbTogZnVuY3Rpb24oKSB7XG5cdFx0XHRpZihtZnAuY3Vyckl0ZW0uaGFzU2l6ZSkge1xuXHRcdFx0XHRyZXR1cm4gbWZwLmN1cnJJdGVtLmltZztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9LFxuXG5cdFx0Ly8gR2V0IGVsZW1lbnQgcG9zdGlvbiByZWxhdGl2ZSB0byB2aWV3cG9ydFxuXHRcdF9nZXRPZmZzZXQ6IGZ1bmN0aW9uKGlzTGFyZ2UpIHtcblx0XHRcdHZhciBlbDtcblx0XHRcdGlmKGlzTGFyZ2UpIHtcblx0XHRcdFx0ZWwgPSBtZnAuY3Vyckl0ZW0uaW1nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZWwgPSBtZnAuc3Quem9vbS5vcGVuZXIobWZwLmN1cnJJdGVtLmVsIHx8IG1mcC5jdXJySXRlbSk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBvZmZzZXQgPSBlbC5vZmZzZXQoKTtcblx0XHRcdHZhciBwYWRkaW5nVG9wID0gcGFyc2VJbnQoZWwuY3NzKCdwYWRkaW5nLXRvcCcpLDEwKTtcblx0XHRcdHZhciBwYWRkaW5nQm90dG9tID0gcGFyc2VJbnQoZWwuY3NzKCdwYWRkaW5nLWJvdHRvbScpLDEwKTtcblx0XHRcdG9mZnNldC50b3AgLT0gKCAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgLSBwYWRkaW5nVG9wICk7XG5cblxuXHRcdFx0LypcblxuXHRcdFx0QW5pbWF0aW5nIGxlZnQgKyB0b3AgKyB3aWR0aC9oZWlnaHQgbG9va3MgZ2xpdGNoeSBpbiBGaXJlZm94LCBidXQgcGVyZmVjdCBpbiBDaHJvbWUuIEFuZCB2aWNlLXZlcnNhLlxuXG5cdFx0XHQgKi9cblx0XHRcdHZhciBvYmogPSB7XG5cdFx0XHRcdHdpZHRoOiBlbC53aWR0aCgpLFxuXHRcdFx0XHQvLyBmaXggWmVwdG8gaGVpZ2h0K3BhZGRpbmcgaXNzdWVcblx0XHRcdFx0aGVpZ2h0OiAoX2lzSlEgPyBlbC5pbm5lckhlaWdodCgpIDogZWxbMF0ub2Zmc2V0SGVpZ2h0KSAtIHBhZGRpbmdCb3R0b20gLSBwYWRkaW5nVG9wXG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBJIGhhdGUgdG8gZG8gdGhpcywgYnV0IHRoZXJlIGlzIG5vIGFub3RoZXIgb3B0aW9uXG5cdFx0XHRpZiggZ2V0SGFzTW96VHJhbnNmb3JtKCkgKSB7XG5cdFx0XHRcdG9ialsnLW1vei10cmFuc2Zvcm0nXSA9IG9ialsndHJhbnNmb3JtJ10gPSAndHJhbnNsYXRlKCcgKyBvZmZzZXQubGVmdCArICdweCwnICsgb2Zmc2V0LnRvcCArICdweCknO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b2JqLmxlZnQgPSBvZmZzZXQubGVmdDtcblx0XHRcdFx0b2JqLnRvcCA9IG9mZnNldC50b3A7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblxuXHR9XG59KTtcblxuXG5cbi8qPj56b29tKi9cblxuLyo+PmlmcmFtZSovXG5cbnZhciBJRlJBTUVfTlMgPSAnaWZyYW1lJyxcblx0X2VtcHR5UGFnZSA9ICcvL2Fib3V0OmJsYW5rJyxcblxuXHRfZml4SWZyYW1lQnVncyA9IGZ1bmN0aW9uKGlzU2hvd2luZykge1xuXHRcdGlmKG1mcC5jdXJyVGVtcGxhdGVbSUZSQU1FX05TXSkge1xuXHRcdFx0dmFyIGVsID0gbWZwLmN1cnJUZW1wbGF0ZVtJRlJBTUVfTlNdLmZpbmQoJ2lmcmFtZScpO1xuXHRcdFx0aWYoZWwubGVuZ3RoKSB7XG5cdFx0XHRcdC8vIHJlc2V0IHNyYyBhZnRlciB0aGUgcG9wdXAgaXMgY2xvc2VkIHRvIGF2b2lkIFwidmlkZW8ga2VlcHMgcGxheWluZyBhZnRlciBwb3B1cCBpcyBjbG9zZWRcIiBidWdcblx0XHRcdFx0aWYoIWlzU2hvd2luZykge1xuXHRcdFx0XHRcdGVsWzBdLnNyYyA9IF9lbXB0eVBhZ2U7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBJRTggYmxhY2sgc2NyZWVuIGJ1ZyBmaXhcblx0XHRcdFx0aWYobWZwLmlzSUU4KSB7XG5cdFx0XHRcdFx0ZWwuY3NzKCdkaXNwbGF5JywgaXNTaG93aW5nID8gJ2Jsb2NrJyA6ICdub25lJyk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH07XG5cbiQubWFnbmlmaWNQb3B1cC5yZWdpc3Rlck1vZHVsZShJRlJBTUVfTlMsIHtcblxuXHRvcHRpb25zOiB7XG5cdFx0bWFya3VwOiAnPGRpdiBjbGFzcz1cIm1mcC1pZnJhbWUtc2NhbGVyXCI+Jytcblx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cIm1mcC1jbG9zZVwiPjwvZGl2PicrXG5cdFx0XHRcdFx0JzxpZnJhbWUgY2xhc3M9XCJtZnAtaWZyYW1lXCIgc3JjPVwiLy9hYm91dDpibGFua1wiIGZyYW1lYm9yZGVyPVwiMFwiIGFsbG93ZnVsbHNjcmVlbj48L2lmcmFtZT4nK1xuXHRcdFx0XHQnPC9kaXY+JyxcblxuXHRcdHNyY0FjdGlvbjogJ2lmcmFtZV9zcmMnLFxuXG5cdFx0Ly8gd2UgZG9uJ3QgY2FyZSBhbmQgc3VwcG9ydCBvbmx5IG9uZSBkZWZhdWx0IHR5cGUgb2YgVVJMIGJ5IGRlZmF1bHRcblx0XHRwYXR0ZXJuczoge1xuXHRcdFx0eW91dHViZToge1xuXHRcdFx0XHRpbmRleDogJ3lvdXR1YmUuY29tJyxcblx0XHRcdFx0aWQ6ICd2PScsXG5cdFx0XHRcdHNyYzogJy8vd3d3LnlvdXR1YmUuY29tL2VtYmVkLyVpZCU/YXV0b3BsYXk9MSdcblx0XHRcdH0sXG5cdFx0XHR2aW1lbzoge1xuXHRcdFx0XHRpbmRleDogJ3ZpbWVvLmNvbS8nLFxuXHRcdFx0XHRpZDogJy8nLFxuXHRcdFx0XHRzcmM6ICcvL3BsYXllci52aW1lby5jb20vdmlkZW8vJWlkJT9hdXRvcGxheT0xJ1xuXHRcdFx0fSxcblx0XHRcdGdtYXBzOiB7XG5cdFx0XHRcdGluZGV4OiAnLy9tYXBzLmdvb2dsZS4nLFxuXHRcdFx0XHRzcmM6ICclaWQlJm91dHB1dD1lbWJlZCdcblx0XHRcdH1cblx0XHR9XG5cdH0sXG5cblx0cHJvdG86IHtcblx0XHRpbml0SWZyYW1lOiBmdW5jdGlvbigpIHtcblx0XHRcdG1mcC50eXBlcy5wdXNoKElGUkFNRV9OUyk7XG5cblx0XHRcdF9tZnBPbignQmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZSwgcHJldlR5cGUsIG5ld1R5cGUpIHtcblx0XHRcdFx0aWYocHJldlR5cGUgIT09IG5ld1R5cGUpIHtcblx0XHRcdFx0XHRpZihwcmV2VHlwZSA9PT0gSUZSQU1FX05TKSB7XG5cdFx0XHRcdFx0XHRfZml4SWZyYW1lQnVncygpOyAvLyBpZnJhbWUgaWYgcmVtb3ZlZFxuXHRcdFx0XHRcdH0gZWxzZSBpZihuZXdUeXBlID09PSBJRlJBTUVfTlMpIHtcblx0XHRcdFx0XHRcdF9maXhJZnJhbWVCdWdzKHRydWUpOyAvLyBpZnJhbWUgaXMgc2hvd2luZ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fS8vIGVsc2Uge1xuXHRcdFx0XHRcdC8vIGlmcmFtZSBzb3VyY2UgaXMgc3dpdGNoZWQsIGRvbid0IGRvIGFueXRoaW5nXG5cdFx0XHRcdC8vfVxuXHRcdFx0fSk7XG5cblx0XHRcdF9tZnBPbihDTE9TRV9FVkVOVCArICcuJyArIElGUkFNRV9OUywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF9maXhJZnJhbWVCdWdzKCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXG5cdFx0Z2V0SWZyYW1lOiBmdW5jdGlvbihpdGVtLCB0ZW1wbGF0ZSkge1xuXHRcdFx0dmFyIGVtYmVkU3JjID0gaXRlbS5zcmM7XG5cdFx0XHR2YXIgaWZyYW1lU3QgPSBtZnAuc3QuaWZyYW1lO1xuXG5cdFx0XHQkLmVhY2goaWZyYW1lU3QucGF0dGVybnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihlbWJlZFNyYy5pbmRleE9mKCB0aGlzLmluZGV4ICkgPiAtMSkge1xuXHRcdFx0XHRcdGlmKHRoaXMuaWQpIHtcblx0XHRcdFx0XHRcdGlmKHR5cGVvZiB0aGlzLmlkID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0XHRlbWJlZFNyYyA9IGVtYmVkU3JjLnN1YnN0cihlbWJlZFNyYy5sYXN0SW5kZXhPZih0aGlzLmlkKSt0aGlzLmlkLmxlbmd0aCwgZW1iZWRTcmMubGVuZ3RoKTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGVtYmVkU3JjID0gdGhpcy5pZC5jYWxsKCB0aGlzLCBlbWJlZFNyYyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbWJlZFNyYyA9IHRoaXMuc3JjLnJlcGxhY2UoJyVpZCUnLCBlbWJlZFNyYyApO1xuXHRcdFx0XHRcdHJldHVybiBmYWxzZTsgLy8gYnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHR2YXIgZGF0YU9iaiA9IHt9O1xuXHRcdFx0aWYoaWZyYW1lU3Quc3JjQWN0aW9uKSB7XG5cdFx0XHRcdGRhdGFPYmpbaWZyYW1lU3Quc3JjQWN0aW9uXSA9IGVtYmVkU3JjO1xuXHRcdFx0fVxuXHRcdFx0bWZwLl9wYXJzZU1hcmt1cCh0ZW1wbGF0ZSwgZGF0YU9iaiwgaXRlbSk7XG5cblx0XHRcdG1mcC51cGRhdGVTdGF0dXMoJ3JlYWR5Jyk7XG5cblx0XHRcdHJldHVybiB0ZW1wbGF0ZTtcblx0XHR9XG5cdH1cbn0pO1xuXG5cblxuLyo+PmlmcmFtZSovXG5cbi8qPj5nYWxsZXJ5Ki9cbi8qKlxuICogR2V0IGxvb3BlZCBpbmRleCBkZXBlbmRpbmcgb24gbnVtYmVyIG9mIHNsaWRlc1xuICovXG52YXIgX2dldExvb3BlZElkID0gZnVuY3Rpb24oaW5kZXgpIHtcblx0XHR2YXIgbnVtU2xpZGVzID0gbWZwLml0ZW1zLmxlbmd0aDtcblx0XHRpZihpbmRleCA+IG51bVNsaWRlcyAtIDEpIHtcblx0XHRcdHJldHVybiBpbmRleCAtIG51bVNsaWRlcztcblx0XHR9IGVsc2UgIGlmKGluZGV4IDwgMCkge1xuXHRcdFx0cmV0dXJuIG51bVNsaWRlcyArIGluZGV4O1xuXHRcdH1cblx0XHRyZXR1cm4gaW5kZXg7XG5cdH0sXG5cdF9yZXBsYWNlQ3VyclRvdGFsID0gZnVuY3Rpb24odGV4dCwgY3VyciwgdG90YWwpIHtcblx0XHRyZXR1cm4gdGV4dC5yZXBsYWNlKC8lY3VyciUvZ2ksIGN1cnIgKyAxKS5yZXBsYWNlKC8ldG90YWwlL2dpLCB0b3RhbCk7XG5cdH07XG5cbiQubWFnbmlmaWNQb3B1cC5yZWdpc3Rlck1vZHVsZSgnZ2FsbGVyeScsIHtcblxuXHRvcHRpb25zOiB7XG5cdFx0ZW5hYmxlZDogZmFsc2UsXG5cdFx0YXJyb3dNYXJrdXA6ICc8YnV0dG9uIHRpdGxlPVwiJXRpdGxlJVwiIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cIm1mcC1hcnJvdyBtZnAtYXJyb3ctJWRpciVcIj48L2J1dHRvbj4nLFxuXHRcdHByZWxvYWQ6IFswLDJdLFxuXHRcdG5hdmlnYXRlQnlJbWdDbGljazogdHJ1ZSxcblx0XHRhcnJvd3M6IHRydWUsXG5cblx0XHR0UHJldjogJ1ByZXZpb3VzIChMZWZ0IGFycm93IGtleSknLFxuXHRcdHROZXh0OiAnTmV4dCAoUmlnaHQgYXJyb3cga2V5KScsXG5cdFx0dENvdW50ZXI6ICclY3VyciUgb2YgJXRvdGFsJSdcblx0fSxcblxuXHRwcm90bzoge1xuXHRcdGluaXRHYWxsZXJ5OiBmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGdTdCA9IG1mcC5zdC5nYWxsZXJ5LFxuXHRcdFx0XHRucyA9ICcubWZwLWdhbGxlcnknO1xuXG5cdFx0XHRtZnAuZGlyZWN0aW9uID0gdHJ1ZTsgLy8gdHJ1ZSAtIG5leHQsIGZhbHNlIC0gcHJldlxuXG5cdFx0XHRpZighZ1N0IHx8ICFnU3QuZW5hYmxlZCApIHJldHVybiBmYWxzZTtcblxuXHRcdFx0X3dyYXBDbGFzc2VzICs9ICcgbWZwLWdhbGxlcnknO1xuXG5cdFx0XHRfbWZwT24oT1BFTl9FVkVOVCtucywgZnVuY3Rpb24oKSB7XG5cblx0XHRcdFx0aWYoZ1N0Lm5hdmlnYXRlQnlJbWdDbGljaykge1xuXHRcdFx0XHRcdG1mcC53cmFwLm9uKCdjbGljaycrbnMsICcubWZwLWltZycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYobWZwLml0ZW1zLmxlbmd0aCA+IDEpIHtcblx0XHRcdFx0XHRcdFx0bWZwLm5leHQoKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0X2RvY3VtZW50Lm9uKCdrZXlkb3duJytucywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGlmIChlLmtleUNvZGUgPT09IDM3KSB7XG5cdFx0XHRcdFx0XHRtZnAucHJldigpO1xuXHRcdFx0XHRcdH0gZWxzZSBpZiAoZS5rZXlDb2RlID09PSAzOSkge1xuXHRcdFx0XHRcdFx0bWZwLm5leHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdF9tZnBPbignVXBkYXRlU3RhdHVzJytucywgZnVuY3Rpb24oZSwgZGF0YSkge1xuXHRcdFx0XHRpZihkYXRhLnRleHQpIHtcblx0XHRcdFx0XHRkYXRhLnRleHQgPSBfcmVwbGFjZUN1cnJUb3RhbChkYXRhLnRleHQsIG1mcC5jdXJySXRlbS5pbmRleCwgbWZwLml0ZW1zLmxlbmd0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRfbWZwT24oTUFSS1VQX1BBUlNFX0VWRU5UK25zLCBmdW5jdGlvbihlLCBlbGVtZW50LCB2YWx1ZXMsIGl0ZW0pIHtcblx0XHRcdFx0dmFyIGwgPSBtZnAuaXRlbXMubGVuZ3RoO1xuXHRcdFx0XHR2YWx1ZXMuY291bnRlciA9IGwgPiAxID8gX3JlcGxhY2VDdXJyVG90YWwoZ1N0LnRDb3VudGVyLCBpdGVtLmluZGV4LCBsKSA6ICcnO1xuXHRcdFx0fSk7XG5cblx0XHRcdF9tZnBPbignQnVpbGRDb250cm9scycgKyBucywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmKG1mcC5pdGVtcy5sZW5ndGggPiAxICYmIGdTdC5hcnJvd3MgJiYgIW1mcC5hcnJvd0xlZnQpIHtcblx0XHRcdFx0XHR2YXIgbWFya3VwID0gZ1N0LmFycm93TWFya3VwLFxuXHRcdFx0XHRcdFx0YXJyb3dMZWZ0ID0gbWZwLmFycm93TGVmdCA9ICQoIG1hcmt1cC5yZXBsYWNlKC8ldGl0bGUlL2dpLCBnU3QudFByZXYpLnJlcGxhY2UoLyVkaXIlL2dpLCAnbGVmdCcpICkuYWRkQ2xhc3MoUFJFVkVOVF9DTE9TRV9DTEFTUyksXG5cdFx0XHRcdFx0XHRhcnJvd1JpZ2h0ID0gbWZwLmFycm93UmlnaHQgPSAkKCBtYXJrdXAucmVwbGFjZSgvJXRpdGxlJS9naSwgZ1N0LnROZXh0KS5yZXBsYWNlKC8lZGlyJS9naSwgJ3JpZ2h0JykgKS5hZGRDbGFzcyhQUkVWRU5UX0NMT1NFX0NMQVNTKTtcblxuXHRcdFx0XHRcdGFycm93TGVmdC5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG1mcC5wcmV2KCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0YXJyb3dSaWdodC5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdG1mcC5uZXh0KCk7XG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHRtZnAuY29udGFpbmVyLmFwcGVuZChhcnJvd0xlZnQuYWRkKGFycm93UmlnaHQpKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdF9tZnBPbihDSEFOR0VfRVZFTlQrbnMsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZihtZnAuX3ByZWxvYWRUaW1lb3V0KSBjbGVhclRpbWVvdXQobWZwLl9wcmVsb2FkVGltZW91dCk7XG5cblx0XHRcdFx0bWZwLl9wcmVsb2FkVGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0bWZwLnByZWxvYWROZWFyYnlJbWFnZXMoKTtcblx0XHRcdFx0XHRtZnAuX3ByZWxvYWRUaW1lb3V0ID0gbnVsbDtcblx0XHRcdFx0fSwgMTYpO1xuXHRcdFx0fSk7XG5cblxuXHRcdFx0X21mcE9uKENMT1NFX0VWRU5UK25zLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0X2RvY3VtZW50Lm9mZihucyk7XG5cdFx0XHRcdG1mcC53cmFwLm9mZignY2xpY2snK25zKTtcblx0XHRcdFx0bWZwLmFycm93UmlnaHQgPSBtZnAuYXJyb3dMZWZ0ID0gbnVsbDtcblx0XHRcdH0pO1xuXG5cdFx0fSxcblx0XHRuZXh0OiBmdW5jdGlvbigpIHtcblx0XHRcdG1mcC5kaXJlY3Rpb24gPSB0cnVlO1xuXHRcdFx0bWZwLmluZGV4ID0gX2dldExvb3BlZElkKG1mcC5pbmRleCArIDEpO1xuXHRcdFx0bWZwLnVwZGF0ZUl0ZW1IVE1MKCk7XG5cdFx0fSxcblx0XHRwcmV2OiBmdW5jdGlvbigpIHtcblx0XHRcdG1mcC5kaXJlY3Rpb24gPSBmYWxzZTtcblx0XHRcdG1mcC5pbmRleCA9IF9nZXRMb29wZWRJZChtZnAuaW5kZXggLSAxKTtcblx0XHRcdG1mcC51cGRhdGVJdGVtSFRNTCgpO1xuXHRcdH0sXG5cdFx0Z29UbzogZnVuY3Rpb24obmV3SW5kZXgpIHtcblx0XHRcdG1mcC5kaXJlY3Rpb24gPSAobmV3SW5kZXggPj0gbWZwLmluZGV4KTtcblx0XHRcdG1mcC5pbmRleCA9IG5ld0luZGV4O1xuXHRcdFx0bWZwLnVwZGF0ZUl0ZW1IVE1MKCk7XG5cdFx0fSxcblx0XHRwcmVsb2FkTmVhcmJ5SW1hZ2VzOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBwID0gbWZwLnN0LmdhbGxlcnkucHJlbG9hZCxcblx0XHRcdFx0cHJlbG9hZEJlZm9yZSA9IE1hdGgubWluKHBbMF0sIG1mcC5pdGVtcy5sZW5ndGgpLFxuXHRcdFx0XHRwcmVsb2FkQWZ0ZXIgPSBNYXRoLm1pbihwWzFdLCBtZnAuaXRlbXMubGVuZ3RoKSxcblx0XHRcdFx0aTtcblxuXHRcdFx0Zm9yKGkgPSAxOyBpIDw9IChtZnAuZGlyZWN0aW9uID8gcHJlbG9hZEFmdGVyIDogcHJlbG9hZEJlZm9yZSk7IGkrKykge1xuXHRcdFx0XHRtZnAuX3ByZWxvYWRJdGVtKG1mcC5pbmRleCtpKTtcblx0XHRcdH1cblx0XHRcdGZvcihpID0gMTsgaSA8PSAobWZwLmRpcmVjdGlvbiA/IHByZWxvYWRCZWZvcmUgOiBwcmVsb2FkQWZ0ZXIpOyBpKyspIHtcblx0XHRcdFx0bWZwLl9wcmVsb2FkSXRlbShtZnAuaW5kZXgtaSk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRfcHJlbG9hZEl0ZW06IGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHRpbmRleCA9IF9nZXRMb29wZWRJZChpbmRleCk7XG5cblx0XHRcdGlmKG1mcC5pdGVtc1tpbmRleF0ucHJlbG9hZGVkKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0dmFyIGl0ZW0gPSBtZnAuaXRlbXNbaW5kZXhdO1xuXHRcdFx0aWYoIWl0ZW0ucGFyc2VkKSB7XG5cdFx0XHRcdGl0ZW0gPSBtZnAucGFyc2VFbCggaW5kZXggKTtcblx0XHRcdH1cblxuXHRcdFx0X21mcFRyaWdnZXIoJ0xhenlMb2FkJywgaXRlbSk7XG5cblx0XHRcdGlmKGl0ZW0udHlwZSA9PT0gJ2ltYWdlJykge1xuXHRcdFx0XHRpdGVtLmltZyA9ICQoJzxpbWcgY2xhc3M9XCJtZnAtaW1nXCIgLz4nKS5vbignbG9hZC5tZnBsb2FkZXInLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRpdGVtLmhhc1NpemUgPSB0cnVlO1xuXHRcdFx0XHR9KS5vbignZXJyb3IubWZwbG9hZGVyJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0aXRlbS5oYXNTaXplID0gdHJ1ZTtcblx0XHRcdFx0XHRpdGVtLmxvYWRFcnJvciA9IHRydWU7XG5cdFx0XHRcdFx0X21mcFRyaWdnZXIoJ0xhenlMb2FkRXJyb3InLCBpdGVtKTtcblx0XHRcdFx0fSkuYXR0cignc3JjJywgaXRlbS5zcmMpO1xuXHRcdFx0fVxuXG5cblx0XHRcdGl0ZW0ucHJlbG9hZGVkID0gdHJ1ZTtcblx0XHR9XG5cdH1cbn0pO1xuXG4vKj4+Z2FsbGVyeSovXG5cbi8qPj5yZXRpbmEqL1xuXG52YXIgUkVUSU5BX05TID0gJ3JldGluYSc7XG5cbiQubWFnbmlmaWNQb3B1cC5yZWdpc3Rlck1vZHVsZShSRVRJTkFfTlMsIHtcblx0b3B0aW9uczoge1xuXHRcdHJlcGxhY2VTcmM6IGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdHJldHVybiBpdGVtLnNyYy5yZXBsYWNlKC9cXC5cXHcrJC8sIGZ1bmN0aW9uKG0pIHsgcmV0dXJuICdAMngnICsgbTsgfSk7XG5cdFx0fSxcblx0XHRyYXRpbzogMSAvLyBGdW5jdGlvbiBvciBudW1iZXIuICBTZXQgdG8gMSB0byBkaXNhYmxlLlxuXHR9LFxuXHRwcm90bzoge1xuXHRcdGluaXRSZXRpbmE6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYod2luZG93LmRldmljZVBpeGVsUmF0aW8gPiAxKSB7XG5cblx0XHRcdFx0dmFyIHN0ID0gbWZwLnN0LnJldGluYSxcblx0XHRcdFx0XHRyYXRpbyA9IHN0LnJhdGlvO1xuXG5cdFx0XHRcdHJhdGlvID0gIWlzTmFOKHJhdGlvKSA/IHJhdGlvIDogcmF0aW8oKTtcblxuXHRcdFx0XHRpZihyYXRpbyA+IDEpIHtcblx0XHRcdFx0XHRfbWZwT24oJ0ltYWdlSGFzU2l6ZScgKyAnLicgKyBSRVRJTkFfTlMsIGZ1bmN0aW9uKGUsIGl0ZW0pIHtcblx0XHRcdFx0XHRcdGl0ZW0uaW1nLmNzcyh7XG5cdFx0XHRcdFx0XHRcdCdtYXgtd2lkdGgnOiBpdGVtLmltZ1swXS5uYXR1cmFsV2lkdGggLyByYXRpbyxcblx0XHRcdFx0XHRcdFx0J3dpZHRoJzogJzEwMCUnXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRfbWZwT24oJ0VsZW1lbnRQYXJzZScgKyAnLicgKyBSRVRJTkFfTlMsIGZ1bmN0aW9uKGUsIGl0ZW0pIHtcblx0XHRcdFx0XHRcdGl0ZW0uc3JjID0gc3QucmVwbGFjZVNyYyhpdGVtLCByYXRpbyk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblx0fVxufSk7XG5cbi8qPj5yZXRpbmEqL1xuIF9jaGVja0luc3RhbmNlKCk7IH0pKTsiLCIvKiEgbmFub1Njcm9sbGVySlMgLSB2MC44LjcgLSAyMDE1XG4qIGh0dHA6Ly9qYW1lc2Zsb3JlbnRpbm8uZ2l0aHViLmNvbS9uYW5vU2Nyb2xsZXJKUy9cbiogQ29weXJpZ2h0IChjKSAyMDE1IEphbWVzIEZsb3JlbnRpbm87IExpY2Vuc2VkIE1JVCAqL1xuKGZ1bmN0aW9uKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIHJldHVybiBkZWZpbmUoWydqcXVlcnknXSwgZnVuY3Rpb24oJCkge1xuICAgICAgcmV0dXJuIGZhY3RvcnkoJCwgd2luZG93LCBkb2N1bWVudCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdqcXVlcnknKSwgd2luZG93LCBkb2N1bWVudCk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhY3RvcnkoalF1ZXJ5LCB3aW5kb3csIGRvY3VtZW50KTtcbiAgfVxufSkoZnVuY3Rpb24oJCwgd2luZG93LCBkb2N1bWVudCkge1xuICBcInVzZSBzdHJpY3RcIjtcbiAgdmFyIEJST1dTRVJfSVNfSUU3LCBCUk9XU0VSX1NDUk9MTEJBUl9XSURUSCwgRE9NU0NST0xMLCBET1dOLCBEUkFHLCBFTlRFUiwgS0VZRE9XTiwgS0VZVVAsIE1PVVNFRE9XTiwgTU9VU0VFTlRFUiwgTU9VU0VNT1ZFLCBNT1VTRVVQLCBNT1VTRVdIRUVMLCBOYW5vU2Nyb2xsLCBQQU5FRE9XTiwgUkVTSVpFLCBTQ1JPTEwsIFNDUk9MTEJBUiwgVE9VQ0hNT1ZFLCBVUCwgV0hFRUwsIGNBRiwgZGVmYXVsdHMsIGdldEJyb3dzZXJTY3JvbGxiYXJXaWR0aCwgaGFzVHJhbnNmb3JtLCBpc0ZGV2l0aEJ1Z2d5U2Nyb2xsYmFyLCByQUYsIHRyYW5zZm9ybSwgX2VsZW1lbnRTdHlsZSwgX3ByZWZpeFN0eWxlLCBfdmVuZG9yO1xuICBkZWZhdWx0cyA9IHtcblxuICAgIC8qKlxuICAgICAgYSBjbGFzc25hbWUgZm9yIHRoZSBwYW5lIGVsZW1lbnQuXG4gICAgICBAcHJvcGVydHkgcGFuZUNsYXNzXG4gICAgICBAdHlwZSBTdHJpbmdcbiAgICAgIEBkZWZhdWx0ICduYW5vLXBhbmUnXG4gICAgICovXG4gICAgcGFuZUNsYXNzOiAnbmFuby1wYW5lJyxcblxuICAgIC8qKlxuICAgICAgYSBjbGFzc25hbWUgZm9yIHRoZSBzbGlkZXIgZWxlbWVudC5cbiAgICAgIEBwcm9wZXJ0eSBzbGlkZXJDbGFzc1xuICAgICAgQHR5cGUgU3RyaW5nXG4gICAgICBAZGVmYXVsdCAnbmFuby1zbGlkZXInXG4gICAgICovXG4gICAgc2xpZGVyQ2xhc3M6ICduYW5vLXNsaWRlcicsXG5cbiAgICAvKipcbiAgICAgIGEgY2xhc3NuYW1lIGZvciB0aGUgY29udGVudCBlbGVtZW50LlxuICAgICAgQHByb3BlcnR5IGNvbnRlbnRDbGFzc1xuICAgICAgQHR5cGUgU3RyaW5nXG4gICAgICBAZGVmYXVsdCAnbmFuby1jb250ZW50J1xuICAgICAqL1xuICAgIGNvbnRlbnRDbGFzczogJ25hbm8tY29udGVudCcsXG5cbiAgICAvKipcbiAgICAgIGEgc2V0dGluZyB0byBlbmFibGUgbmF0aXZlIHNjcm9sbGluZyBpbiBpT1MgZGV2aWNlcy5cbiAgICAgIEBwcm9wZXJ0eSBpT1NOYXRpdmVTY3JvbGxpbmdcbiAgICAgIEB0eXBlIEJvb2xlYW5cbiAgICAgIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgaU9TTmF0aXZlU2Nyb2xsaW5nOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAgYSBzZXR0aW5nIHRvIHByZXZlbnQgdGhlIHJlc3Qgb2YgdGhlIHBhZ2UgYmVpbmdcbiAgICAgIHNjcm9sbGVkIHdoZW4gdXNlciBzY3JvbGxzIHRoZSBgLmNvbnRlbnRgIGVsZW1lbnQuXG4gICAgICBAcHJvcGVydHkgcHJldmVudFBhZ2VTY3JvbGxpbmdcbiAgICAgIEB0eXBlIEJvb2xlYW5cbiAgICAgIEBkZWZhdWx0IGZhbHNlXG4gICAgICovXG4gICAgcHJldmVudFBhZ2VTY3JvbGxpbmc6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICBhIHNldHRpbmcgdG8gZGlzYWJsZSBiaW5kaW5nIHRvIHRoZSByZXNpemUgZXZlbnQuXG4gICAgICBAcHJvcGVydHkgZGlzYWJsZVJlc2l6ZVxuICAgICAgQHR5cGUgQm9vbGVhblxuICAgICAgQGRlZmF1bHQgZmFsc2VcbiAgICAgKi9cbiAgICBkaXNhYmxlUmVzaXplOiBmYWxzZSxcblxuICAgIC8qKlxuICAgICAgYSBzZXR0aW5nIHRvIG1ha2UgdGhlIHNjcm9sbGJhciBhbHdheXMgdmlzaWJsZS5cbiAgICAgIEBwcm9wZXJ0eSBhbHdheXNWaXNpYmxlXG4gICAgICBAdHlwZSBCb29sZWFuXG4gICAgICBAZGVmYXVsdCBmYWxzZVxuICAgICAqL1xuICAgIGFsd2F5c1Zpc2libGU6IGZhbHNlLFxuXG4gICAgLyoqXG4gICAgICBhIGRlZmF1bHQgdGltZW91dCBmb3IgdGhlIGBmbGFzaCgpYCBtZXRob2QuXG4gICAgICBAcHJvcGVydHkgZmxhc2hEZWxheVxuICAgICAgQHR5cGUgTnVtYmVyXG4gICAgICBAZGVmYXVsdCAxNTAwXG4gICAgICovXG4gICAgZmxhc2hEZWxheTogMTUwMCxcblxuICAgIC8qKlxuICAgICAgYSBtaW5pbXVtIGhlaWdodCBmb3IgdGhlIGAuc2xpZGVyYCBlbGVtZW50LlxuICAgICAgQHByb3BlcnR5IHNsaWRlck1pbkhlaWdodFxuICAgICAgQHR5cGUgTnVtYmVyXG4gICAgICBAZGVmYXVsdCAyMFxuICAgICAqL1xuICAgIHNsaWRlck1pbkhlaWdodDogMjAsXG5cbiAgICAvKipcbiAgICAgIGEgbWF4aW11bSBoZWlnaHQgZm9yIHRoZSBgLnNsaWRlcmAgZWxlbWVudC5cbiAgICAgIEBwcm9wZXJ0eSBzbGlkZXJNYXhIZWlnaHRcbiAgICAgIEB0eXBlIE51bWJlclxuICAgICAgQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHNsaWRlck1heEhlaWdodDogbnVsbCxcblxuICAgIC8qKlxuICAgICAgYW4gYWx0ZXJuYXRlIGRvY3VtZW50IGNvbnRleHQuXG4gICAgICBAcHJvcGVydHkgZG9jdW1lbnRDb250ZXh0XG4gICAgICBAdHlwZSBEb2N1bWVudFxuICAgICAgQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIGRvY3VtZW50Q29udGV4dDogbnVsbCxcblxuICAgIC8qKlxuICAgICAgYW4gYWx0ZXJuYXRlIHdpbmRvdyBjb250ZXh0LlxuICAgICAgQHByb3BlcnR5IHdpbmRvd0NvbnRleHRcbiAgICAgIEB0eXBlIFdpbmRvd1xuICAgICAgQGRlZmF1bHQgbnVsbFxuICAgICAqL1xuICAgIHdpbmRvd0NvbnRleHQ6IG51bGxcbiAgfTtcblxuICAvKipcbiAgICBAcHJvcGVydHkgU0NST0xMQkFSXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQHN0YXRpY1xuICAgIEBmaW5hbFxuICAgIEBwcml2YXRlXG4gICAqL1xuICBTQ1JPTExCQVIgPSAnc2Nyb2xsYmFyJztcblxuICAvKipcbiAgICBAcHJvcGVydHkgU0NST0xMXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQHN0YXRpY1xuICAgIEBmaW5hbFxuICAgIEBwcml2YXRlXG4gICAqL1xuICBTQ1JPTEwgPSAnc2Nyb2xsJztcblxuICAvKipcbiAgICBAcHJvcGVydHkgTU9VU0VET1dOXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQGZpbmFsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIE1PVVNFRE9XTiA9ICdtb3VzZWRvd24nO1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBNT1VTRUVOVEVSXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQGZpbmFsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIE1PVVNFRU5URVIgPSAnbW91c2VlbnRlcic7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IE1PVVNFTU9WRVxuICAgIEB0eXBlIFN0cmluZ1xuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgTU9VU0VNT1ZFID0gJ21vdXNlbW92ZSc7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IE1PVVNFV0hFRUxcbiAgICBAdHlwZSBTdHJpbmdcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgTU9VU0VXSEVFTCA9ICdtb3VzZXdoZWVsJztcblxuICAvKipcbiAgICBAcHJvcGVydHkgTU9VU0VVUFxuICAgIEB0eXBlIFN0cmluZ1xuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgTU9VU0VVUCA9ICdtb3VzZXVwJztcblxuICAvKipcbiAgICBAcHJvcGVydHkgUkVTSVpFXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQGZpbmFsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIFJFU0laRSA9ICdyZXNpemUnO1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBEUkFHXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQHN0YXRpY1xuICAgIEBmaW5hbFxuICAgIEBwcml2YXRlXG4gICAqL1xuICBEUkFHID0gJ2RyYWcnO1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBFTlRFUlxuICAgIEB0eXBlIFN0cmluZ1xuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgRU5URVIgPSAnZW50ZXInO1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBVUFxuICAgIEB0eXBlIFN0cmluZ1xuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgVVAgPSAndXAnO1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBQQU5FRE9XTlxuICAgIEB0eXBlIFN0cmluZ1xuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgUEFORURPV04gPSAncGFuZWRvd24nO1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBET01TQ1JPTExcbiAgICBAdHlwZSBTdHJpbmdcbiAgICBAc3RhdGljXG4gICAgQGZpbmFsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIERPTVNDUk9MTCA9ICdET01Nb3VzZVNjcm9sbCc7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IERPV05cbiAgICBAdHlwZSBTdHJpbmdcbiAgICBAc3RhdGljXG4gICAgQGZpbmFsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIERPV04gPSAnZG93bic7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IFdIRUVMXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQHN0YXRpY1xuICAgIEBmaW5hbFxuICAgIEBwcml2YXRlXG4gICAqL1xuICBXSEVFTCA9ICd3aGVlbCc7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IEtFWURPV05cbiAgICBAdHlwZSBTdHJpbmdcbiAgICBAc3RhdGljXG4gICAgQGZpbmFsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIEtFWURPV04gPSAna2V5ZG93bic7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IEtFWVVQXG4gICAgQHR5cGUgU3RyaW5nXG4gICAgQHN0YXRpY1xuICAgIEBmaW5hbFxuICAgIEBwcml2YXRlXG4gICAqL1xuICBLRVlVUCA9ICdrZXl1cCc7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IFRPVUNITU9WRVxuICAgIEB0eXBlIFN0cmluZ1xuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgVE9VQ0hNT1ZFID0gJ3RvdWNobW92ZSc7XG5cbiAgLyoqXG4gICAgQHByb3BlcnR5IEJST1dTRVJfSVNfSUU3XG4gICAgQHR5cGUgQm9vbGVhblxuICAgIEBzdGF0aWNcbiAgICBAZmluYWxcbiAgICBAcHJpdmF0ZVxuICAgKi9cbiAgQlJPV1NFUl9JU19JRTcgPSB3aW5kb3cubmF2aWdhdG9yLmFwcE5hbWUgPT09ICdNaWNyb3NvZnQgSW50ZXJuZXQgRXhwbG9yZXInICYmIC9tc2llIDcuL2kudGVzdCh3aW5kb3cubmF2aWdhdG9yLmFwcFZlcnNpb24pICYmIHdpbmRvdy5BY3RpdmVYT2JqZWN0O1xuXG4gIC8qKlxuICAgIEBwcm9wZXJ0eSBCUk9XU0VSX1NDUk9MTEJBUl9XSURUSFxuICAgIEB0eXBlIE51bWJlclxuICAgIEBzdGF0aWNcbiAgICBAZGVmYXVsdCBudWxsXG4gICAgQHByaXZhdGVcbiAgICovXG4gIEJST1dTRVJfU0NST0xMQkFSX1dJRFRIID0gbnVsbDtcbiAgckFGID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgY0FGID0gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuICBfZWxlbWVudFN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jykuc3R5bGU7XG4gIF92ZW5kb3IgPSAoZnVuY3Rpb24oKSB7XG4gICAgdmFyIGksIHRyYW5zZm9ybSwgdmVuZG9yLCB2ZW5kb3JzLCBfaSwgX2xlbjtcbiAgICB2ZW5kb3JzID0gWyd0JywgJ3dlYmtpdFQnLCAnTW96VCcsICdtc1QnLCAnT1QnXTtcbiAgICBmb3IgKGkgPSBfaSA9IDAsIF9sZW4gPSB2ZW5kb3JzLmxlbmd0aDsgX2kgPCBfbGVuOyBpID0gKytfaSkge1xuICAgICAgdmVuZG9yID0gdmVuZG9yc1tpXTtcbiAgICAgIHRyYW5zZm9ybSA9IHZlbmRvcnNbaV0gKyAncmFuc2Zvcm0nO1xuICAgICAgaWYgKHRyYW5zZm9ybSBpbiBfZWxlbWVudFN0eWxlKSB7XG4gICAgICAgIHJldHVybiB2ZW5kb3JzW2ldLnN1YnN0cigwLCB2ZW5kb3JzW2ldLmxlbmd0aCAtIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pKCk7XG4gIF9wcmVmaXhTdHlsZSA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgaWYgKF92ZW5kb3IgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChfdmVuZG9yID09PSAnJykge1xuICAgICAgcmV0dXJuIHN0eWxlO1xuICAgIH1cbiAgICByZXR1cm4gX3ZlbmRvciArIHN0eWxlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3R5bGUuc3Vic3RyKDEpO1xuICB9O1xuICB0cmFuc2Zvcm0gPSBfcHJlZml4U3R5bGUoJ3RyYW5zZm9ybScpO1xuICBoYXNUcmFuc2Zvcm0gPSB0cmFuc2Zvcm0gIT09IGZhbHNlO1xuXG4gIC8qKlxuICAgIFJldHVybnMgYnJvd3NlcidzIG5hdGl2ZSBzY3JvbGxiYXIgd2lkdGhcbiAgICBAbWV0aG9kIGdldEJyb3dzZXJTY3JvbGxiYXJXaWR0aFxuICAgIEByZXR1cm4ge051bWJlcn0gdGhlIHNjcm9sbGJhciB3aWR0aCBpbiBwaXhlbHNcbiAgICBAc3RhdGljXG4gICAgQHByaXZhdGVcbiAgICovXG4gIGdldEJyb3dzZXJTY3JvbGxiYXJXaWR0aCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvdXRlciwgb3V0ZXJTdHlsZSwgc2Nyb2xsYmFyV2lkdGg7XG4gICAgb3V0ZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBvdXRlclN0eWxlID0gb3V0ZXIuc3R5bGU7XG4gICAgb3V0ZXJTdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgb3V0ZXJTdHlsZS53aWR0aCA9ICcxMDBweCc7XG4gICAgb3V0ZXJTdHlsZS5oZWlnaHQgPSAnMTAwcHgnO1xuICAgIG91dGVyU3R5bGUub3ZlcmZsb3cgPSBTQ1JPTEw7XG4gICAgb3V0ZXJTdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChvdXRlcik7XG4gICAgc2Nyb2xsYmFyV2lkdGggPSBvdXRlci5vZmZzZXRXaWR0aCAtIG91dGVyLmNsaWVudFdpZHRoO1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQob3V0ZXIpO1xuICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgfTtcbiAgaXNGRldpdGhCdWdneVNjcm9sbGJhciA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpc09TWEZGLCB1YSwgdmVyc2lvbjtcbiAgICB1YSA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGlzT1NYRkYgPSAvKD89LitNYWMgT1MgWCkoPz0uK0ZpcmVmb3gpLy50ZXN0KHVhKTtcbiAgICBpZiAoIWlzT1NYRkYpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdmVyc2lvbiA9IC9GaXJlZm94XFwvXFxkezJ9XFwuLy5leGVjKHVhKTtcbiAgICBpZiAodmVyc2lvbikge1xuICAgICAgdmVyc2lvbiA9IHZlcnNpb25bMF0ucmVwbGFjZSgvXFxEKy9nLCAnJyk7XG4gICAgfVxuICAgIHJldHVybiBpc09TWEZGICYmICt2ZXJzaW9uID4gMjM7XG4gIH07XG5cbiAgLyoqXG4gICAgQGNsYXNzIE5hbm9TY3JvbGxcbiAgICBAcGFyYW0gZWxlbWVudCB7SFRNTEVsZW1lbnR8Tm9kZX0gdGhlIG1haW4gZWxlbWVudFxuICAgIEBwYXJhbSBvcHRpb25zIHtPYmplY3R9IG5hbm9TY3JvbGxlcidzIG9wdGlvbnNcbiAgICBAY29uc3RydWN0b3JcbiAgICovXG4gIE5hbm9TY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG4gICAgZnVuY3Rpb24gTmFub1Njcm9sbChlbCwgb3B0aW9ucykge1xuICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIEJST1dTRVJfU0NST0xMQkFSX1dJRFRIIHx8IChCUk9XU0VSX1NDUk9MTEJBUl9XSURUSCA9IGdldEJyb3dzZXJTY3JvbGxiYXJXaWR0aCgpKTtcbiAgICAgIHRoaXMuJGVsID0gJCh0aGlzLmVsKTtcbiAgICAgIHRoaXMuZG9jID0gJCh0aGlzLm9wdGlvbnMuZG9jdW1lbnRDb250ZXh0IHx8IGRvY3VtZW50KTtcbiAgICAgIHRoaXMud2luID0gJCh0aGlzLm9wdGlvbnMud2luZG93Q29udGV4dCB8fCB3aW5kb3cpO1xuICAgICAgdGhpcy5ib2R5ID0gdGhpcy5kb2MuZmluZCgnYm9keScpO1xuICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmNoaWxkcmVuKFwiLlwiICsgdGhpcy5vcHRpb25zLmNvbnRlbnRDbGFzcyk7XG4gICAgICB0aGlzLiRjb250ZW50LmF0dHIoJ3RhYmluZGV4JywgdGhpcy5vcHRpb25zLnRhYkluZGV4IHx8IDApO1xuICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kY29udGVudFswXTtcbiAgICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IDA7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmlPU05hdGl2ZVNjcm9sbGluZyAmJiAodGhpcy5lbC5zdHlsZS5XZWJraXRPdmVyZmxvd1Njcm9sbGluZyAhPSBudWxsKSkge1xuICAgICAgICB0aGlzLm5hdGl2ZVNjcm9sbGluZygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5jcmVhdGVFdmVudHMoKTtcbiAgICAgIHRoaXMuYWRkRXZlbnRzKCk7XG4gICAgICB0aGlzLnJlc2V0KCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgIFByZXZlbnRzIHRoZSByZXN0IG9mIHRoZSBwYWdlIGJlaW5nIHNjcm9sbGVkXG4gICAgICB3aGVuIHVzZXIgc2Nyb2xscyB0aGUgYC5uYW5vLWNvbnRlbnRgIGVsZW1lbnQuXG4gICAgICBAbWV0aG9kIHByZXZlbnRTY3JvbGxpbmdcbiAgICAgIEBwYXJhbSBldmVudCB7RXZlbnR9XG4gICAgICBAcGFyYW0gZGlyZWN0aW9uIHtTdHJpbmd9IFNjcm9sbCBkaXJlY3Rpb24gKHVwIG9yIGRvd24pXG4gICAgICBAcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUucHJldmVudFNjcm9sbGluZyA9IGZ1bmN0aW9uKGUsIGRpcmVjdGlvbikge1xuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChlLnR5cGUgPT09IERPTVNDUk9MTCkge1xuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBET1dOICYmIGUub3JpZ2luYWxFdmVudC5kZXRhaWwgPiAwIHx8IGRpcmVjdGlvbiA9PT0gVVAgJiYgZS5vcmlnaW5hbEV2ZW50LmRldGFpbCA8IDApIHtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZS50eXBlID09PSBNT1VTRVdIRUVMKSB7XG4gICAgICAgIGlmICghZS5vcmlnaW5hbEV2ZW50IHx8ICFlLm9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGlyZWN0aW9uID09PSBET1dOICYmIGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhIDwgMCB8fCBkaXJlY3Rpb24gPT09IFVQICYmIGUub3JpZ2luYWxFdmVudC53aGVlbERlbHRhID4gMCkge1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgRW5hYmxlIGlPUyBuYXRpdmUgc2Nyb2xsaW5nXG4gICAgICBAbWV0aG9kIG5hdGl2ZVNjcm9sbGluZ1xuICAgICAgQHByaXZhdGVcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLm5hdGl2ZVNjcm9sbGluZyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy4kY29udGVudC5jc3Moe1xuICAgICAgICBXZWJraXRPdmVyZmxvd1Njcm9sbGluZzogJ3RvdWNoJ1xuICAgICAgfSk7XG4gICAgICB0aGlzLmlPU05hdGl2ZVNjcm9sbGluZyA9IHRydWU7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgIFVwZGF0ZXMgdGhvc2UgbmFub1Njcm9sbGVyIHByb3BlcnRpZXMgdGhhdFxuICAgICAgYXJlIHJlbGF0ZWQgdG8gY3VycmVudCBzY3JvbGxiYXIgcG9zaXRpb24uXG4gICAgICBAbWV0aG9kIHVwZGF0ZVNjcm9sbFZhbHVlc1xuICAgICAgQHByaXZhdGVcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLnVwZGF0ZVNjcm9sbFZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNvbnRlbnQsIGRpcmVjdGlvbjtcbiAgICAgIGNvbnRlbnQgPSB0aGlzLmNvbnRlbnQ7XG4gICAgICB0aGlzLm1heFNjcm9sbFRvcCA9IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0IC0gY29udGVudC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLnByZXZTY3JvbGxUb3AgPSB0aGlzLmNvbnRlbnRTY3JvbGxUb3AgfHwgMDtcbiAgICAgIHRoaXMuY29udGVudFNjcm9sbFRvcCA9IGNvbnRlbnQuc2Nyb2xsVG9wO1xuICAgICAgZGlyZWN0aW9uID0gdGhpcy5jb250ZW50U2Nyb2xsVG9wID4gdGhpcy5wcmV2aW91c1Bvc2l0aW9uID8gXCJkb3duXCIgOiB0aGlzLmNvbnRlbnRTY3JvbGxUb3AgPCB0aGlzLnByZXZpb3VzUG9zaXRpb24gPyBcInVwXCIgOiBcInNhbWVcIjtcbiAgICAgIHRoaXMucHJldmlvdXNQb3NpdGlvbiA9IHRoaXMuY29udGVudFNjcm9sbFRvcDtcbiAgICAgIGlmIChkaXJlY3Rpb24gIT09IFwic2FtZVwiKSB7XG4gICAgICAgIHRoaXMuJGVsLnRyaWdnZXIoJ3VwZGF0ZScsIHtcbiAgICAgICAgICBwb3NpdGlvbjogdGhpcy5jb250ZW50U2Nyb2xsVG9wLFxuICAgICAgICAgIG1heGltdW06IHRoaXMubWF4U2Nyb2xsVG9wLFxuICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlPU05hdGl2ZVNjcm9sbGluZykge1xuICAgICAgICB0aGlzLm1heFNsaWRlclRvcCA9IHRoaXMucGFuZUhlaWdodCAtIHRoaXMuc2xpZGVySGVpZ2h0O1xuICAgICAgICB0aGlzLnNsaWRlclRvcCA9IHRoaXMubWF4U2Nyb2xsVG9wID09PSAwID8gMCA6IHRoaXMuY29udGVudFNjcm9sbFRvcCAqIHRoaXMubWF4U2xpZGVyVG9wIC8gdGhpcy5tYXhTY3JvbGxUb3A7XG4gICAgICB9XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICBVcGRhdGVzIENTUyBzdHlsZXMgZm9yIGN1cnJlbnQgc2Nyb2xsIHBvc2l0aW9uLlxuICAgICAgVXNlcyBDU1MgMmQgdHJhbnNmcm9tcyBhbmQgYHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGlmIGF2YWlsYWJsZS5cbiAgICAgIEBtZXRob2Qgc2V0T25TY3JvbGxTdHlsZXNcbiAgICAgIEBwcml2YXRlXG4gICAgICovXG5cbiAgICBOYW5vU2Nyb2xsLnByb3RvdHlwZS5zZXRPblNjcm9sbFN0eWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGNzc1ZhbHVlO1xuICAgICAgaWYgKGhhc1RyYW5zZm9ybSkge1xuICAgICAgICBjc3NWYWx1ZSA9IHt9O1xuICAgICAgICBjc3NWYWx1ZVt0cmFuc2Zvcm1dID0gXCJ0cmFuc2xhdGUoMCwgXCIgKyB0aGlzLnNsaWRlclRvcCArIFwicHgpXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjc3NWYWx1ZSA9IHtcbiAgICAgICAgICB0b3A6IHRoaXMuc2xpZGVyVG9wXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICBpZiAockFGKSB7XG4gICAgICAgIGlmIChjQUYgJiYgdGhpcy5zY3JvbGxSQUYpIHtcbiAgICAgICAgICBjQUYodGhpcy5zY3JvbGxSQUYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2Nyb2xsUkFGID0gckFGKChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIF90aGlzLnNjcm9sbFJBRiA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXMuc2xpZGVyLmNzcyhjc3NWYWx1ZSk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zbGlkZXIuY3NzKGNzc1ZhbHVlKTtcbiAgICAgIH1cbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgIENyZWF0ZXMgZXZlbnQgcmVsYXRlZCBtZXRob2RzXG4gICAgICBAbWV0aG9kIGNyZWF0ZUV2ZW50c1xuICAgICAgQHByaXZhdGVcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLmNyZWF0ZUV2ZW50cyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5ldmVudHMgPSB7XG4gICAgICAgIGRvd246IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBfdGhpcy5pc0JlaW5nRHJhZ2dlZCA9IHRydWU7XG4gICAgICAgICAgICBfdGhpcy5vZmZzZXRZID0gZS5wYWdlWSAtIF90aGlzLnNsaWRlci5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICBpZiAoIV90aGlzLnNsaWRlci5pcyhlLnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgX3RoaXMub2Zmc2V0WSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5wYW5lLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIF90aGlzLmRvYy5iaW5kKE1PVVNFTU9WRSwgX3RoaXMuZXZlbnRzW0RSQUddKS5iaW5kKE1PVVNFVVAsIF90aGlzLmV2ZW50c1tVUF0pO1xuICAgICAgICAgICAgX3RoaXMuYm9keS5iaW5kKE1PVVNFRU5URVIsIF90aGlzLmV2ZW50c1tFTlRFUl0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICBkcmFnOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgX3RoaXMuc2xpZGVyWSA9IGUucGFnZVkgLSBfdGhpcy4kZWwub2Zmc2V0KCkudG9wIC0gX3RoaXMucGFuZVRvcCAtIChfdGhpcy5vZmZzZXRZIHx8IF90aGlzLnNsaWRlckhlaWdodCAqIDAuNSk7XG4gICAgICAgICAgICBfdGhpcy5zY3JvbGwoKTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5jb250ZW50U2Nyb2xsVG9wID49IF90aGlzLm1heFNjcm9sbFRvcCAmJiBfdGhpcy5wcmV2U2Nyb2xsVG9wICE9PSBfdGhpcy5tYXhTY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgX3RoaXMuJGVsLnRyaWdnZXIoJ3Njcm9sbGVuZCcpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfdGhpcy5jb250ZW50U2Nyb2xsVG9wID09PSAwICYmIF90aGlzLnByZXZTY3JvbGxUb3AgIT09IDApIHtcbiAgICAgICAgICAgICAgX3RoaXMuJGVsLnRyaWdnZXIoJ3Njcm9sbHRvcCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICB1cDogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIF90aGlzLmlzQmVpbmdEcmFnZ2VkID0gZmFsc2U7XG4gICAgICAgICAgICBfdGhpcy5wYW5lLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIF90aGlzLmRvYy51bmJpbmQoTU9VU0VNT1ZFLCBfdGhpcy5ldmVudHNbRFJBR10pLnVuYmluZChNT1VTRVVQLCBfdGhpcy5ldmVudHNbVVBdKTtcbiAgICAgICAgICAgIF90aGlzLmJvZHkudW5iaW5kKE1PVVNFRU5URVIsIF90aGlzLmV2ZW50c1tFTlRFUl0pO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICByZXNpemU6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBfdGhpcy5yZXNldCgpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICBwYW5lZG93bjogKGZ1bmN0aW9uKF90aGlzKSB7XG4gICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIF90aGlzLnNsaWRlclkgPSAoZS5vZmZzZXRZIHx8IGUub3JpZ2luYWxFdmVudC5sYXllclkpIC0gKF90aGlzLnNsaWRlckhlaWdodCAqIDAuNSk7XG4gICAgICAgICAgICBfdGhpcy5zY3JvbGwoKTtcbiAgICAgICAgICAgIF90aGlzLmV2ZW50cy5kb3duKGUpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pKHRoaXMpLFxuICAgICAgICBzY3JvbGw6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICBfdGhpcy51cGRhdGVTY3JvbGxWYWx1ZXMoKTtcbiAgICAgICAgICAgIGlmIChfdGhpcy5pc0JlaW5nRHJhZ2dlZCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIV90aGlzLmlPU05hdGl2ZVNjcm9sbGluZykge1xuICAgICAgICAgICAgICBfdGhpcy5zbGlkZXJZID0gX3RoaXMuc2xpZGVyVG9wO1xuICAgICAgICAgICAgICBfdGhpcy5zZXRPblNjcm9sbFN0eWxlcygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoX3RoaXMuY29udGVudFNjcm9sbFRvcCA+PSBfdGhpcy5tYXhTY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbnMucHJldmVudFBhZ2VTY3JvbGxpbmcpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5wcmV2ZW50U2Nyb2xsaW5nKGUsIERPV04pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfdGhpcy5wcmV2U2Nyb2xsVG9wICE9PSBfdGhpcy5tYXhTY3JvbGxUb3ApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy4kZWwudHJpZ2dlcignc2Nyb2xsZW5kJyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXMuY29udGVudFNjcm9sbFRvcCA9PT0gMCkge1xuICAgICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9ucy5wcmV2ZW50UGFnZVNjcm9sbGluZykge1xuICAgICAgICAgICAgICAgIF90aGlzLnByZXZlbnRTY3JvbGxpbmcoZSwgVVApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlmIChfdGhpcy5wcmV2U2Nyb2xsVG9wICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuJGVsLnRyaWdnZXIoJ3Njcm9sbHRvcCcpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfSkodGhpcyksXG4gICAgICAgIHdoZWVsOiAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgdmFyIGRlbHRhO1xuICAgICAgICAgICAgaWYgKGUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWx0YSA9IGUuZGVsdGEgfHwgZS53aGVlbERlbHRhIHx8IChlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LndoZWVsRGVsdGEpIHx8IC1lLmRldGFpbCB8fCAoZS5vcmlnaW5hbEV2ZW50ICYmIC1lLm9yaWdpbmFsRXZlbnQuZGV0YWlsKTtcbiAgICAgICAgICAgIGlmIChkZWx0YSkge1xuICAgICAgICAgICAgICBfdGhpcy5zbGlkZXJZICs9IC1kZWx0YSAvIDM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBfdGhpcy5zY3JvbGwoKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKSxcbiAgICAgICAgZW50ZXI6IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgX3JlZjtcbiAgICAgICAgICAgIGlmICghX3RoaXMuaXNCZWluZ0RyYWdnZWQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKChlLmJ1dHRvbnMgfHwgZS53aGljaCkgIT09IDEpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIChfcmVmID0gX3RoaXMuZXZlbnRzKVtVUF0uYXBwbHkoX3JlZiwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9O1xuICAgICAgICB9KSh0aGlzKVxuICAgICAgfTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgIEFkZHMgZXZlbnQgbGlzdGVuZXJzIHdpdGggalF1ZXJ5LlxuICAgICAgQG1ldGhvZCBhZGRFdmVudHNcbiAgICAgIEBwcml2YXRlXG4gICAgICovXG5cbiAgICBOYW5vU2Nyb2xsLnByb3RvdHlwZS5hZGRFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBldmVudHM7XG4gICAgICB0aGlzLnJlbW92ZUV2ZW50cygpO1xuICAgICAgZXZlbnRzID0gdGhpcy5ldmVudHM7XG4gICAgICBpZiAoIXRoaXMub3B0aW9ucy5kaXNhYmxlUmVzaXplKSB7XG4gICAgICAgIHRoaXMud2luLmJpbmQoUkVTSVpFLCBldmVudHNbUkVTSVpFXSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaU9TTmF0aXZlU2Nyb2xsaW5nKSB7XG4gICAgICAgIHRoaXMuc2xpZGVyLmJpbmQoTU9VU0VET1dOLCBldmVudHNbRE9XTl0pO1xuICAgICAgICB0aGlzLnBhbmUuYmluZChNT1VTRURPV04sIGV2ZW50c1tQQU5FRE9XTl0pLmJpbmQoXCJcIiArIE1PVVNFV0hFRUwgKyBcIiBcIiArIERPTVNDUk9MTCwgZXZlbnRzW1dIRUVMXSk7XG4gICAgICB9XG4gICAgICB0aGlzLiRjb250ZW50LmJpbmQoXCJcIiArIFNDUk9MTCArIFwiIFwiICsgTU9VU0VXSEVFTCArIFwiIFwiICsgRE9NU0NST0xMICsgXCIgXCIgKyBUT1VDSE1PVkUsIGV2ZW50c1tTQ1JPTExdKTtcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgIFJlbW92ZXMgZXZlbnQgbGlzdGVuZXJzIHdpdGggalF1ZXJ5LlxuICAgICAgQG1ldGhvZCByZW1vdmVFdmVudHNcbiAgICAgIEBwcml2YXRlXG4gICAgICovXG5cbiAgICBOYW5vU2Nyb2xsLnByb3RvdHlwZS5yZW1vdmVFdmVudHMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBldmVudHM7XG4gICAgICBldmVudHMgPSB0aGlzLmV2ZW50cztcbiAgICAgIHRoaXMud2luLnVuYmluZChSRVNJWkUsIGV2ZW50c1tSRVNJWkVdKTtcbiAgICAgIGlmICghdGhpcy5pT1NOYXRpdmVTY3JvbGxpbmcpIHtcbiAgICAgICAgdGhpcy5zbGlkZXIudW5iaW5kKCk7XG4gICAgICAgIHRoaXMucGFuZS51bmJpbmQoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuJGNvbnRlbnQudW5iaW5kKFwiXCIgKyBTQ1JPTEwgKyBcIiBcIiArIE1PVVNFV0hFRUwgKyBcIiBcIiArIERPTVNDUk9MTCArIFwiIFwiICsgVE9VQ0hNT1ZFLCBldmVudHNbU0NST0xMXSk7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICBHZW5lcmF0ZXMgbmFub1Njcm9sbGVyJ3Mgc2Nyb2xsYmFyIGFuZCBlbGVtZW50cyBmb3IgaXQuXG4gICAgICBAbWV0aG9kIGdlbmVyYXRlXG4gICAgICBAY2hhaW5hYmxlXG4gICAgICBAcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUuZ2VuZXJhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb250ZW50Q2xhc3MsIGNzc1J1bGUsIGN1cnJlbnRQYWRkaW5nLCBvcHRpb25zLCBwYW5lLCBwYW5lQ2xhc3MsIHNsaWRlckNsYXNzO1xuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAgIHBhbmVDbGFzcyA9IG9wdGlvbnMucGFuZUNsYXNzLCBzbGlkZXJDbGFzcyA9IG9wdGlvbnMuc2xpZGVyQ2xhc3MsIGNvbnRlbnRDbGFzcyA9IG9wdGlvbnMuY29udGVudENsYXNzO1xuICAgICAgaWYgKCEocGFuZSA9IHRoaXMuJGVsLmNoaWxkcmVuKFwiLlwiICsgcGFuZUNsYXNzKSkubGVuZ3RoICYmICFwYW5lLmNoaWxkcmVuKFwiLlwiICsgc2xpZGVyQ2xhc3MpLmxlbmd0aCkge1xuICAgICAgICB0aGlzLiRlbC5hcHBlbmQoXCI8ZGl2IGNsYXNzPVxcXCJcIiArIHBhbmVDbGFzcyArIFwiXFxcIj48ZGl2IGNsYXNzPVxcXCJcIiArIHNsaWRlckNsYXNzICsgXCJcXFwiIC8+PC9kaXY+XCIpO1xuICAgICAgfVxuICAgICAgdGhpcy5wYW5lID0gdGhpcy4kZWwuY2hpbGRyZW4oXCIuXCIgKyBwYW5lQ2xhc3MpO1xuICAgICAgdGhpcy5zbGlkZXIgPSB0aGlzLnBhbmUuZmluZChcIi5cIiArIHNsaWRlckNsYXNzKTtcbiAgICAgIGlmIChCUk9XU0VSX1NDUk9MTEJBUl9XSURUSCA9PT0gMCAmJiBpc0ZGV2l0aEJ1Z2d5U2Nyb2xsYmFyKCkpIHtcbiAgICAgICAgY3VycmVudFBhZGRpbmcgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmNvbnRlbnQsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKS5yZXBsYWNlKC9bXjAtOS5dKy9nLCAnJyk7XG4gICAgICAgIGNzc1J1bGUgPSB7XG4gICAgICAgICAgcmlnaHQ6IC0xNCxcbiAgICAgICAgICBwYWRkaW5nUmlnaHQ6ICtjdXJyZW50UGFkZGluZyArIDE0XG4gICAgICAgIH07XG4gICAgICB9IGVsc2UgaWYgKEJST1dTRVJfU0NST0xMQkFSX1dJRFRIKSB7XG4gICAgICAgIGNzc1J1bGUgPSB7XG4gICAgICAgICAgcmlnaHQ6IC1CUk9XU0VSX1NDUk9MTEJBUl9XSURUSFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnaGFzLXNjcm9sbGJhcicpO1xuICAgICAgfVxuICAgICAgaWYgKGNzc1J1bGUgIT0gbnVsbCkge1xuICAgICAgICB0aGlzLiRjb250ZW50LmNzcyhjc3NSdWxlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgQG1ldGhvZCByZXN0b3JlXG4gICAgICBAcHJpdmF0ZVxuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgICBpZiAoIXRoaXMuaU9TTmF0aXZlU2Nyb2xsaW5nKSB7XG4gICAgICAgIHRoaXMucGFuZS5zaG93KCk7XG4gICAgICB9XG4gICAgICB0aGlzLmFkZEV2ZW50cygpO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgUmVzZXRzIG5hbm9TY3JvbGxlcidzIHNjcm9sbGJhci5cbiAgICAgIEBtZXRob2QgcmVzZXRcbiAgICAgIEBjaGFpbmFibGVcbiAgICAgIEBleGFtcGxlXG4gICAgICAgICAgJChcIi5uYW5vXCIpLm5hbm9TY3JvbGxlcigpO1xuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjb250ZW50LCBjb250ZW50SGVpZ2h0LCBjb250ZW50UG9zaXRpb24sIGNvbnRlbnRTdHlsZSwgY29udGVudFN0eWxlT3ZlcmZsb3dZLCBwYW5lQm90dG9tLCBwYW5lSGVpZ2h0LCBwYW5lT3V0ZXJIZWlnaHQsIHBhbmVUb3AsIHBhcmVudE1heEhlaWdodCwgcmlnaHQsIHNsaWRlckhlaWdodDtcbiAgICAgIGlmICh0aGlzLmlPU05hdGl2ZVNjcm9sbGluZykge1xuICAgICAgICB0aGlzLmNvbnRlbnRIZWlnaHQgPSB0aGlzLmNvbnRlbnQuc2Nyb2xsSGVpZ2h0O1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuJGVsLmZpbmQoXCIuXCIgKyB0aGlzLm9wdGlvbnMucGFuZUNsYXNzKS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5nZW5lcmF0ZSgpLnN0b3AoKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnN0b3BwZWQpIHtcbiAgICAgICAgdGhpcy5yZXN0b3JlKCk7XG4gICAgICB9XG4gICAgICBjb250ZW50ID0gdGhpcy5jb250ZW50O1xuICAgICAgY29udGVudFN0eWxlID0gY29udGVudC5zdHlsZTtcbiAgICAgIGNvbnRlbnRTdHlsZU92ZXJmbG93WSA9IGNvbnRlbnRTdHlsZS5vdmVyZmxvd1k7XG4gICAgICBpZiAoQlJPV1NFUl9JU19JRTcpIHtcbiAgICAgICAgdGhpcy4kY29udGVudC5jc3Moe1xuICAgICAgICAgIGhlaWdodDogdGhpcy4kY29udGVudC5oZWlnaHQoKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnRIZWlnaHQgPSBjb250ZW50LnNjcm9sbEhlaWdodCArIEJST1dTRVJfU0NST0xMQkFSX1dJRFRIO1xuICAgICAgcGFyZW50TWF4SGVpZ2h0ID0gcGFyc2VJbnQodGhpcy4kZWwuY3NzKFwibWF4LWhlaWdodFwiKSwgMTApO1xuICAgICAgaWYgKHBhcmVudE1heEhlaWdodCA+IDApIHtcbiAgICAgICAgdGhpcy4kZWwuaGVpZ2h0KFwiXCIpO1xuICAgICAgICB0aGlzLiRlbC5oZWlnaHQoY29udGVudC5zY3JvbGxIZWlnaHQgPiBwYXJlbnRNYXhIZWlnaHQgPyBwYXJlbnRNYXhIZWlnaHQgOiBjb250ZW50LnNjcm9sbEhlaWdodCk7XG4gICAgICB9XG4gICAgICBwYW5lSGVpZ2h0ID0gdGhpcy5wYW5lLm91dGVySGVpZ2h0KGZhbHNlKTtcbiAgICAgIHBhbmVUb3AgPSBwYXJzZUludCh0aGlzLnBhbmUuY3NzKCd0b3AnKSwgMTApO1xuICAgICAgcGFuZUJvdHRvbSA9IHBhcnNlSW50KHRoaXMucGFuZS5jc3MoJ2JvdHRvbScpLCAxMCk7XG4gICAgICBwYW5lT3V0ZXJIZWlnaHQgPSBwYW5lSGVpZ2h0ICsgcGFuZVRvcCArIHBhbmVCb3R0b207XG4gICAgICBzbGlkZXJIZWlnaHQgPSBNYXRoLnJvdW5kKHBhbmVPdXRlckhlaWdodCAvIGNvbnRlbnRIZWlnaHQgKiBwYW5lSGVpZ2h0KTtcbiAgICAgIGlmIChzbGlkZXJIZWlnaHQgPCB0aGlzLm9wdGlvbnMuc2xpZGVyTWluSGVpZ2h0KSB7XG4gICAgICAgIHNsaWRlckhlaWdodCA9IHRoaXMub3B0aW9ucy5zbGlkZXJNaW5IZWlnaHQ7XG4gICAgICB9IGVsc2UgaWYgKCh0aGlzLm9wdGlvbnMuc2xpZGVyTWF4SGVpZ2h0ICE9IG51bGwpICYmIHNsaWRlckhlaWdodCA+IHRoaXMub3B0aW9ucy5zbGlkZXJNYXhIZWlnaHQpIHtcbiAgICAgICAgc2xpZGVySGVpZ2h0ID0gdGhpcy5vcHRpb25zLnNsaWRlck1heEhlaWdodDtcbiAgICAgIH1cbiAgICAgIGlmIChjb250ZW50U3R5bGVPdmVyZmxvd1kgPT09IFNDUk9MTCAmJiBjb250ZW50U3R5bGUub3ZlcmZsb3dYICE9PSBTQ1JPTEwpIHtcbiAgICAgICAgc2xpZGVySGVpZ2h0ICs9IEJST1dTRVJfU0NST0xMQkFSX1dJRFRIO1xuICAgICAgfVxuICAgICAgdGhpcy5tYXhTbGlkZXJUb3AgPSBwYW5lT3V0ZXJIZWlnaHQgLSBzbGlkZXJIZWlnaHQ7XG4gICAgICB0aGlzLmNvbnRlbnRIZWlnaHQgPSBjb250ZW50SGVpZ2h0O1xuICAgICAgdGhpcy5wYW5lSGVpZ2h0ID0gcGFuZUhlaWdodDtcbiAgICAgIHRoaXMucGFuZU91dGVySGVpZ2h0ID0gcGFuZU91dGVySGVpZ2h0O1xuICAgICAgdGhpcy5zbGlkZXJIZWlnaHQgPSBzbGlkZXJIZWlnaHQ7XG4gICAgICB0aGlzLnBhbmVUb3AgPSBwYW5lVG9wO1xuICAgICAgdGhpcy5zbGlkZXIuaGVpZ2h0KHNsaWRlckhlaWdodCk7XG4gICAgICB0aGlzLmV2ZW50cy5zY3JvbGwoKTtcbiAgICAgIHRoaXMucGFuZS5zaG93KCk7XG4gICAgICB0aGlzLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgIGlmICgoY29udGVudC5zY3JvbGxIZWlnaHQgPT09IGNvbnRlbnQuY2xpZW50SGVpZ2h0KSB8fCAodGhpcy5wYW5lLm91dGVySGVpZ2h0KHRydWUpID49IGNvbnRlbnQuc2Nyb2xsSGVpZ2h0ICYmIGNvbnRlbnRTdHlsZU92ZXJmbG93WSAhPT0gU0NST0xMKSkge1xuICAgICAgICB0aGlzLnBhbmUuaGlkZSgpO1xuICAgICAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZWwuY2xpZW50SGVpZ2h0ID09PSBjb250ZW50LnNjcm9sbEhlaWdodCAmJiBjb250ZW50U3R5bGVPdmVyZmxvd1kgPT09IFNDUk9MTCkge1xuICAgICAgICB0aGlzLnNsaWRlci5oaWRlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNsaWRlci5zaG93KCk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhbmUuY3NzKHtcbiAgICAgICAgb3BhY2l0eTogKHRoaXMub3B0aW9ucy5hbHdheXNWaXNpYmxlID8gMSA6ICcnKSxcbiAgICAgICAgdmlzaWJpbGl0eTogKHRoaXMub3B0aW9ucy5hbHdheXNWaXNpYmxlID8gJ3Zpc2libGUnIDogJycpXG4gICAgICB9KTtcbiAgICAgIGNvbnRlbnRQb3NpdGlvbiA9IHRoaXMuJGNvbnRlbnQuY3NzKCdwb3NpdGlvbicpO1xuICAgICAgaWYgKGNvbnRlbnRQb3NpdGlvbiA9PT0gJ3N0YXRpYycgfHwgY29udGVudFBvc2l0aW9uID09PSAncmVsYXRpdmUnKSB7XG4gICAgICAgIHJpZ2h0ID0gcGFyc2VJbnQodGhpcy4kY29udGVudC5jc3MoJ3JpZ2h0JyksIDEwKTtcbiAgICAgICAgaWYgKHJpZ2h0KSB7XG4gICAgICAgICAgdGhpcy4kY29udGVudC5jc3Moe1xuICAgICAgICAgICAgcmlnaHQ6ICcnLFxuICAgICAgICAgICAgbWFyZ2luUmlnaHQ6IHJpZ2h0XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgQG1ldGhvZCBzY3JvbGxcbiAgICAgIEBwcml2YXRlXG4gICAgICBAZXhhbXBsZVxuICAgICAgICAgICQoXCIubmFub1wiKS5uYW5vU2Nyb2xsZXIoeyBzY3JvbGw6ICd0b3AnIH0pO1xuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUuc2Nyb2xsID0gZnVuY3Rpb24oKSB7XG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5zbGlkZXJZID0gTWF0aC5tYXgoMCwgdGhpcy5zbGlkZXJZKTtcbiAgICAgIHRoaXMuc2xpZGVyWSA9IE1hdGgubWluKHRoaXMubWF4U2xpZGVyVG9wLCB0aGlzLnNsaWRlclkpO1xuICAgICAgdGhpcy4kY29udGVudC5zY3JvbGxUb3AodGhpcy5tYXhTY3JvbGxUb3AgKiB0aGlzLnNsaWRlclkgLyB0aGlzLm1heFNsaWRlclRvcCk7XG4gICAgICBpZiAoIXRoaXMuaU9TTmF0aXZlU2Nyb2xsaW5nKSB7XG4gICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsVmFsdWVzKCk7XG4gICAgICAgIHRoaXMuc2V0T25TY3JvbGxTdHlsZXMoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgU2Nyb2xsIGF0IHRoZSBib3R0b20gd2l0aCBhbiBvZmZzZXQgdmFsdWVcbiAgICAgIEBtZXRob2Qgc2Nyb2xsQm90dG9tXG4gICAgICBAcGFyYW0gb2Zmc2V0WSB7TnVtYmVyfVxuICAgICAgQGNoYWluYWJsZVxuICAgICAgQGV4YW1wbGVcbiAgICAgICAgICAkKFwiLm5hbm9cIikubmFub1Njcm9sbGVyKHsgc2Nyb2xsQm90dG9tOiB2YWx1ZSB9KTtcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLnNjcm9sbEJvdHRvbSA9IGZ1bmN0aW9uKG9mZnNldFkpIHtcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLiRjb250ZW50LnNjcm9sbFRvcCh0aGlzLmNvbnRlbnRIZWlnaHQgLSB0aGlzLiRjb250ZW50LmhlaWdodCgpIC0gb2Zmc2V0WSkudHJpZ2dlcihNT1VTRVdIRUVMKTtcbiAgICAgIHRoaXMuc3RvcCgpLnJlc3RvcmUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgU2Nyb2xsIGF0IHRoZSB0b3Agd2l0aCBhbiBvZmZzZXQgdmFsdWVcbiAgICAgIEBtZXRob2Qgc2Nyb2xsVG9wXG4gICAgICBAcGFyYW0gb2Zmc2V0WSB7TnVtYmVyfVxuICAgICAgQGNoYWluYWJsZVxuICAgICAgQGV4YW1wbGVcbiAgICAgICAgICAkKFwiLm5hbm9cIikubmFub1Njcm9sbGVyKHsgc2Nyb2xsVG9wOiB2YWx1ZSB9KTtcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLnNjcm9sbFRvcCA9IGZ1bmN0aW9uKG9mZnNldFkpIHtcbiAgICAgIGlmICghdGhpcy5pc0FjdGl2ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLiRjb250ZW50LnNjcm9sbFRvcCgrb2Zmc2V0WSkudHJpZ2dlcihNT1VTRVdIRUVMKTtcbiAgICAgIHRoaXMuc3RvcCgpLnJlc3RvcmUoKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgU2Nyb2xsIHRvIGFuIGVsZW1lbnRcbiAgICAgIEBtZXRob2Qgc2Nyb2xsVG9cbiAgICAgIEBwYXJhbSBub2RlIHtOb2RlfSBBIG5vZGUgdG8gc2Nyb2xsIHRvLlxuICAgICAgQGNoYWluYWJsZVxuICAgICAgQGV4YW1wbGVcbiAgICAgICAgICAkKFwiLm5hbm9cIikubmFub1Njcm9sbGVyKHsgc2Nyb2xsVG86ICQoJyNhX25vZGUnKSB9KTtcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLnNjcm9sbFRvID0gZnVuY3Rpb24obm9kZSkge1xuICAgICAgaWYgKCF0aGlzLmlzQWN0aXZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2Nyb2xsVG9wKHRoaXMuJGVsLmZpbmQobm9kZSkuZ2V0KDApLm9mZnNldFRvcCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgIFRvIHN0b3AgdGhlIG9wZXJhdGlvbi5cbiAgICAgIFRoaXMgb3B0aW9uIHdpbGwgdGVsbCB0aGUgcGx1Z2luIHRvIGRpc2FibGUgYWxsIGV2ZW50IGJpbmRpbmdzIGFuZCBoaWRlIHRoZSBnYWRnZXQgc2Nyb2xsYmFyIGZyb20gdGhlIFVJLlxuICAgICAgQG1ldGhvZCBzdG9wXG4gICAgICBAY2hhaW5hYmxlXG4gICAgICBAZXhhbXBsZVxuICAgICAgICAgICQoXCIubmFub1wiKS5uYW5vU2Nyb2xsZXIoeyBzdG9wOiB0cnVlIH0pO1xuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUuc3RvcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKGNBRiAmJiB0aGlzLnNjcm9sbFJBRikge1xuICAgICAgICBjQUYodGhpcy5zY3JvbGxSQUYpO1xuICAgICAgICB0aGlzLnNjcm9sbFJBRiA9IG51bGw7XG4gICAgICB9XG4gICAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgICAgdGhpcy5yZW1vdmVFdmVudHMoKTtcbiAgICAgIGlmICghdGhpcy5pT1NOYXRpdmVTY3JvbGxpbmcpIHtcbiAgICAgICAgdGhpcy5wYW5lLmhpZGUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAgRGVzdHJveXMgbmFub1Njcm9sbGVyIGFuZCByZXN0b3JlcyBicm93c2VyJ3MgbmF0aXZlIHNjcm9sbGJhci5cbiAgICAgIEBtZXRob2QgZGVzdHJveVxuICAgICAgQGNoYWluYWJsZVxuICAgICAgQGV4YW1wbGVcbiAgICAgICAgICAkKFwiLm5hbm9cIikubmFub1Njcm9sbGVyKHsgZGVzdHJveTogdHJ1ZSB9KTtcbiAgICAgKi9cblxuICAgIE5hbm9TY3JvbGwucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICghdGhpcy5zdG9wcGVkKSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLmlPU05hdGl2ZVNjcm9sbGluZyAmJiB0aGlzLnBhbmUubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMucGFuZS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGlmIChCUk9XU0VSX0lTX0lFNykge1xuICAgICAgICB0aGlzLiRjb250ZW50LmhlaWdodCgnJyk7XG4gICAgICB9XG4gICAgICB0aGlzLiRjb250ZW50LnJlbW92ZUF0dHIoJ3RhYmluZGV4Jyk7XG4gICAgICBpZiAodGhpcy4kZWwuaGFzQ2xhc3MoJ2hhcy1zY3JvbGxiYXInKSkge1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnaGFzLXNjcm9sbGJhcicpO1xuICAgICAgICB0aGlzLiRjb250ZW50LmNzcyh7XG4gICAgICAgICAgcmlnaHQ6ICcnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICBUbyBmbGFzaCB0aGUgc2Nyb2xsYmFyIGdhZGdldCBmb3IgYW4gYW1vdW50IG9mIHRpbWUgZGVmaW5lZCBpbiBwbHVnaW4gc2V0dGluZ3MgKGRlZmF1bHRzIHRvIDEsNXMpLlxuICAgICAgVXNlZnVsIGlmIHlvdSB3YW50IHRvIHNob3cgdGhlIHVzZXIgKGUuZy4gb24gcGFnZWxvYWQpIHRoYXQgdGhlcmUgaXMgbW9yZSBjb250ZW50IHdhaXRpbmcgZm9yIGhpbS5cbiAgICAgIEBtZXRob2QgZmxhc2hcbiAgICAgIEBjaGFpbmFibGVcbiAgICAgIEBleGFtcGxlXG4gICAgICAgICAgJChcIi5uYW5vXCIpLm5hbm9TY3JvbGxlcih7IGZsYXNoOiB0cnVlIH0pO1xuICAgICAqL1xuXG4gICAgTmFub1Njcm9sbC5wcm90b3R5cGUuZmxhc2ggPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLmlPU05hdGl2ZVNjcm9sbGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNBY3RpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgdGhpcy5wYW5lLmFkZENsYXNzKCdmbGFzaGVkJyk7XG4gICAgICBzZXRUaW1lb3V0KChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgX3RoaXMucGFuZS5yZW1vdmVDbGFzcygnZmxhc2hlZCcpO1xuICAgICAgICB9O1xuICAgICAgfSkodGhpcyksIHRoaXMub3B0aW9ucy5mbGFzaERlbGF5KTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICByZXR1cm4gTmFub1Njcm9sbDtcblxuICB9KSgpO1xuICAkLmZuLm5hbm9TY3JvbGxlciA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgIHZhciBvcHRpb25zLCBzY3JvbGxiYXI7XG4gICAgICBpZiAoIShzY3JvbGxiYXIgPSB0aGlzLm5hbm9zY3JvbGxlcikpIHtcbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0cywgc2V0dGluZ3MpO1xuICAgICAgICB0aGlzLm5hbm9zY3JvbGxlciA9IHNjcm9sbGJhciA9IG5ldyBOYW5vU2Nyb2xsKHRoaXMsIG9wdGlvbnMpO1xuICAgICAgfVxuICAgICAgaWYgKHNldHRpbmdzICYmIHR5cGVvZiBzZXR0aW5ncyA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICAkLmV4dGVuZChzY3JvbGxiYXIub3B0aW9ucywgc2V0dGluZ3MpO1xuICAgICAgICBpZiAoc2V0dGluZ3Muc2Nyb2xsQm90dG9tICE9IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gc2Nyb2xsYmFyLnNjcm9sbEJvdHRvbShzZXR0aW5ncy5zY3JvbGxCb3R0b20pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY3JvbGxUb3AgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBzY3JvbGxiYXIuc2Nyb2xsVG9wKHNldHRpbmdzLnNjcm9sbFRvcCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbFRvKSB7XG4gICAgICAgICAgcmV0dXJuIHNjcm9sbGJhci5zY3JvbGxUbyhzZXR0aW5ncy5zY3JvbGxUbyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLnNjcm9sbCA9PT0gJ2JvdHRvbScpIHtcbiAgICAgICAgICByZXR1cm4gc2Nyb2xsYmFyLnNjcm9sbEJvdHRvbSgwKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3Muc2Nyb2xsID09PSAndG9wJykge1xuICAgICAgICAgIHJldHVybiBzY3JvbGxiYXIuc2Nyb2xsVG9wKDApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5ncy5zY3JvbGwgJiYgc2V0dGluZ3Muc2Nyb2xsIGluc3RhbmNlb2YgJCkge1xuICAgICAgICAgIHJldHVybiBzY3JvbGxiYXIuc2Nyb2xsVG8oc2V0dGluZ3Muc2Nyb2xsKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2V0dGluZ3Muc3RvcCkge1xuICAgICAgICAgIHJldHVybiBzY3JvbGxiYXIuc3RvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzZXR0aW5ncy5kZXN0cm95KSB7XG4gICAgICAgICAgcmV0dXJuIHNjcm9sbGJhci5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNldHRpbmdzLmZsYXNoKSB7XG4gICAgICAgICAgcmV0dXJuIHNjcm9sbGJhci5mbGFzaCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gc2Nyb2xsYmFyLnJlc2V0KCk7XG4gICAgfSk7XG4gIH07XG4gICQuZm4ubmFub1Njcm9sbGVyLkNvbnN0cnVjdG9yID0gTmFub1Njcm9sbDtcbn0pO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1qcXVlcnkubmFub3Njcm9sbGVyLmpzLm1hcFxuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwicmVxdWlyZSgnanF1ZXJ5Jyk7XG5yZXF1aXJlKCcuLi92ZW5kb3IvanF1ZXJ5LWJyb3dzZXItbW9iaWxlL2pxdWVyeS5icm93c2VyLm1vYmlsZScpO1xucmVxdWlyZSgncG9wcGVyLmpzJyk7XG5yZXF1aXJlKCdib290c3RyYXAnKTtcbnJlcXVpcmUoJ2Jvb3RzdHJhcC1kYXRlcGlja2VyL2Rpc3QvanMvYm9vdHN0cmFwLWRhdGVwaWNrZXInKTtcbnJlcXVpcmUoJy4uL3ZlbmRvci9jb21tb24vY29tbW9uJyk7XG5yZXF1aXJlKCduYW5vc2Nyb2xsZXIvYmluL2phdmFzY3JpcHRzL2pxdWVyeS5uYW5vc2Nyb2xsZXInKTtcbnJlcXVpcmUoJ21hZ25pZmljLXBvcHVwL2Rpc3QvanF1ZXJ5Lm1hZ25pZmljLXBvcHVwJyk7XG5yZXF1aXJlKCdqcXVlcnkucGxhY2Vob2xkZXIvanF1ZXJ5LnBsYWNlaG9sZGVyJyk7XG5yZXF1aXJlKCcuL3RoZW1lJyk7XG5yZXF1aXJlKCcuL2N1c3RvbScpO1xucmVxdWlyZSgnLi90aGVtZS5pbml0Jyk7IiwiLyogQWRkIGhlcmUgYWxsIHlvdXIgSlMgY3VzdG9taXphdGlvbnMgKi8iLCJcclxuXHJcbi8vIEFuaW1hdGVcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAnYXBwZWFyJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tYW5pbWF0ZV0sIFtkYXRhLWFwcGVhci1hbmltYXRpb25dJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpbkFuaW1hdGUob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIENhcm91c2VsXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0aWYgKCAkLmlzRnVuY3Rpb24oJC5mblsgJ293bENhcm91c2VsJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tY2Fyb3VzZWxdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpbkNhcm91c2VsKG9wdHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBDaGFydCBDaXJjdWxhclxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICdlYXN5UGllQ2hhcnQnIF0pICkge1xyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJ1tkYXRhLXBsdWdpbi1jaGFydC1jaXJjdWxhcl0sIC5jaXJjdWxhci1iYXItY2hhcnQ6bm90KC5tYW51YWwpJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpbkNoYXJ0Q2lyY3VsYXIob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIENvZGVtaXJyb3JcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoIHR5cGVvZiBDb2RlTWlycm9yICE9PSAndW5kZWZpbmVkJyApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tY29kZW1pcnJvcl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luQ29kZU1pcnJvcihvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gQ29sb3JwaWNrZXJcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAnY29sb3JwaWNrZXInIF0pICkge1xyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJ1tkYXRhLXBsdWdpbi1jb2xvcnBpY2tlcl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luQ29sb3JQaWNrZXIob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIERhdGVwaWNrZXJcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAnYm9vdHN0cmFwRFAnIF0pICkge1xyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJ1tkYXRhLXBsdWdpbi1kYXRlcGlja2VyXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxyXG5cdFx0XHRcdFx0b3B0cyA9IHt9O1xyXG5cclxuXHRcdFx0XHR2YXIgcGx1Z2luT3B0aW9ucyA9ICR0aGlzLmRhdGEoJ3BsdWdpbi1vcHRpb25zJyk7XHJcblx0XHRcdFx0aWYgKHBsdWdpbk9wdGlvbnMpXHJcblx0XHRcdFx0XHRvcHRzID0gcGx1Z2luT3B0aW9ucztcclxuXHJcblx0XHRcdFx0JHRoaXMudGhlbWVQbHVnaW5EYXRlUGlja2VyKG9wdHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBIZWFkZXIgTWVudSBOYXZcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHRcclxuXHRpZiAodHlwZW9mIHRoZW1lLk5hdiAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdHRoZW1lLk5hdi5pbml0aWFsaXplKCk7XHJcblx0fVxyXG5cdFxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIGlvc1N3aXRjaGVyXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0aWYgKCB0eXBlb2YgU3dpdGNoICE9PSAndW5kZWZpbmVkJyAmJiAkLmlzRnVuY3Rpb24oIFN3aXRjaCApICkge1xyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJ1tkYXRhLXBsdWdpbi1pb3Mtc3dpdGNoXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpbklPUzdTd2l0Y2goKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gTGlnaHRib3hcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAnbWFnbmlmaWNQb3B1cCcgXSkgKSB7XHJcblxyXG5cdFx0JChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnW2RhdGEtcGx1Z2luLWxpZ2h0Ym94XSwgLmxpZ2h0Ym94Om5vdCgubWFudWFsKScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxyXG5cdFx0XHRcdFx0b3B0cyA9IHt9O1xyXG5cclxuXHRcdFx0XHR2YXIgcGx1Z2luT3B0aW9ucyA9ICR0aGlzLmRhdGEoJ3BsdWdpbi1vcHRpb25zJyk7XHJcblx0XHRcdFx0aWYgKHBsdWdpbk9wdGlvbnMpXHJcblx0XHRcdFx0XHRvcHRzID0gcGx1Z2luT3B0aW9ucztcclxuXHJcblx0XHRcdFx0JHRoaXMudGhlbWVQbHVnaW5MaWdodGJveChvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gUG9ydGxldHNcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoIHR5cGVvZiBOUHJvZ3Jlc3MgIT09ICd1bmRlZmluZWQnICYmICQuaXNGdW5jdGlvbiggTlByb2dyZXNzLmNvbmZpZ3VyZSApICkge1xyXG5cclxuXHRcdE5Qcm9ncmVzcy5jb25maWd1cmUoe1xyXG5cdFx0XHRzaG93U3Bpbm5lcjogZmFsc2UsXHJcblx0XHRcdGVhc2U6ICdlYXNlJyxcclxuXHRcdFx0c3BlZWQ6IDc1MFxyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIE1hcmtkb3duXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0aWYgKCAkLmlzRnVuY3Rpb24oJC5mblsgJ21hcmtkb3duJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tbWFya2Rvd24tZWRpdG9yXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxyXG5cdFx0XHRcdFx0b3B0cyA9IHt9O1xyXG5cclxuXHRcdFx0XHR2YXIgcGx1Z2luT3B0aW9ucyA9ICR0aGlzLmRhdGEoJ3BsdWdpbi1vcHRpb25zJyk7XHJcblx0XHRcdFx0aWYgKHBsdWdpbk9wdGlvbnMpXHJcblx0XHRcdFx0XHRvcHRzID0gcGx1Z2luT3B0aW9ucztcclxuXHJcblx0XHRcdFx0JHRoaXMudGhlbWVQbHVnaW5NYXJrZG93bkVkaXRvcihvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gTWFza2VkIElucHV0XHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0aWYgKCAkLmlzRnVuY3Rpb24oJC5mblsgJ21hc2snIF0pICkge1xyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJ1tkYXRhLXBsdWdpbi1tYXNrZWQtaW5wdXRdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpbk1hc2tlZElucHV0KG9wdHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBNYXhMZW5ndGhcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbiggJC5mblsgJ21heGxlbmd0aCcgXSkgKSB7XHJcblxyXG5cdFx0JChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnW2RhdGEtcGx1Z2luLW1heGxlbmd0aF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luTWF4TGVuZ3RoKG9wdHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBNdWx0aVNlbGVjdFxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCAkLmZuWyAnbXVsdGlzZWxlY3QnIF0gKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCAnW2RhdGEtcGx1Z2luLW11bHRpc2VsZWN0XScgKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpbk11bHRpU2VsZWN0KG9wdHMpO1xyXG5cclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbiggJC5mblsgJ3BsYWNlaG9sZGVyJyBdKSApIHtcclxuXHJcblx0XHQkKCdpbnB1dFtwbGFjZWhvbGRlcl0nKS5wbGFjZWhvbGRlcigpO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG5cclxuLy8gUG9wb3ZlclxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCAkLmZuWydwb3BvdmVyJ10gKSApIHtcclxuXHRcdCQoICdbZGF0YS10b2dnbGU9cG9wb3Zlcl0nICkucG9wb3ZlcigpO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFBvcnRsZXRzXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdCQoJ1tkYXRhLXBsdWdpbi1wb3J0bGV0XScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHR2YXIgcGx1Z2luT3B0aW9ucyA9ICR0aGlzLmRhdGEoJ3BsdWdpbi1vcHRpb25zJyk7XHJcblx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0JHRoaXMudGhlbWVQbHVnaW5Qb3J0bGV0KG9wdHMpO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBTY3JvbGwgdG8gVG9wXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cdC8vIFNjcm9sbCB0byBUb3AgQnV0dG9uLlxyXG5cdGlmICh0eXBlb2YgdGhlbWUuUGx1Z2luU2Nyb2xsVG9Ub3AgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHR0aGVtZS5QbHVnaW5TY3JvbGxUb1RvcC5pbml0aWFsaXplKCk7XHJcblx0fVxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIFNjcm9sbGFibGVcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAnbmFub1Njcm9sbGVyJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tc2Nyb2xsYWJsZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKSB7XHJcblx0XHRcdFx0XHRvcHRzID0gcGx1Z2luT3B0aW9ucztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luU2Nyb2xsYWJsZShvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gU2VsZWN0MlxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICdzZWxlY3QyJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tc2VsZWN0VHdvXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxyXG5cdFx0XHRcdFx0b3B0cyA9IHt9O1xyXG5cclxuXHRcdFx0XHR2YXIgcGx1Z2luT3B0aW9ucyA9ICR0aGlzLmRhdGEoJ3BsdWdpbi1vcHRpb25zJyk7XHJcblx0XHRcdFx0aWYgKHBsdWdpbk9wdGlvbnMpXHJcblx0XHRcdFx0XHRvcHRzID0gcGx1Z2luT3B0aW9ucztcclxuXHJcblx0XHRcdFx0JHRoaXMudGhlbWVQbHVnaW5TZWxlY3QyKG9wdHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBTaWRlYmFyIFdpZGdldHNcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRmdW5jdGlvbiBleHBhbmQoIGNvbnRlbnQgKSB7XHJcblx0XHRjb250ZW50LmNoaWxkcmVuKCAnLndpZGdldC1jb250ZW50JyApLnNsaWRlRG93biggJ2Zhc3QnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5jc3MoICdkaXNwbGF5JywgJycgKTtcclxuXHRcdFx0Y29udGVudC5yZW1vdmVDbGFzcyggJ3dpZGdldC1jb2xsYXBzZWQnICk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIGNvbGxhcHNlKCBjb250ZW50ICkge1xyXG5cdFx0Y29udGVudC5jaGlsZHJlbignLndpZGdldC1jb250ZW50JyApLnNsaWRlVXAoICdmYXN0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdGNvbnRlbnQuYWRkQ2xhc3MoICd3aWRnZXQtY29sbGFwc2VkJyApO1xyXG5cdFx0XHQkKHRoaXMpLmNzcyggJ2Rpc3BsYXknLCAnJyApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR2YXIgJHdpZGdldHMgPSAkKCAnLnNpZGViYXItd2lkZ2V0JyApO1xyXG5cclxuXHQkd2lkZ2V0cy5lYWNoKCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgJHdpZGdldCA9ICQoIHRoaXMgKSxcclxuXHRcdFx0JHRvZ2dsZXIgPSAkd2lkZ2V0LmZpbmQoICcud2lkZ2V0LXRvZ2dsZScgKTtcclxuXHJcblx0XHQkdG9nZ2xlci5vbignY2xpY2sud2lkZ2V0LXRvZ2dsZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JHdpZGdldC5oYXNDbGFzcygnd2lkZ2V0LWNvbGxhcHNlZCcpID8gZXhwYW5kKCR3aWRnZXQpIDogY29sbGFwc2UoJHdpZGdldCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFNsaWRlclxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICdzbGlkZXInIF0pICkge1xyXG5cclxuXHRcdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdCQoJ1tkYXRhLXBsdWdpbi1zbGlkZXJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucykge1xyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpblNsaWRlcihvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gU3Bpbm5lclxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICdzcGlubmVyJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tc3Bpbm5lcl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luU3Bpbm5lcihvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gU3VtbWVyTm90ZVxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICdzdW1tZXJub3RlJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tc3VtbWVybm90ZV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luU3VtbWVyTm90ZShvcHRzKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9KTtcclxuXHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gVGV4dEFyZWEgQXV0b1NpemVcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoIHR5cGVvZiBhdXRvc2l6ZSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4tdGV4dGFyZWEtYXV0b3NpemVdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpblRleHRBcmVhQXV0b1NpemUob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFRpbWVQaWNrZXJcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAndGltZXBpY2tlcicgXSkgKSB7XHJcblxyXG5cdFx0JChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnW2RhdGEtcGx1Z2luLXRpbWVwaWNrZXJdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICksXHJcblx0XHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHRcdHZhciBwbHVnaW5PcHRpb25zID0gJHRoaXMuZGF0YSgncGx1Z2luLW9wdGlvbnMnKTtcclxuXHRcdFx0XHRpZiAocGx1Z2luT3B0aW9ucylcclxuXHRcdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0XHQkdGhpcy50aGVtZVBsdWdpblRpbWVQaWNrZXIob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFRvZ2dsZVxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHQkKCdbZGF0YS1wbHVnaW4tdG9nZ2xlXScpLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRvcHRzID0ge307XHJcblxyXG5cdFx0XHR2YXIgcGx1Z2luT3B0aW9ucyA9ICR0aGlzLmRhdGEoJ3BsdWdpbi1vcHRpb25zJyk7XHJcblx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdG9wdHMgPSBwbHVnaW5PcHRpb25zO1xyXG5cclxuXHRcdFx0JHRoaXMudGhlbWVQbHVnaW5Ub2dnbGUob3B0cyk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFRvb2x0aXBcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbiggJC5mblsndG9vbHRpcCddICkgKSB7XHJcblx0XHQkKCAnW2RhdGEtdG9nZ2xlPXRvb2x0aXBdLFtyZWw9dG9vbHRpcF0nICkudG9vbHRpcCh7IGNvbnRhaW5lcjogJ2JvZHknIH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFdpZGdldCAtIFRvZG9cclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHRpZiAoICQuaXNGdW5jdGlvbigkLmZuWyAndGhlbWVQbHVnaW5XaWRnZXRUb2RvTGlzdCcgXSkgKSB7XHJcblxyXG5cdFx0JChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnW2RhdGEtcGx1Z2luLXRvZG8tbGlzdF0sIHVsLndpZGdldC10b2RvLWxpc3QnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luV2lkZ2V0VG9kb0xpc3Qob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFdpZGdldCAtIFRvZ2dsZVxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICd0aGVtZVBsdWdpbldpZGdldFRvZ2dsZUV4cGFuZCcgXSkgKSB7XHJcblxyXG5cdFx0JChmdW5jdGlvbigpIHtcclxuXHRcdFx0JCgnW2RhdGEtcGx1Z2luLXRvZ2dsZS1leHBhbmRdLCAud2lkZ2V0LXRvZ2dsZS1leHBhbmQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luV2lkZ2V0VG9nZ2xlRXhwYW5kKG9wdHMpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIFdvcmQgUm90YXRvclxyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdGlmICggJC5pc0Z1bmN0aW9uKCQuZm5bICd0aGVtZVBsdWdpbldvcmRSb3RhdG9yJyBdKSApIHtcclxuXHJcblx0XHQkKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCdbZGF0YS1wbHVnaW4td29ydC1yb3RhdG9yXSwgLndvcnQtcm90YXRvcjpub3QoLm1hbnVhbCknKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdG9wdHMgPSB7fTtcclxuXHJcblx0XHRcdFx0dmFyIHBsdWdpbk9wdGlvbnMgPSAkdGhpcy5kYXRhKCdwbHVnaW4tb3B0aW9ucycpO1xyXG5cdFx0XHRcdGlmIChwbHVnaW5PcHRpb25zKVxyXG5cdFx0XHRcdFx0b3B0cyA9IHBsdWdpbk9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdCR0aGlzLnRoZW1lUGx1Z2luV29yZFJvdGF0b3Iob3B0cyk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblxyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIEJhc2VcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dGhlbWUuU2tlbGV0b24uaW5pdGlhbGl6ZSgpO1xyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBNYWlsYm94XHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdCQoJ1tkYXRhLW1haWxib3hdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xyXG5cclxuXHRcdFx0JHRoaXMudGhlbWVNYWlsYm94KCk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTsiLCIvKlxyXG5OYW1lOiBcdFx0XHRUaGVtZSBCYXNlXHJcbldyaXR0ZW4gYnk6IFx0T2tsZXIgVGhlbWVzIC0gKGh0dHA6Ly93d3cub2tsZXIubmV0KVxyXG5UaGVtZSBWZXJzaW9uOiBcdDIuMi4wXHJcbiovXHJcblxyXG53aW5kb3cudGhlbWUgPSB7fTtcclxuXHJcbi8vIFRoZW1lIENvbW1vbiBGdW5jdGlvbnNcclxud2luZG93LnRoZW1lLmZuID0ge1xyXG5cclxuXHRnZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblxyXG5cdFx0aWYgKHR5cGVvZihvcHRzKSA9PSAnb2JqZWN0Jykge1xyXG5cclxuXHRcdFx0cmV0dXJuIG9wdHM7XHJcblxyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2Yob3B0cykgPT0gJ3N0cmluZycpIHtcclxuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0cmV0dXJuIEpTT04ucGFyc2Uob3B0cy5yZXBsYWNlKC8nL2csJ1wiJykucmVwbGFjZSgnOycsJycpKTtcclxuXHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0cmV0dXJuIHt9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdHJldHVybiB7fTtcclxuXHJcblx0XHR9XHJcblxyXG5cdH1cclxuXHJcbn07XHJcblxyXG4vLyBBbmltYXRlXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fYW5pbWF0ZSc7XHJcblxyXG5cdHZhciBQbHVnaW5BbmltYXRlID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luQW5pbWF0ZS5kZWZhdWx0cyA9IHtcclxuXHRcdGFjY1g6IDAsXHJcblx0XHRhY2NZOiAtMTUwLFxyXG5cdFx0ZGVsYXk6IDEsXHJcblx0XHRkdXJhdGlvbjogJzFzJ1xyXG5cdH07XHJcblxyXG5cdFBsdWdpbkFuaW1hdGUucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICgkZWwuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgUGx1Z2luQW5pbWF0ZS5kZWZhdWx0cywgb3B0cywge1xyXG5cdFx0XHRcdHdyYXBwZXI6IHRoaXMuJGVsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdCRlbCA9IHRoaXMub3B0aW9ucy53cmFwcGVyLFxyXG5cdFx0XHRcdGRlbGF5ID0gMCxcclxuXHRcdFx0XHRkdXJhdGlvbiA9ICcxcycsXHJcblx0XHRcdFx0ZWxUb3BEaXN0YW5jZSA9ICRlbC5vZmZzZXQoKS50b3AsXHJcblx0XHRcdFx0d2luZG93VG9wRGlzdGFuY2UgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xyXG5cclxuXHRcdFx0XHQkZWwuYWRkQ2xhc3MoJ2FwcGVhci1hbmltYXRpb24gYW5pbWF0ZWQnKTtcclxuXHJcblx0XHRcdFx0aWYgKCEkKCdodG1sJykuaGFzQ2xhc3MoJ25vLWNzc3RyYW5zaXRpb25zJykgJiYgJCh3aW5kb3cpLndpZHRoKCkgPiA3NjcgJiYgZWxUb3BEaXN0YW5jZSA+IHdpbmRvd1RvcERpc3RhbmNlKSB7XHJcblxyXG5cdFx0XHRcdFx0JGVsLmFwcGVhcihmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0XHRcdCRlbC5vbmUoJ2FuaW1hdGlvbjpzaG93JywgZnVuY3Rpb24oZXYpIHtcclxuXHRcdFx0XHRcdFx0XHRkZWxheSA9ICgkZWwuYXR0cignZGF0YS1hcHBlYXItYW5pbWF0aW9uLWRlbGF5JykgPyAkZWwuYXR0cignZGF0YS1hcHBlYXItYW5pbWF0aW9uLWRlbGF5JykgOiBzZWxmLm9wdGlvbnMuZGVsYXkpO1xyXG5cdFx0XHRcdFx0XHRcdGR1cmF0aW9uID0gKCRlbC5hdHRyKCdkYXRhLWFwcGVhci1hbmltYXRpb24tZHVyYXRpb24nKSA/ICRlbC5hdHRyKCdkYXRhLWFwcGVhci1hbmltYXRpb24tZHVyYXRpb24nKSA6IHNlbGYub3B0aW9ucy5kdXJhdGlvbik7XHJcblxyXG5cdFx0XHRcdFx0XHRcdGlmIChkdXJhdGlvbiAhPSAnMXMnKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkZWwuY3NzKCdhbmltYXRpb24tZHVyYXRpb24nLCBkdXJhdGlvbik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0JGVsLmFkZENsYXNzKCRlbC5hdHRyKCdkYXRhLWFwcGVhci1hbmltYXRpb24nKSArICcgYXBwZWFyLWFuaW1hdGlvbi12aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRcdFx0fSwgZGVsYXkpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRcdCRlbC50cmlnZ2VyKCdhbmltYXRpb246c2hvdycpO1xyXG5cclxuXHRcdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdFx0YWNjWDogc2VsZi5vcHRpb25zLmFjY1gsXHJcblx0XHRcdFx0XHRcdGFjY1k6IHNlbGYub3B0aW9ucy5hY2NZXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQkZWwuYWRkQ2xhc3MoJ2FwcGVhci1hbmltYXRpb24tdmlzaWJsZScpO1xyXG5cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5BbmltYXRlOiBQbHVnaW5BbmltYXRlXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luQW5pbWF0ZSA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luQW5pbWF0ZSgkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9O1xyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBCb290c3RyYXAgVG9nZ2xlXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyICR3aW5kb3cgPSAkKCB3aW5kb3cgKTtcclxuXHJcblx0dmFyIHRvZ2dsZUNsYXNzID0gZnVuY3Rpb24oICRlbCApIHtcclxuXHRcdGlmICggISEkZWwuZGF0YSgndG9nZ2xlQ2xhc3NCaW5kZWQnKSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciAkdGFyZ2V0LFxyXG5cdFx0XHRjbGFzc05hbWUsXHJcblx0XHRcdGV2ZW50TmFtZTtcclxuXHJcblx0XHQkdGFyZ2V0ID0gJCggJGVsLmF0dHIoJ2RhdGEtdGFyZ2V0JykgKTtcclxuXHRcdGNsYXNzTmFtZSA9ICRlbC5hdHRyKCdkYXRhLXRvZ2dsZS1jbGFzcycpO1xyXG5cdFx0ZXZlbnROYW1lID0gJGVsLmF0dHIoJ2RhdGEtZmlyZS1ldmVudCcpO1xyXG5cclxuXHJcblx0XHQkZWwub24oJ2NsaWNrLnRvZ2dsZUNsYXNzJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdCR0YXJnZXQudG9nZ2xlQ2xhc3MoIGNsYXNzTmFtZSApO1xyXG5cclxuXHRcdFx0dmFyIGhhc0NsYXNzID0gJHRhcmdldC5oYXNDbGFzcyggY2xhc3NOYW1lICk7XHJcblxyXG5cdFx0XHRpZiAoICEhZXZlbnROYW1lICkge1xyXG5cdFx0XHRcdCR3aW5kb3cudHJpZ2dlciggZXZlbnROYW1lLCB7XHJcblx0XHRcdFx0XHRhZGRlZDogaGFzQ2xhc3MsXHJcblx0XHRcdFx0XHRyZW1vdmVkOiAhaGFzQ2xhc3NcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JGVsLmRhdGEoJ3RvZ2dsZUNsYXNzQmluZGVkJywgdHJ1ZSk7XHJcblxyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fTtcclxuXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdCQoJ1tkYXRhLXRvZ2dsZS1jbGFzc11bZGF0YS10YXJnZXRdJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dG9nZ2xlQ2xhc3MoICQodGhpcykgKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gQ2FyZHNcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdCQoJy5jYXJkJylcclxuXHRcdFx0Lm9uKCAnY2FyZDp0b2dnbGUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMsXHJcblx0XHRcdFx0XHRkaXJlY3Rpb247XHJcblxyXG5cdFx0XHRcdCR0aGlzID0gJCh0aGlzKTtcclxuXHRcdFx0XHRkaXJlY3Rpb24gPSAkdGhpcy5oYXNDbGFzcyggJ2NhcmQtY29sbGFwc2VkJyApID8gJ0Rvd24nIDogJ1VwJztcclxuXHJcblx0XHRcdFx0JHRoaXMuZmluZCgnLmNhcmQtYm9keSwgLmNhcmQtZm9vdGVyJylbICdzbGlkZScgKyBkaXJlY3Rpb24gXSggMjAwLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCR0aGlzWyAoZGlyZWN0aW9uID09PSAnVXAnID8gJ2FkZCcgOiAncmVtb3ZlJykgKyAnQ2xhc3MnIF0oICdjYXJkLWNvbGxhcHNlZCcgKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oICdjYXJkOmRpc21pc3MnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRpZiAoICEhKCAkdGhpcy5wYXJlbnQoJ2RpdicpLmF0dHIoJ2NsYXNzJykgfHwgJycgKS5tYXRjaCggL2NvbC0oeHN8c218bWR8bGcpL2cgKSAmJiAkdGhpcy5zaWJsaW5ncygpLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHRcdCRyb3cgPSAkdGhpcy5jbG9zZXN0KCcucm93Jyk7XHJcblx0XHRcdFx0XHQkdGhpcy5wYXJlbnQoJ2RpdicpLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0aWYgKCAkcm93LmNoaWxkcmVuKCkubGVuZ3RoID09PSAwICkge1xyXG5cdFx0XHRcdFx0XHQkcm93LnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkdGhpcy5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbiggJ2NsaWNrJywgJ1tkYXRhLWNhcmQtdG9nZ2xlXScsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJy5jYXJkJykudHJpZ2dlciggJ2NhcmQ6dG9nZ2xlJyApO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQub24oICdjbGljaycsICdbZGF0YS1jYXJkLWRpc21pc3NdJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnLmNhcmQnKS50cmlnZ2VyKCAnY2FyZDpkaXNtaXNzJyApO1xyXG5cdFx0XHR9KVxyXG5cdFx0XHQvKiBEZXByZWNhdGVkICovXHJcblx0XHRcdC5vbiggJ2NsaWNrJywgJy5jYXJkLWFjdGlvbnMgYS5mYS1jYXJldC11cCcsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XHJcblxyXG5cdFx0XHRcdCR0aGlzXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdmYS1jYXJldC11cCcgKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCAnZmEtY2FyZXQtZG93bicgKTtcclxuXHJcblx0XHRcdFx0JHRoaXMuY2xvc2VzdCgnLmNhcmQnKS50cmlnZ2VyKCAnY2FyZDp0b2dnbGUnICk7XHJcblx0XHRcdH0pXHJcblx0XHRcdC5vbiggJ2NsaWNrJywgJy5jYXJkLWFjdGlvbnMgYS5mYS1jYXJldC1kb3duJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcclxuXHJcblx0XHRcdFx0JHRoaXNcclxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2ZhLWNhcmV0LWRvd24nIClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ2ZhLWNhcmV0LXVwJyApO1xyXG5cclxuXHRcdFx0XHQkdGhpcy5jbG9zZXN0KCcuY2FyZCcpLnRyaWdnZXIoICdjYXJkOnRvZ2dsZScgKTtcclxuXHRcdFx0fSlcclxuXHRcdFx0Lm9uKCAnY2xpY2snLCAnLmNhcmQtYWN0aW9ucyBhLmZhLXRpbWVzJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKTtcclxuXHJcblx0XHRcdFx0JHRoaXMuY2xvc2VzdCgnLmNhcmQnKS50cmlnZ2VyKCAnY2FyZDpkaXNtaXNzJyApO1xyXG5cdFx0XHR9KTtcclxuXHR9KTtcclxuXHJcbn0pKGpRdWVyeSk7XHJcblxyXG4vLyBDYXJvdXNlbFxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluaXRpYWxpemVkID0gZmFsc2U7XHJcblx0dmFyIGluc3RhbmNlTmFtZSA9ICdfX2Nhcm91c2VsJztcclxuXHJcblx0dmFyIFBsdWdpbkNhcm91c2VsID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luQ2Fyb3VzZWwuZGVmYXVsdHMgPSB7XHJcblx0XHRuYXZUZXh0OiBbXVxyXG5cdH07XHJcblxyXG5cdFBsdWdpbkNhcm91c2VsLnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0XHRpZiAoICRlbC5kYXRhKCBpbnN0YW5jZU5hbWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0LmJ1aWxkKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBQbHVnaW5DYXJvdXNlbC5kZWZhdWx0cywgb3B0cywge1xyXG5cdFx0XHRcdHdyYXBwZXI6IHRoaXMuJGVsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zLndyYXBwZXIub3dsQ2Fyb3VzZWwodGhpcy5vcHRpb25zKS5hZGRDbGFzcyhcIm93bC1jYXJvdXNlbC1pbml0XCIpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpbkNhcm91c2VsOiBQbHVnaW5DYXJvdXNlbFxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpbkNhcm91c2VsID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQbHVnaW5DYXJvdXNlbCgkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIENoYXJ0IENpcmN1bGFyXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fY2hhcnRDaXJjdWxhcic7XHJcblxyXG5cdHZhciBQbHVnaW5DaGFydENpcmN1bGFyID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luQ2hhcnRDaXJjdWxhci5kZWZhdWx0cyA9IHtcclxuXHRcdGFjY1g6IDAsXHJcblx0XHRhY2NZOiAtMTUwLFxyXG5cdFx0ZGVsYXk6IDEsXHJcblx0XHRiYXJDb2xvcjogJyMwMDg4Q0MnLFxyXG5cdFx0dHJhY2tDb2xvcjogJyNmMmYyZjInLFxyXG5cdFx0c2NhbGVDb2xvcjogZmFsc2UsXHJcblx0XHRzY2FsZUxlbmd0aDogNSxcclxuXHRcdGxpbmVDYXA6ICdyb3VuZCcsXHJcblx0XHRsaW5lV2lkdGg6IDEzLFxyXG5cdFx0c2l6ZTogMTc1LFxyXG5cdFx0cm90YXRlOiAwLFxyXG5cdFx0YW5pbWF0ZTogKHtcclxuXHRcdFx0ZHVyYXRpb246IDI1MDAsXHJcblx0XHRcdGVuYWJsZWQ6IHRydWVcclxuXHRcdH0pXHJcblx0fTtcclxuXHJcblx0UGx1Z2luQ2hhcnRDaXJjdWxhci5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgUGx1Z2luQ2hhcnRDaXJjdWxhci5kZWZhdWx0cywgb3B0cywge1xyXG5cdFx0XHRcdHdyYXBwZXI6IHRoaXMuJGVsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdCRlbCA9IHRoaXMub3B0aW9ucy53cmFwcGVyLFxyXG5cdFx0XHRcdHZhbHVlID0gKCRlbC5hdHRyKCdkYXRhLXBlcmNlbnQnKSA/ICRlbC5hdHRyKCdkYXRhLXBlcmNlbnQnKSA6IDApLFxyXG5cdFx0XHRcdHBlcmNlbnRFbCA9ICRlbC5maW5kKCcucGVyY2VudCcpLFxyXG5cdFx0XHRcdHNob3VsZEFuaW1hdGUsXHJcblx0XHRcdFx0ZGF0YTtcclxuXHJcblx0XHRcdHNob3VsZEFuaW1hdGUgPSAkLmlzRnVuY3Rpb24oJC5mblsgJ2FwcGVhcicgXSkgJiYgKCB0eXBlb2YgJC5icm93c2VyICE9PSAndW5kZWZpbmVkJyAmJiAhJC5icm93c2VyLm1vYmlsZSApO1xyXG5cdFx0XHRkYXRhID0geyBhY2NYOiBzZWxmLm9wdGlvbnMuYWNjWCwgYWNjWTogc2VsZi5vcHRpb25zLmFjY1kgfTtcclxuXHJcblx0XHRcdCQuZXh0ZW5kKHRydWUsIHNlbGYub3B0aW9ucywge1xyXG5cdFx0XHRcdG9uU3RlcDogZnVuY3Rpb24oZnJvbSwgdG8sIGN1cnJlbnRWYWx1ZSkge1xyXG5cdFx0XHRcdFx0cGVyY2VudEVsLmh0bWwocGFyc2VJbnQoY3VycmVudFZhbHVlKSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdCRlbC5hdHRyKCdkYXRhLXBlcmNlbnQnLCAoc2hvdWxkQW5pbWF0ZSA/IDAgOiB2YWx1ZSkgKTtcclxuXHJcblx0XHRcdCRlbC5lYXN5UGllQ2hhcnQoIHRoaXMub3B0aW9ucyApO1xyXG5cclxuXHRcdFx0aWYgKCBzaG91bGRBbmltYXRlICkge1xyXG5cdFx0XHRcdCRlbC5hcHBlYXIoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHQkZWwuZGF0YSgnZWFzeVBpZUNoYXJ0JykudXBkYXRlKHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0JGVsLmF0dHIoJ2RhdGEtcGVyY2VudCcsIHZhbHVlKTtcclxuXHJcblx0XHRcdFx0XHR9LCBzZWxmLm9wdGlvbnMuZGVsYXkpO1xyXG5cdFx0XHRcdH0sIGRhdGEpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCRlbC5kYXRhKCdlYXN5UGllQ2hhcnQnKS51cGRhdGUodmFsdWUpO1xyXG5cdFx0XHRcdCRlbC5hdHRyKCdkYXRhLXBlcmNlbnQnLCB2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRydWUsIHRoZW1lLCB7XHJcblx0XHRDaGFydDoge1xyXG5cdFx0XHRQbHVnaW5DaGFydENpcmN1bGFyOiBQbHVnaW5DaGFydENpcmN1bGFyXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luQ2hhcnRDaXJjdWxhciA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luQ2hhcnRDaXJjdWxhcigkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIENvZGVtaXJyb3JcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19jb2RlbWlycm9yJztcclxuXHJcblx0dmFyIFBsdWdpbkNvZGVNaXJyb3IgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5Db2RlTWlycm9yLmRlZmF1bHRzID0ge1xyXG5cdFx0bGluZU51bWJlcnM6IHRydWUsXHJcblx0XHRzdHlsZUFjdGl2ZUxpbmU6IHRydWUsXHJcblx0XHRtYXRjaEJyYWNrZXRzOiB0cnVlLFxyXG5cdFx0dGhlbWU6ICdtb25va2FpJ1xyXG5cdH07XHJcblxyXG5cdFBsdWdpbkNvZGVNaXJyb3IucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5Db2RlTWlycm9yLmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRDb2RlTWlycm9yLmZyb21UZXh0QXJlYSggdGhpcy4kZWwuZ2V0KDApLCB0aGlzLm9wdGlvbnMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5Db2RlTWlycm9yOiBQbHVnaW5Db2RlTWlycm9yXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luQ29kZU1pcnJvciA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpbkNvZGVNaXJyb3IoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBDb2xvcnBpY2tlclxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluc3RhbmNlTmFtZSA9ICdfX2NvbG9ycGlja2VyJztcclxuXHJcblx0dmFyIFBsdWdpbkNvbG9yUGlja2VyID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luQ29sb3JQaWNrZXIuZGVmYXVsdHMgPSB7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luQ29sb3JQaWNrZXIucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5Db2xvclBpY2tlci5kZWZhdWx0cywgb3B0cyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuY29sb3JwaWNrZXIoIHRoaXMub3B0aW9ucyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpbkNvbG9yUGlja2VyOiBQbHVnaW5Db2xvclBpY2tlclxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpbkNvbG9yUGlja2VyID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luQ29sb3JQaWNrZXIoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBEYXRhIFRhYmxlcyAtIENvbmZpZ1xyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8vIHdlIG92ZXJ3cml0ZSBpbml0aWFsaXplIG9mIGFsbCBkYXRhdGFibGVzIGhlcmVcclxuXHQvLyBiZWNhdXNlIHdlIHdhbnQgdG8gdXNlIHNlbGVjdDIsIGdpdmUgc2VhcmNoIGlucHV0IGEgYm9vdHN0cmFwIGxvb2tcclxuXHQvLyBrZWVwIGluIG1pbmQgaWYgeW91IG92ZXJ3cml0ZSB0aGlzIGZuSW5pdENvbXBsZXRlIHNvbWV3aGVyZSxcclxuXHQvLyB5b3Ugc2hvdWxkIHJ1biB0aGUgY29kZSBpbnNpZGUgdGhpcyBmdW5jdGlvbiB0byBrZWVwIGZ1bmN0aW9uYWxpdHkuXHJcblx0Ly9cclxuXHQvLyB0aGVyZSdzIG5vIGJldHRlciB3YXkgdG8gZG8gdGhpcyBhdCB0aGlzIHRpbWUgOihcclxuXHRpZiAoICQuaXNGdW5jdGlvbiggJC5mblsgJ2RhdGFUYWJsZScgXSApICkge1xyXG5cclxuXHRcdCQuZXh0ZW5kKHRydWUsICQuZm4uZGF0YVRhYmxlLmRlZmF1bHRzLCB7XHJcblx0XHRcdG9MYW5ndWFnZToge1xyXG5cdFx0XHRcdHNMZW5ndGhNZW51OiAnX01FTlVfIHJlY29yZHMgcGVyIHBhZ2UnLFxyXG5cdFx0XHRcdHNQcm9jZXNzaW5nOiAnPGkgY2xhc3M9XCJmYXMgZmEtc3Bpbm5lciBmYS1zcGluXCI+PC9pPiBMb2FkaW5nJyxcclxuXHRcdFx0XHRzU2VhcmNoOiAnJ1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRmbkluaXRDb21wbGV0ZTogZnVuY3Rpb24oIHNldHRpbmdzLCBqc29uICkge1xyXG5cdFx0XHRcdC8vIHNlbGVjdCAyXHJcblx0XHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oICQuZm5bICdzZWxlY3QyJyBdICkgKSB7XHJcblx0XHRcdFx0XHQkKCcuZGF0YVRhYmxlc19sZW5ndGggc2VsZWN0Jywgc2V0dGluZ3MublRhYmxlV3JhcHBlcikuc2VsZWN0Mih7XHJcblx0XHRcdFx0XHRcdHRoZW1lOiAnYm9vdHN0cmFwJyxcclxuXHRcdFx0XHRcdFx0bWluaW11bVJlc3VsdHNGb3JTZWFyY2g6IC0xXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBvcHRpb25zID0gJCggJ3RhYmxlJywgc2V0dGluZ3MublRhYmxlV3JhcHBlciApLmRhdGEoICdwbHVnaW4tb3B0aW9ucycgKSB8fCB7fTtcclxuXHJcblx0XHRcdFx0Ly8gc2VhcmNoXHJcblx0XHRcdFx0dmFyICRzZWFyY2ggPSAkKCcuZGF0YVRhYmxlc19maWx0ZXIgaW5wdXQnLCBzZXR0aW5ncy5uVGFibGVXcmFwcGVyKTtcclxuXHJcblx0XHRcdFx0JHNlYXJjaFxyXG5cdFx0XHRcdFx0LmF0dHIoe1xyXG5cdFx0XHRcdFx0XHRwbGFjZWhvbGRlcjogdHlwZW9mIG9wdGlvbnMuc2VhcmNoUGxhY2Vob2xkZXIgIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy5zZWFyY2hQbGFjZWhvbGRlciA6ICdTZWFyY2guLi4nXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdmb3JtLWNvbnRyb2wtc20nKS5hZGRDbGFzcygnZm9ybS1jb250cm9sIHB1bGwtcmlnaHQnKTtcclxuXHJcblx0XHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oICQuZm4ucGxhY2Vob2xkZXIgKSApIHtcclxuXHRcdFx0XHRcdCRzZWFyY2gucGxhY2Vob2xkZXIoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vLyBEYXRlcGlja2VyXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fZGF0ZXBpY2tlcic7XHJcblxyXG5cdHZhciBQbHVnaW5EYXRlUGlja2VyID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luRGF0ZVBpY2tlci5kZWZhdWx0cyA9IHtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5EYXRlUGlja2VyLnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0XHRpZiAoICRlbC5kYXRhKCBpbnN0YW5jZU5hbWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldFZhcnMoKVxyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldFZhcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLnNraW4gPSB0aGlzLiRlbC5kYXRhKCAncGx1Z2luLXNraW4nICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgUGx1Z2luRGF0ZVBpY2tlci5kZWZhdWx0cywgb3B0cyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuYm9vdHN0cmFwRFAoIHRoaXMub3B0aW9ucyApO1xyXG5cclxuXHRcdFx0aWYgKCAhIXRoaXMuc2tpbiAmJiB0eXBlb2YodGhpcy4kZWwuZGF0YSgnZGF0ZXBpY2tlcicpLnBpY2tlcikgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0XHR0aGlzLiRlbC5kYXRhKCdkYXRlcGlja2VyJykucGlja2VyLmFkZENsYXNzKCAnZGF0ZXBpY2tlci0nICsgdGhpcy5za2luICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5EYXRlUGlja2VyOiBQbHVnaW5EYXRlUGlja2VyXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luRGF0ZVBpY2tlciA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpbkRhdGVQaWNrZXIoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBIZWFkZXIgTWVudSBOYXZcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblxyXG5cdFx0TmF2OiB7XHJcblxyXG5cdFx0XHRkZWZhdWx0czoge1xyXG5cdFx0XHRcdHdyYXBwZXI6ICQoJyNtYWluTmF2JyksXHJcblx0XHRcdFx0c2Nyb2xsRGVsYXk6IDYwMCxcclxuXHRcdFx0XHRzY3JvbGxBbmltYXRpb246ICdlYXNlT3V0UXVhZCdcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCR3cmFwcGVyLCBvcHRzKSB7XHJcblx0XHRcdFx0aWYgKGluaXRpYWxpemVkKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGluaXRpYWxpemVkID0gdHJ1ZTtcclxuXHRcdFx0XHR0aGlzLiR3cmFwcGVyID0gKCR3cmFwcGVyIHx8IHRoaXMuZGVmYXVsdHMud3JhcHBlcik7XHJcblxyXG5cdFx0XHRcdHRoaXNcclxuXHRcdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0XHQuYnVpbGQoKVxyXG5cdFx0XHRcdFx0LmV2ZW50cygpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0XHQvLyB0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0cywgdGhlbWUuZm4uZ2V0T3B0aW9ucyh0aGlzLiR3cmFwcGVyLmRhdGEoJ3BsdWdpbi1vcHRpb25zJykpKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdFx0JGh0bWwgPSAkKCdodG1sJyksXHJcblx0XHRcdFx0XHQkaGVhZGVyID0gJCgnLmhlYWRlcicpLFxyXG5cdFx0XHRcdFx0dGh1bWJJbmZvUHJldmlldztcclxuXHJcblx0XHRcdFx0Ly8gQWRkIEFycm93c1xyXG5cdFx0XHRcdCRoZWFkZXIuZmluZCgnLmRyb3Bkb3duLXRvZ2dsZTpub3QoLm5vdGlmaWNhdGlvbi1pY29uKSwgLmRyb3Bkb3duLXN1Ym1lbnUgPiBhJykuYXBwZW5kKCQoJzxpIC8+JykuYWRkQ2xhc3MoJ2ZhcyBmYS1jYXJldC1kb3duJykpO1xyXG5cclxuXHRcdFx0XHQvLyBQcmV2aWV3IFRodW1ic1xyXG5cdFx0XHRcdHNlbGYuJHdyYXBwZXIuZmluZCgnYVtkYXRhLXRodW1iLXByZXZpZXddJykuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdHRodW1iSW5mb1ByZXZpZXcgPSAkKCc8c3BhbiAvPicpLmFkZENsYXNzKCd0aHVtYi1pbmZvIHRodW1iLWluZm8tcHJldmlldycpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQuYXBwZW5kKCQoJzxzcGFuIC8+JykuYWRkQ2xhc3MoJ3RodW1iLWluZm8td3JhcHBlcicpXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC5hcHBlbmQoJCgnPHNwYW4gLz4nKS5hZGRDbGFzcygndGh1bWItaW5mby1pbWFnZScpLmNzcygnYmFja2dyb3VuZC1pbWFnZScsICd1cmwoJyArICQodGhpcykuZGF0YSgndGh1bWItcHJldmlldycpICsgJyknKVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdCAgIClcclxuXHRcdFx0XHRcdFx0XHRcdFx0ICAgKTtcclxuXHJcblx0XHRcdFx0XHQkKHRoaXMpLmFwcGVuZCh0aHVtYkluZm9QcmV2aWV3KTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gU2lkZSBIZWFkZXIgUmlnaHQgKFJldmVyc2UgRHJvcGRvd24pXHJcblx0XHRcdFx0aWYoJGh0bWwuaGFzQ2xhc3MoJ3NpZGUtaGVhZGVyLXJpZ2h0JykpIHtcclxuXHRcdFx0XHRcdCRoZWFkZXIuZmluZCgnLmRyb3Bkb3duJykuYWRkQ2xhc3MoJ2Ryb3Bkb3duLXJldmVyc2UnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0XHQkaGVhZGVyID0gJCgnLmhlYWRlcicpLFxyXG5cdFx0XHRcdFx0JHdpbmRvdyA9ICQod2luZG93KTtcclxuXHJcblx0XHRcdFx0JGhlYWRlci5maW5kKCdhW2hyZWY9XCIjXCJdJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBNb2JpbGUgQXJyb3dzXHJcblx0XHRcdFx0JGhlYWRlci5maW5kKCcuZHJvcGRvd24tdG9nZ2xlW2hyZWY9XCIjXCJdLCAuZHJvcGRvd24tc3VibWVudSBhW2hyZWY9XCIjXCJdLCAuZHJvcGRvd24tdG9nZ2xlW2hyZWYhPVwiI1wiXSAuZmEtY2FyZXQtZG93biwgLmRyb3Bkb3duLXN1Ym1lbnUgYVtocmVmIT1cIiNcIl0gLmZhLWNhcmV0LWRvd24nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRpZiAoJHdpbmRvdy53aWR0aCgpIDwgOTkyKSB7XHJcblx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnbGknKS50b2dnbGVDbGFzcygnc2hvd2VkJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdC8vIFRvdWNoIERldmljZXMgd2l0aCBub3JtYWwgcmVzb2x1dGlvbnNcclxuXHRcdFx0XHRpZignb250b3VjaHN0YXJ0JyBpbiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0XHRcdCRoZWFkZXIuZmluZCgnLmRyb3Bkb3duLXRvZ2dsZTpub3QoW2hyZWY9XCIjXCJdKSwgLmRyb3Bkb3duLXN1Ym1lbnUgPiBhOm5vdChbaHJlZj1cIiNcIl0pJylcclxuXHRcdFx0XHRcdFx0Lm9uKCd0b3VjaHN0YXJ0IGNsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmKCR3aW5kb3cud2lkdGgoKSA+IDk5MSkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0aWYoZS5oYW5kbGVkICE9PSB0cnVlKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgbGkgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJyk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0XHRpZihsaS5oYXNDbGFzcygndGFwcGVkJykpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2NhdGlvbi5ocmVmID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGxpLmFkZENsYXNzKCd0YXBwZWQnKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdGUuaGFuZGxlZCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdC5vbignYmx1cicsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlQ2xhc3MoJ3RhcHBlZCcpO1xyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBDb2xsYXBzZSBOYXZcclxuXHRcdFx0XHQkaGVhZGVyLmZpbmQoJ1tkYXRhLWNvbGxhcHNlLW5hdl0nKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudHMoJy5jb2xsYXBzZScpLnJlbW92ZUNsYXNzKCdpbicpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvLyBBbmNob3JzIFBvc2l0aW9uXHJcblx0XHRcdFx0JCgnW2RhdGEtaGFzaF0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHRcdHZhciB0YXJnZXQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKSxcclxuXHRcdFx0XHRcdFx0b2Zmc2V0ID0gKCQodGhpcykuaXMoXCJbZGF0YS1oYXNoLW9mZnNldF1cIikgPyAkKHRoaXMpLmRhdGEoJ2hhc2gtb2Zmc2V0JykgOiAwKTtcclxuXHJcblx0XHRcdFx0XHRpZigkKHRhcmdldCkuZ2V0KDApKSB7XHJcblx0XHRcdFx0XHRcdCQodGhpcykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gQ2xvc2UgQ29sbGFwc2UgaWYgT3BlbmVkXHJcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnRzKCcuY29sbGFwc2UuaW4nKS5yZW1vdmVDbGFzcygnaW4nKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0c2VsZi5zY3JvbGxUb1RhcmdldCh0YXJnZXQsIG9mZnNldCk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHNjcm9sbFRvVGFyZ2V0OiBmdW5jdGlvbih0YXJnZXQsIG9mZnNldCkge1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdFx0JCgnYm9keScpLmFkZENsYXNzKCdzY3JvbGxpbmcnKTtcclxuXHJcblx0XHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0c2Nyb2xsVG9wOiAkKHRhcmdldCkub2Zmc2V0KCkudG9wIC0gb2Zmc2V0XHJcblx0XHRcdFx0fSwgc2VsZi5vcHRpb25zLnNjcm9sbERlbGF5LCBzZWxmLm9wdGlvbnMuc2Nyb2xsQW5pbWF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnc2Nyb2xsaW5nJyk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIGlvc1N3aXRjaGVyXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fSU9TN1N3aXRjaCc7XHJcblxyXG5cdHZhciBQbHVnaW5JT1M3U3dpdGNoID0gZnVuY3Rpb24oJGVsKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luSU9TN1N3aXRjaC5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHN3aXRjaGVyID0gbmV3IFN3aXRjaCggdGhpcy4kZWwuZ2V0KDApICk7XHJcblxyXG5cdFx0XHQkKCBzd2l0Y2hlci5lbCApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0c3dpdGNoZXIudG9nZ2xlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpbklPUzdTd2l0Y2g6IFBsdWdpbklPUzdTd2l0Y2hcclxuXHR9KTtcclxuXHJcblx0Ly8ganF1ZXJ5IHBsdWdpblxyXG5cdCQuZm4udGhlbWVQbHVnaW5JT1M3U3dpdGNoID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luSU9TN1N3aXRjaCgkdGhpcyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIEZvcm0gdG8gT2JqZWN0XHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0JC5mbi5mb3JtVG9PYmplY3QgPSBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBhcnJheURhdGEsXHJcblx0XHRcdG9iamVjdERhdGE7XHJcblxyXG5cdFx0YXJyYXlEYXRhXHQ9IHRoaXMuc2VyaWFsaXplQXJyYXkoKTtcclxuXHRcdG9iamVjdERhdGFcdD0ge307XHJcblxyXG5cdFx0JC5lYWNoKCBhcnJheURhdGEsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgdmFsdWU7XHJcblxyXG5cdFx0XHRpZiAodGhpcy52YWx1ZSAhPSBudWxsKSB7XHJcblx0XHRcdFx0dmFsdWUgPSB0aGlzLnZhbHVlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHZhbHVlID0gJyc7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmIChvYmplY3REYXRhW3RoaXMubmFtZV0gIT0gbnVsbCkge1xyXG5cdFx0XHRcdGlmICghb2JqZWN0RGF0YVt0aGlzLm5hbWVdLnB1c2gpIHtcclxuXHRcdFx0XHRcdG9iamVjdERhdGFbdGhpcy5uYW1lXSA9IFtvYmplY3REYXRhW3RoaXMubmFtZV1dO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0b2JqZWN0RGF0YVt0aGlzLm5hbWVdLnB1c2godmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9iamVjdERhdGFbdGhpcy5uYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHJcblx0XHRyZXR1cm4gb2JqZWN0RGF0YTtcclxuXHR9O1xyXG5cclxufSkoalF1ZXJ5KTtcclxuXHJcbi8vIExpZ2h0Ym94XHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fbGlnaHRib3gnO1xyXG5cclxuXHR2YXIgUGx1Z2luTGlnaHRib3ggPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5MaWdodGJveC5kZWZhdWx0cyA9IHtcclxuXHRcdHRDbG9zZTogJ0Nsb3NlIChFc2MpJywgLy8gQWx0IHRleHQgb24gY2xvc2UgYnV0dG9uXHJcblx0XHR0TG9hZGluZzogJ0xvYWRpbmcuLi4nLCAvLyBUZXh0IHRoYXQgaXMgZGlzcGxheWVkIGR1cmluZyBsb2FkaW5nLiBDYW4gY29udGFpbiAlY3VyciUgYW5kICV0b3RhbCUga2V5c1xyXG5cdFx0Z2FsbGVyeToge1xyXG5cdFx0XHR0UHJldjogJ1ByZXZpb3VzIChMZWZ0IGFycm93IGtleSknLCAvLyBBbHQgdGV4dCBvbiBsZWZ0IGFycm93XHJcblx0XHRcdHROZXh0OiAnTmV4dCAoUmlnaHQgYXJyb3cga2V5KScsIC8vIEFsdCB0ZXh0IG9uIHJpZ2h0IGFycm93XHJcblx0XHRcdHRDb3VudGVyOiAnJWN1cnIlIG9mICV0b3RhbCUnIC8vIE1hcmt1cCBmb3IgXCIxIG9mIDdcIiBjb3VudGVyXHJcblx0XHR9LFxyXG5cdFx0aW1hZ2U6IHtcclxuXHRcdFx0dEVycm9yOiAnPGEgaHJlZj1cIiV1cmwlXCI+VGhlIGltYWdlPC9hPiBjb3VsZCBub3QgYmUgbG9hZGVkLicgLy8gRXJyb3IgbWVzc2FnZSB3aGVuIGltYWdlIGNvdWxkIG5vdCBiZSBsb2FkZWRcclxuXHRcdH0sXHJcblx0XHRhamF4OiB7XHJcblx0XHRcdHRFcnJvcjogJzxhIGhyZWY9XCIldXJsJVwiPlRoZSBjb250ZW50PC9hPiBjb3VsZCBub3QgYmUgbG9hZGVkLicgLy8gRXJyb3IgbWVzc2FnZSB3aGVuIGFqYXggcmVxdWVzdCBmYWlsZWRcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRQbHVnaW5MaWdodGJveC5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgUGx1Z2luTGlnaHRib3guZGVmYXVsdHMsIG9wdHMsIHtcclxuXHRcdFx0XHR3cmFwcGVyOiB0aGlzLiRlbFxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucy53cmFwcGVyLm1hZ25pZmljUG9wdXAodGhpcy5vcHRpb25zKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5MaWdodGJveDogUGx1Z2luTGlnaHRib3hcclxuXHR9KTtcclxuXHJcblx0Ly8ganF1ZXJ5IHBsdWdpblxyXG5cdCQuZm4udGhlbWVQbHVnaW5MaWdodGJveCA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpbkxpZ2h0Ym94KCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pO1xyXG5cclxuLy8gTG9hZGluZyBPdmVybGF5XHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBsb2FkaW5nT3ZlcmxheVRlbXBsYXRlID0gW1xyXG5cdFx0JzxkaXYgY2xhc3M9XCJsb2FkaW5nLW92ZXJsYXlcIj4nLFxyXG5cdFx0XHQnPGRpdiBjbGFzcz1cImJvdW5jZS1sb2FkZXJcIj48ZGl2IGNsYXNzPVwiYm91bmNlMVwiPjwvZGl2PjxkaXYgY2xhc3M9XCJib3VuY2UyXCI+PC9kaXY+PGRpdiBjbGFzcz1cImJvdW5jZTNcIj48L2Rpdj48L2Rpdj4nLFxyXG5cdFx0JzwvZGl2PidcclxuXHRdLmpvaW4oJycpO1xyXG5cclxuXHR2YXIgTG9hZGluZ092ZXJsYXkgPSBmdW5jdGlvbiggJHdyYXBwZXIsIG9wdGlvbnMgKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCAkd3JhcHBlciwgb3B0aW9ucyApO1xyXG5cdH07XHJcblxyXG5cdExvYWRpbmdPdmVybGF5LnByb3RvdHlwZSA9IHtcclxuXHJcblx0XHRvcHRpb25zOiB7XHJcblx0XHRcdGNzczoge31cclxuXHRcdH0sXHJcblxyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oICR3cmFwcGVyLCBvcHRpb25zICkge1xyXG5cdFx0XHR0aGlzLiR3cmFwcGVyID0gJHdyYXBwZXI7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldFZhcnMoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKCBvcHRpb25zIClcclxuXHRcdFx0XHQuYnVpbGQoKVxyXG5cdFx0XHRcdC5ldmVudHMoKTtcclxuXHJcblx0XHRcdHRoaXMuJHdyYXBwZXIuZGF0YSggJ2xvYWRpbmdPdmVybGF5JywgdGhpcyApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRWYXJzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kb3ZlcmxheSA9IHRoaXMuJHdyYXBwZXIuZmluZCgnLmxvYWRpbmctb3ZlcmxheScpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKCBvcHRpb25zICkge1xyXG5cdFx0XHRpZiAoICF0aGlzLiRvdmVybGF5LmdldCgwKSApIHtcclxuXHRcdFx0XHR0aGlzLm1hdGNoUHJvcGVydGllcygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMub3B0aW9ucyAgICAgPSAkLmV4dGVuZCggdHJ1ZSwge30sIHRoaXMub3B0aW9ucywgb3B0aW9ucyApO1xyXG5cdFx0XHR0aGlzLmxvYWRlckNsYXNzID0gdGhpcy5nZXRMb2FkZXJDbGFzcyggdGhpcy5vcHRpb25zLmNzcy5iYWNrZ3JvdW5kQ29sb3IgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICggIXRoaXMuJG92ZXJsYXkuY2xvc2VzdChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldCgwKSApIHtcclxuXHRcdFx0XHRpZiAoICF0aGlzLiRjYWNoZWRPdmVybGF5ICkge1xyXG5cdFx0XHRcdFx0dGhpcy4kb3ZlcmxheSA9ICQoIGxvYWRpbmdPdmVybGF5VGVtcGxhdGUgKS5jbG9uZSgpO1xyXG5cclxuXHRcdFx0XHRcdGlmICggdGhpcy5vcHRpb25zLmNzcyApIHtcclxuXHRcdFx0XHRcdFx0dGhpcy4kb3ZlcmxheS5jc3MoIHRoaXMub3B0aW9ucy5jc3MgKTtcclxuXHRcdFx0XHRcdFx0dGhpcy4kb3ZlcmxheS5maW5kKCAnLmxvYWRlcicgKS5hZGRDbGFzcyggdGhpcy5sb2FkZXJDbGFzcyApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLiRvdmVybGF5ID0gdGhpcy4kY2FjaGVkT3ZlcmxheS5jbG9uZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy4kd3JhcHBlci5hcHBlbmQoIHRoaXMuJG92ZXJsYXkgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCAhdGhpcy4kY2FjaGVkT3ZlcmxheSApIHtcclxuXHRcdFx0XHR0aGlzLiRjYWNoZWRPdmVybGF5ID0gdGhpcy4kb3ZlcmxheS5jbG9uZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmICggdGhpcy5vcHRpb25zLnN0YXJ0U2hvd2luZyApIHtcclxuXHRcdFx0XHRfc2VsZi5zaG93KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdGhpcy4kd3JhcHBlci5pcygnYm9keScpIHx8IHRoaXMub3B0aW9ucy5oaWRlT25XaW5kb3dMb2FkICkge1xyXG5cdFx0XHRcdCQoIHdpbmRvdyApLm9uKCAnbG9hZCBlcnJvcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0X3NlbGYuaGlkZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMub3B0aW9ucy5saXN0ZW5PbiApIHtcclxuXHRcdFx0XHQkKCB0aGlzLm9wdGlvbnMubGlzdGVuT24gKVxyXG5cdFx0XHRcdFx0Lm9uKCAnbG9hZGluZy1vdmVybGF5OnNob3cgYmVmb3JlU2VuZC5pYycsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0XHRfc2VsZi5zaG93KCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0Lm9uKCAnbG9hZGluZy1vdmVybGF5OmhpZGUgY29tcGxldGUuaWMnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdFx0X3NlbGYuaGlkZSgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJHdyYXBwZXJcclxuXHRcdFx0XHQub24oICdsb2FkaW5nLW92ZXJsYXk6c2hvdyBiZWZvcmVTZW5kLmljJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0XHRpZiAoIGUudGFyZ2V0ID09PSBfc2VsZi4kd3JhcHBlci5nZXQoMCkgKSB7XHJcblx0XHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHRcdF9zZWxmLnNob3coKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQub24oICdsb2FkaW5nLW92ZXJsYXk6aGlkZSBjb21wbGV0ZS5pYycsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdFx0aWYgKCBlLnRhcmdldCA9PT0gX3NlbGYuJHdyYXBwZXIuZ2V0KDApICkge1xyXG5cdFx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0XHRfc2VsZi5oaWRlKCk7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNob3c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmJ1aWxkKCk7XHJcblxyXG5cdFx0XHR0aGlzLnBvc2l0aW9uID0gdGhpcy4kd3JhcHBlci5jc3MoICdwb3NpdGlvbicgKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRpZiAoIHRoaXMucG9zaXRpb24gIT0gJ3JlbGF0aXZlJyB8fCB0aGlzLnBvc2l0aW9uICE9ICdhYnNvbHV0ZScgfHwgdGhpcy5wb3NpdGlvbiAhPSAnZml4ZWQnICkge1xyXG5cdFx0XHRcdHRoaXMuJHdyYXBwZXIuY3NzKHtcclxuXHRcdFx0XHRcdHBvc2l0aW9uOiAncmVsYXRpdmUnXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy4kd3JhcHBlci5hZGRDbGFzcyggJ2xvYWRpbmctb3ZlcmxheS1zaG93aW5nJyApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRoaWRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHRoaXMuJHdyYXBwZXIucmVtb3ZlQ2xhc3MoICdsb2FkaW5nLW92ZXJsYXktc2hvd2luZycgKTtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoIHRoaXMucG9zaXRpb24gIT0gJ3JlbGF0aXZlJyB8fCB0aGlzLnBvc2l0aW9uICE9ICdhYnNvbHV0ZScgfHwgdGhpcy5wb3NpdGlvbiAhPSAnZml4ZWQnICkge1xyXG5cdFx0XHRcdFx0X3NlbGYuJHdyYXBwZXIuY3NzKHsgcG9zaXRpb246ICcnIH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSwgNTAwKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0bWF0Y2hQcm9wZXJ0aWVzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGksXHJcblx0XHRcdFx0bCxcclxuXHRcdFx0XHRwcm9wZXJ0aWVzO1xyXG5cclxuXHRcdFx0cHJvcGVydGllcyA9IFtcclxuXHRcdFx0XHQnYmFja2dyb3VuZENvbG9yJyxcclxuXHRcdFx0XHQnYm9yZGVyUmFkaXVzJ1xyXG5cdFx0XHRdO1xyXG5cclxuXHRcdFx0bCA9IHByb3BlcnRpZXMubGVuZ3RoO1xyXG5cclxuXHRcdFx0Zm9yKCBpID0gMDsgaSA8IGw7IGkrKyApIHtcclxuXHRcdFx0XHR2YXIgb2JqID0ge307XHJcblx0XHRcdFx0b2JqWyBwcm9wZXJ0aWVzWyBpIF0gXSA9IHRoaXMuJHdyYXBwZXIuY3NzKCBwcm9wZXJ0aWVzWyBpIF0gKTtcclxuXHJcblx0XHRcdFx0JC5leHRlbmQoIHRoaXMub3B0aW9ucy5jc3MsIG9iaiApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldExvYWRlckNsYXNzOiBmdW5jdGlvbiggYmFja2dyb3VuZENvbG9yICkge1xyXG5cdFx0XHRpZiAoICFiYWNrZ3JvdW5kQ29sb3IgfHwgYmFja2dyb3VuZENvbG9yID09PSAndHJhbnNwYXJlbnQnIHx8IGJhY2tncm91bmRDb2xvciA9PT0gJ2luaGVyaXQnICkge1xyXG5cdFx0XHRcdHJldHVybiAnYmxhY2snO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgaGV4Q29sb3IsXHJcblx0XHRcdFx0cixcclxuXHRcdFx0XHRnLFxyXG5cdFx0XHRcdGIsXHJcblx0XHRcdFx0eWlxO1xyXG5cclxuXHRcdFx0dmFyIGNvbG9yVG9IZXggPSBmdW5jdGlvbiggY29sb3IgKXtcclxuXHRcdFx0XHR2YXIgaGV4LFxyXG5cdFx0XHRcdFx0cmdiO1xyXG5cclxuXHRcdFx0XHRpZiggY29sb3IuaW5kZXhPZignIycpID4tIDEgKXtcclxuXHRcdFx0XHRcdGhleCA9IGNvbG9yLnJlcGxhY2UoJyMnLCAnJyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJnYiA9IGNvbG9yLm1hdGNoKC9cXGQrL2cpO1xyXG5cdFx0XHRcdFx0aGV4ID0gKCcwJyArIHBhcnNlSW50KHJnYlswXSwgMTApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpICsgKCcwJyArIHBhcnNlSW50KHJnYlsxXSwgMTApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpICsgKCcwJyArIHBhcnNlSW50KHJnYlsyXSwgMTApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCBoZXgubGVuZ3RoID09PSAzICkge1xyXG5cdFx0XHRcdFx0aGV4ID0gaGV4ICsgaGV4O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGhleDtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGhleENvbG9yID0gY29sb3JUb0hleCggYmFja2dyb3VuZENvbG9yICk7XHJcblxyXG5cdFx0XHRyID0gcGFyc2VJbnQoIGhleENvbG9yLnN1YnN0ciggMCwgMiksIDE2ICk7XHJcblx0XHRcdGcgPSBwYXJzZUludCggaGV4Q29sb3Iuc3Vic3RyKCAyLCAyKSwgMTYgKTtcclxuXHRcdFx0YiA9IHBhcnNlSW50KCBoZXhDb2xvci5zdWJzdHIoIDQsIDIpLCAxNiApO1xyXG5cdFx0XHR5aXEgPSAoKHIgKiAyOTkpICsgKGcgKiA1ODcpICsgKGIgKiAxMTQpKSAvIDEwMDA7XHJcblxyXG5cdFx0XHRyZXR1cm4gKCB5aXEgPj0gMTI4ICkgPyAnYmxhY2snIDogJ3doaXRlJztcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdExvYWRpbmdPdmVybGF5OiBMb2FkaW5nT3ZlcmxheVxyXG5cdH0pO1xyXG5cclxuXHQvLyBleHBvc2UgYXMgYSBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi5sb2FkaW5nT3ZlcmxheSA9IGZ1bmN0aW9uKCBvcHRzICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApO1xyXG5cclxuXHRcdFx0dmFyIGxvYWRpbmdPdmVybGF5ID0gJHRoaXMuZGF0YSggJ2xvYWRpbmdPdmVybGF5JyApO1xyXG5cdFx0XHRpZiAoIGxvYWRpbmdPdmVybGF5ICkge1xyXG5cdFx0XHRcdHJldHVybiBsb2FkaW5nT3ZlcmxheTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucyA9IG9wdHMgfHwgJHRoaXMuZGF0YSggJ2xvYWRpbmctb3ZlcmxheS1vcHRpb25zJyApIHx8IHt9O1xyXG5cdFx0XHRcdHJldHVybiBuZXcgTG9hZGluZ092ZXJsYXkoICR0aGlzLCBvcHRpb25zICk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gYXV0byBpbml0XHJcblx0JCgnW2RhdGEtbG9hZGluZy1vdmVybGF5XScpLmxvYWRpbmdPdmVybGF5KCk7XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIExvY2sgU2NyZWVuXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIExvY2tTY3JlZW4gPSB7XHJcblxyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGJvZHkgPSAkKCAnYm9keScgKTtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuYnVpbGQoKVxyXG5cdFx0XHRcdC5ldmVudHMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgbG9ja0hUTUwsXHJcblx0XHRcdFx0dXNlcmluZm87XHJcblxyXG5cdFx0XHR1c2VyaW5mbyA9IHRoaXMuZ2V0VXNlckluZm8oKTtcclxuXHRcdFx0dGhpcy5sb2NrSFRNTCA9IHRoaXMuYnVpbGRUZW1wbGF0ZSggdXNlcmluZm8gKTtcclxuXHJcblx0XHRcdHRoaXMuJGxvY2sgICAgICAgID0gdGhpcy4kYm9keS5jaGlsZHJlbiggJyNMb2NrU2NyZWVuSW5saW5lJyApO1xyXG5cdFx0XHR0aGlzLiR1c2VyUGljdHVyZSA9IHRoaXMuJGxvY2suZmluZCggJyNMb2NrVXNlclBpY3R1cmUnICk7XHJcblx0XHRcdHRoaXMuJHVzZXJOYW1lICAgID0gdGhpcy4kbG9jay5maW5kKCAnI0xvY2tVc2VyTmFtZScgKTtcclxuXHRcdFx0dGhpcy4kdXNlckVtYWlsICAgPSB0aGlzLiRsb2NrLmZpbmQoICcjTG9ja1VzZXJFbWFpbCcgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRldmVudHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy4kYm9keS5maW5kKCAnW2RhdGEtbG9jay1zY3JlZW49XCJ0cnVlXCJdJyApLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9zZWxmLnNob3coKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0Zm9ybUV2ZW50czogZnVuY3Rpb24oICRmb3JtICkge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0JGZvcm0ub24oICdzdWJtaXQnLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdF9zZWxmLmhpZGUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNob3c6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdHVzZXJpbmZvID0gdGhpcy5nZXRVc2VySW5mbygpO1xyXG5cclxuXHRcdFx0dGhpcy4kdXNlclBpY3R1cmUuYXR0ciggJ3NyYycsIHVzZXJpbmZvLnBpY3R1cmUgKTtcclxuXHRcdFx0dGhpcy4kdXNlck5hbWUudGV4dCggdXNlcmluZm8udXNlcm5hbWUgKTtcclxuXHRcdFx0dGhpcy4kdXNlckVtYWlsLnRleHQoIHVzZXJpbmZvLmVtYWlsICk7XHJcblxyXG5cdFx0XHR0aGlzLiRib2R5LmFkZENsYXNzKCAnc2hvdy1sb2NrLXNjcmVlbicgKTtcclxuXHJcblx0XHRcdCQubWFnbmlmaWNQb3B1cC5vcGVuKHtcclxuXHRcdFx0XHRpdGVtczoge1xyXG5cdFx0XHRcdFx0c3JjOiB0aGlzLmxvY2tIVE1MLFxyXG5cdFx0XHRcdFx0dHlwZTogJ2lubGluZSdcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdG1vZGFsOiB0cnVlLFxyXG5cdFx0XHRcdG1haW5DbGFzczogJ21mcC1sb2NrLXNjcmVlbicsXHJcblx0XHRcdFx0Y2FsbGJhY2tzOiB7XHJcblx0XHRcdFx0XHRjaGFuZ2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRfc2VsZi5mb3JtRXZlbnRzKCB0aGlzLmNvbnRlbnQuZmluZCggJ2Zvcm0nICkgKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRoaWRlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0JC5tYWduaWZpY1BvcHVwLmNsb3NlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldFVzZXJJbmZvOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICRpbmZvLFxyXG5cdFx0XHRcdHBpY3R1cmUsXHJcblx0XHRcdFx0bmFtZSxcclxuXHRcdFx0XHRlbWFpbDtcclxuXHJcblx0XHRcdC8vIGFsd2F5cyBzZWFyY2ggaW4gY2FzZSBzb21ldGhpbmcgaXMgY2hhbmdlZCB0aHJvdWdoIGFqYXhcclxuXHRcdFx0JGluZm8gICAgPSAkKCAnI3VzZXJib3gnICk7XHJcblx0XHRcdHBpY3R1cmUgID0gJGluZm8uZmluZCggJy5wcm9maWxlLXBpY3R1cmUgaW1nJyApLmF0dHIoICdkYXRhLWxvY2stcGljdHVyZScgKTtcclxuXHRcdFx0bmFtZSAgICAgPSAkaW5mby5maW5kKCAnLnByb2ZpbGUtaW5mbycgKS5hdHRyKCAnZGF0YS1sb2NrLW5hbWUnICk7XHJcblx0XHRcdGVtYWlsICAgID0gJGluZm8uZmluZCggJy5wcm9maWxlLWluZm8nICkuYXR0ciggJ2RhdGEtbG9jay1lbWFpbCcgKTtcclxuXHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0cGljdHVyZTogcGljdHVyZSxcclxuXHRcdFx0XHR1c2VybmFtZTogbmFtZSxcclxuXHRcdFx0XHRlbWFpbDogZW1haWxcclxuXHRcdFx0fTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGRUZW1wbGF0ZTogZnVuY3Rpb24oIHVzZXJpbmZvICkge1xyXG5cdFx0XHRyZXR1cm4gW1xyXG5cdFx0XHRcdFx0JzxzZWN0aW9uIGlkPVwiTG9ja1NjcmVlbklubGluZVwiIGNsYXNzPVwiYm9keS1zaWduIGJvZHktbG9ja2VkIGJvZHktbG9ja2VkLWlubGluZVwiPicsXHJcblx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiY2VudGVyLXNpZ25cIj4nLFxyXG5cdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwicGFuZWwgY2FyZC1zaWduXCI+JyxcclxuXHRcdFx0XHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwiY2FyZC1ib2R5XCI+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0Jzxmb3JtPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJjdXJyZW50LXVzZXIgdGV4dC1jZW50ZXJcIj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxpbWcgaWQ9XCJMb2NrVXNlclBpY3R1cmVcIiBzcmM9XCJ7e3BpY3R1cmV9fVwiIGFsdD1cIkpvaG4gRG9lXCIgY2xhc3M9XCJyb3VuZGVkLWNpcmNsZSB1c2VyLWltYWdlXCIgLz4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxoMiBpZD1cIkxvY2tVc2VyTmFtZVwiIGNsYXNzPVwidXNlci1uYW1lIHRleHQtZGFyayBtLTBcIj57e3VzZXJuYW1lfX08L2gyPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPHAgIGlkPVwiTG9ja1VzZXJFbWFpbFwiIGNsYXNzPVwidXNlci1lbWFpbCBtLTBcIj57e2VtYWlsfX08L3A+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQnPC9kaXY+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgbWItbGdcIj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8aW5wdXQgaWQ9XCJwd2RcIiBuYW1lPVwicHdkXCIgdHlwZT1cInBhc3N3b3JkXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLWxnXCIgcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIC8+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYXBwZW5kXCI+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImZhcyBmYS1sb2NrXCI+PC9pPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPC9zcGFuPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPC9kaXY+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHQnPC9kaXY+JyxcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJyb3dcIj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxkaXYgY2xhc3M9XCJjb2wtNlwiPicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8cCBjbGFzcz1cIm10LXhzIG1iLTBcIj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdCc8YSBocmVmPVwiI1wiPk5vdCBKb2huIERvZT88L2E+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvcD4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQnPGRpdiBjbGFzcz1cImNvbC02XCI+JyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHB1bGwtcmlnaHRcIj5VbmxvY2s8L2J1dHRvbj4nLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0JzwvZGl2PicsXHJcblx0XHRcdFx0XHRcdFx0XHRcdCc8L2Zvcm0+JyxcclxuXHRcdFx0XHRcdFx0XHRcdCc8L2Rpdj4nLFxyXG5cdFx0XHRcdFx0XHRcdCc8L2Rpdj4nLFxyXG5cdFx0XHRcdFx0XHQnPC9kaXY+JyxcclxuXHRcdFx0XHRcdCc8L3NlY3Rpb24+J1xyXG5cdFx0XHRcdF1cclxuXHRcdFx0XHQuam9pbiggJycgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvXFx7XFx7cGljdHVyZVxcfVxcfS8sIHVzZXJpbmZvLnBpY3R1cmUgKVxyXG5cdFx0XHRcdC5yZXBsYWNlKCAvXFx7XFx7dXNlcm5hbWVcXH1cXH0vLCB1c2VyaW5mby51c2VybmFtZSApXHJcblx0XHRcdFx0LnJlcGxhY2UoIC9cXHtcXHtlbWFpbFxcfVxcfS8sIHVzZXJpbmZvLmVtYWlsICk7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdHRoaXMuTG9ja1NjcmVlbiA9IExvY2tTY3JlZW47XHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRMb2NrU2NyZWVuLmluaXRpYWxpemUoKTtcclxuXHR9KTtcclxuXHJcbn0pLmFwcGx5KHRoaXMsIFtqUXVlcnldKTtcclxuXHJcbi8vIE1hcCBCdWlsZGVyXHJcbihmdW5jdGlvbiggdGhlbWUsICQgKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gcHJldmVudCB1bmRlZmluZWQgdmFyXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0Ly8gaW50ZXJuYWwgdmFyIHRvIGNoZWNrIGlmIHJlYWNoZWQgbGltaXRcclxuXHR2YXIgdGltZW91dHMgPSAwO1xyXG5cclxuXHQvLyBpbnN0YW5jZVxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19nbWFwYnVpbGRlcic7XHJcblxyXG5cdC8vIHByaXZhdGVcclxuXHR2YXIgcm91bmROdW1iZXIgPSBmdW5jdGlvbiggbnVtYmVyLCBwcmVjaXNpb24gKSB7XHJcblx0XHRpZiggcHJlY2lzaW9uIDwgMCApIHtcclxuXHRcdFx0cHJlY2lzaW9uID0gMDtcclxuXHRcdH0gZWxzZSBpZiggcHJlY2lzaW9uID4gMTAgKSB7XHJcblx0XHRcdHByZWNpc2lvbiA9IDEwO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGEgPSBbIDEsIDEwLCAxMDAsIDEwMDAsIDEwMDAwLCAxMDAwMDAsIDEwMDAwMDAsIDEwMDAwMDAwLCAxMDAwMDAwMDAsIDEwMDAwMDAwMDAsIDEwMDAwMDAwMDAwIF07XHJcblxyXG5cdFx0cmV0dXJuIE1hdGgucm91bmQoIG51bWJlciAqIGFbIHByZWNpc2lvbiBdICkgLyBhWyBwcmVjaXNpb24gXTtcclxuXHR9O1xyXG5cclxuXHQvLyBkZWZpbml0aW9uXHJcblx0dmFyIEdNYXBCdWlsZGVyID0gZnVuY3Rpb24oICR3cmFwcGVyLCBvcHRzICkge1xyXG5cdFx0cmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSggJHdyYXBwZXIsIG9wdHMgKTtcclxuXHR9O1xyXG5cclxuXHRHTWFwQnVpbGRlci5kZWZhdWx0cyA9IHtcclxuXHRcdG1hcFNlbGVjdG9yOiAnI2dtYXAnLFxyXG5cclxuXHRcdG1hcmtlcnM6IHtcclxuXHRcdFx0bW9kYWw6ICcjTWFya2VyTW9kYWwnLFxyXG5cdFx0XHRsaXN0OiAnI01hcmtlcnNMaXN0JyxcclxuXHRcdFx0cmVtb3ZlQWxsOiAnI01hcmtlclJlbW92ZUFsbCdcclxuXHRcdH0sXHJcblxyXG5cdFx0cHJldmlld01vZGFsOiAnI01vZGFsUHJldmlldycsXHJcblx0XHRnZXRDb2RlTW9kYWw6ICcjTW9kYWxHZXRDb2RlJyxcclxuXHJcblx0XHRtYXBPcHRpb25zOiB7XHJcblx0XHRcdGNlbnRlcjoge1xyXG5cdFx0XHRcdGxhdDogLTM4LjkwODEzMyxcclxuXHRcdFx0XHRsbmc6IC0xMy42OTI2MjhcclxuXHRcdFx0fSxcclxuXHRcdFx0cGFuQ29udHJvbDogdHJ1ZSxcclxuXHRcdFx0em9vbTogM1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdEdNYXBCdWlsZGVyLnByb3RvdHlwZSA9IHtcclxuXHJcblx0XHRtYXJrZXJzOiBbXSxcclxuXHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbiggJHdyYXBwZXIsIG9wdHMgKSB7XHJcblx0XHRcdHRoaXMuJHdyYXBwZXIgPSAkd3JhcHBlcjtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMoIG9wdHMgKVxyXG5cdFx0XHRcdC5zZXRWYXJzKClcclxuXHRcdFx0XHQuYnVpbGQoKVxyXG5cdFx0XHRcdC5ldmVudHMoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kd3JhcHBlci5kYXRhKCBpbnN0YW5jZU5hbWUsIHRoaXMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbiggb3B0cyApIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBHTWFwQnVpbGRlci5kZWZhdWx0cywgb3B0cyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldFZhcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRtYXBDb250YWluZXJcdFx0PSB0aGlzLiR3cmFwcGVyLmZpbmQoIHRoaXMub3B0aW9ucy5tYXBTZWxlY3RvciApO1xyXG5cclxuXHRcdFx0dGhpcy4kcHJldmlld01vZGFsXHRcdD0gJCggdGhpcy5vcHRpb25zLnByZXZpZXdNb2RhbCApO1xyXG5cdFx0XHR0aGlzLiRnZXRDb2RlTW9kYWxcdFx0PSAkKCB0aGlzLm9wdGlvbnMuZ2V0Q29kZU1vZGFsICk7XHJcblxyXG5cdFx0XHR0aGlzLm1hcmtlclx0XHRcdFx0PSB7fTtcclxuXHRcdFx0dGhpcy5tYXJrZXIuJG1vZGFsICBcdD0gJCggdGhpcy5vcHRpb25zLm1hcmtlcnMubW9kYWwgKTtcclxuXHRcdFx0dGhpcy5tYXJrZXIuJGZvcm1cdFx0PSB0aGlzLm1hcmtlci4kbW9kYWwuZmluZCggJ2Zvcm0nICk7XHJcblx0XHRcdHRoaXMubWFya2VyLiRsaXN0XHRcdD0gJCggdGhpcy5vcHRpb25zLm1hcmtlcnMubGlzdCApO1xyXG5cdFx0XHR0aGlzLm1hcmtlci4kcmVtb3ZlQWxsXHQ9ICQoIHRoaXMub3B0aW9ucy5tYXJrZXJzLnJlbW92ZUFsbCApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmICggISF3aW5kb3cuU25henp5VGhlbWVzICkge1xyXG5cdFx0XHRcdHZhciB0aGVtZU9wdHMgPSBbXTtcclxuXHJcblx0XHRcdFx0JC5lYWNoKCB3aW5kb3cuU25henp5VGhlbWVzLCBmdW5jdGlvbiggaSwgdGhlbWUgKSB7XHJcblx0XHRcdFx0XHR0aGVtZU9wdHMucHVzaCggJCgnPG9wdGlvbiB2YWx1ZT1cIicgKyB0aGVtZS5pZCArICdcIj4nICsgdGhlbWUubmFtZSArICc8L29wdGlvbj4nKS5kYXRhKCAnanNvbicsIHRoZW1lLmpzb24gKSApO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHR0aGlzLiR3cmFwcGVyLmZpbmQoICdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwdGhlbWVcIl0nICkuYXBwZW5kKCB0aGVtZU9wdHMgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZW9jb2RlciA9IG5ldyBnb29nbGUubWFwcy5HZW9jb2RlcigpO1xyXG5cclxuXHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIoIHdpbmRvdywgJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRfc2VsZi5vcHRpb25zLm1hcE9wdGlvbnMuY2VudGVyID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggX3NlbGYub3B0aW9ucy5tYXBPcHRpb25zLmNlbnRlci5sYXQsIF9zZWxmLm9wdGlvbnMubWFwT3B0aW9ucy5jZW50ZXIubG5nICk7XHJcblxyXG5cdFx0XHRcdF9zZWxmLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoIF9zZWxmLiRtYXBDb250YWluZXIuZ2V0KDApLCBfc2VsZi5vcHRpb25zLm1hcE9wdGlvbnMgKTtcclxuXHJcblx0XHRcdFx0X3NlbGZcclxuXHRcdFx0XHRcdC51cGRhdGVDb250cm9sKCAnbGF0bG5nJyApXHJcblx0XHRcdFx0XHQudXBkYXRlQ29udHJvbCggJ3pvb21sZXZlbCcgKTtcclxuXHJcblx0XHRcdFx0X3NlbGYubWFwRXZlbnRzKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGV2ZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBfc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHR0aGlzLiR3cmFwcGVyLmZpbmQoICdbZGF0YS1idWlsZGVyLWZpZWxkXScgKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkdGhpcyA9ICQoIHRoaXMgKSxcclxuXHRcdFx0XHRcdGZpZWxkLFxyXG5cdFx0XHRcdFx0dmFsdWU7XHJcblxyXG5cdFx0XHRcdGZpZWxkID0gJHRoaXMuZGF0YSggJ2J1aWxkZXItZmllbGQnICk7XHJcblxyXG5cdFx0XHRcdCR0aGlzLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCAkdGhpcy5pcyggJ3NlbGVjdCcgKSApIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSAkdGhpcy5jaGlsZHJlbiggJ29wdGlvbjpzZWxlY3RlZCcgKS52YWwoKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSAkdGhpcy52YWwoKS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdF9zZWxmLnVwZGF0ZU1hcCggZmllbGQsIHZhbHVlICk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMubWFya2VyLiRmb3JtLm9uKCAnc3VibWl0JywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRfc2VsZi5zYXZlTWFya2VyKCBfc2VsZi5tYXJrZXIuJGZvcm0uZm9ybVRvT2JqZWN0KCkgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHR0aGlzLm1hcmtlci4kcmVtb3ZlQWxsLm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0X3NlbGYucmVtb3ZlQWxsTWFya2VycygpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIHByZXZpZXcgZXZlbnRzXHJcblx0XHRcdHRoaXMuJHByZXZpZXdNb2RhbC5vbiggJ3Nob3duLmJzLm1vZGFsJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0X3NlbGYucHJldmlldygpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuJHByZXZpZXdNb2RhbC5vbiggJ2hpZGRlbi5icy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9zZWxmLiRwcmV2aWV3TW9kYWwuZmluZCggJ2lmcmFtZScgKS5nZXQoMCkuY29udGVudFdpbmRvdy5kb2N1bWVudC5ib2R5LmlubmVySFRNTCA9ICcnO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIGdldCBjb2RlIGV2ZW50c1xyXG5cdFx0XHR0aGlzLiRnZXRDb2RlTW9kYWwub24oICdzaG93bi5icy5tb2RhbCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9zZWxmLmdldENvZGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gTUFQIEZVTkNUSU9OU1xyXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdG1hcEV2ZW50czogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBfc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lciggX3NlbGYubWFwLCAncmVzaXplJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQudHJpZ2dlciggX3NlbGYubWFwLCAncmVzaXplJyApO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCB0aGlzLm1hcCwgJ2NlbnRlcl9jaGFuZ2VkJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGNvb3JkcyA9IF9zZWxmLm1hcC5nZXRDZW50ZXIoKTtcclxuXHRcdFx0XHRfc2VsZi51cGRhdGVDb250cm9sKCAnbGF0bG5nJywge1xyXG5cdFx0XHRcdFx0bGF0OiByb3VuZE51bWJlciggY29vcmRzLmxhdCgpLCA2ICksXHJcblx0XHRcdFx0XHRsbmc6IHJvdW5kTnVtYmVyKCBjb29yZHMubG5nKCksIDYgKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCB0aGlzLm1hcCwgJ3pvb21fY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9zZWxmLnVwZGF0ZUNvbnRyb2woICd6b29tbGV2ZWwnLCBfc2VsZi5tYXAuZ2V0Wm9vbSgpICk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoIHRoaXMubWFwLCAnbWFwdHlwZWlkX2NoYW5nZWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRfc2VsZi51cGRhdGVDb250cm9sKCAnbWFwdHlwZScsIF9zZWxmLm1hcC5nZXRNYXBUeXBlSWQoKSApO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVNYXA6IGZ1bmN0aW9uKCBwcm9wLCB2YWx1ZSApIHtcclxuXHRcdFx0dmFyIHVwZGF0ZUZuO1xyXG5cclxuXHRcdFx0dXBkYXRlRm4gPSB0aGlzLnVwZGF0ZU1hcFByb3BlcnR5WyBwcm9wIF07XHJcblxyXG5cdFx0XHRpZiAoICQuaXNGdW5jdGlvbiggdXBkYXRlRm4gKSApIHtcclxuXHRcdFx0XHR1cGRhdGVGbi5hcHBseSggdGhpcywgWyB2YWx1ZSBdICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5pbmZvKCAnbWlzc2luZyB1cGRhdGUgZnVuY3Rpb24gZm9yJywgcHJvcCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0dXBkYXRlTWFwUHJvcGVydHk6IHtcclxuXHJcblx0XHRcdGxhdGxuZzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGxhdCxcclxuXHRcdFx0XHRcdGxuZztcclxuXHJcblx0XHRcdFx0bGF0ID0gdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkXVtuYW1lPVwibGF0aXR1ZGVcIl0nKS52YWwoKTtcclxuXHRcdFx0XHRsbmcgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGRdW25hbWU9XCJsb25naXR1ZGVcIl0nKS52YWwoKTtcclxuXHJcblx0XHRcdFx0aWYgKCBsYXQubGVuZ3RoID4gMCAmJiBsbmcubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0XHRcdHRoaXMubWFwLnNldENlbnRlciggbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggbGF0LCBsbmcgKSApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHR6b29tbGV2ZWw6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBhcmd1bWVudHNbIDAgXTtcclxuXHJcblx0XHRcdFx0dGhpcy5tYXAuc2V0Wm9vbSggcGFyc2VJbnQoIHZhbHVlLCAxMCApICk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0bWFwdHlwZWNvbnRyb2w6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucztcclxuXHJcblx0XHRcdFx0b3B0aW9uc1x0PSB7fTtcclxuXHJcblx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gJ2ZhbHNlJyApe1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5tYXBUeXBlQ29udHJvbCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvcHRpb25zID0ge1xyXG5cdFx0XHRcdFx0XHRtYXBUeXBlQ29udHJvbDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0bWFwVHlwZUNvbnRyb2xPcHRpb25zOiB7XHJcblx0XHRcdFx0XHRcdFx0c3R5bGU6IGdvb2dsZS5tYXBzLk1hcFR5cGVDb250cm9sU3R5bGVbIHZhbHVlLnRvVXBwZXJDYXNlKCkgXVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5tYXAuc2V0T3B0aW9ucyggb3B0aW9ucyApO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHpvb21jb250cm9sOiBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHRcdFx0dmFyIG9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnNcdD0ge307XHJcblxyXG5cdFx0XHRcdGlmICggdmFsdWUgPT09ICdmYWxzZScgKXtcclxuXHRcdFx0XHRcdG9wdGlvbnMuem9vbUNvbnRyb2wgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b3B0aW9ucyA9IHtcclxuXHRcdFx0XHRcdFx0em9vbUNvbnRyb2w6IHRydWUsXHJcblx0XHRcdFx0XHRcdHpvb21Db250cm9sT3B0aW9uczoge1xyXG5cdFx0XHRcdFx0XHRcdHN0eWxlOiBnb29nbGUubWFwcy5ab29tQ29udHJvbFN0eWxlWyB2YWx1ZS50b1VwcGVyQ2FzZSgpIF1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMubWFwLnNldE9wdGlvbnMoIG9wdGlvbnMgKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzY2FsZWNvbnRyb2w6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucztcclxuXHJcblx0XHRcdFx0b3B0aW9uc1x0PSB7fTtcclxuXHJcblx0XHRcdFx0b3B0aW9ucy5zY2FsZUNvbnRyb2wgPSB2YWx1ZSAhPT0gJ2ZhbHNlJztcclxuXHJcblx0XHRcdFx0dGhpcy5tYXAuc2V0T3B0aW9ucyggb3B0aW9ucyApO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHN0cmVldHZpZXdjb250cm9sOiBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHRcdFx0dmFyIG9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnNcdD0ge307XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMuc3RyZWV0Vmlld0NvbnRyb2wgPSB2YWx1ZSAhPT0gJ2ZhbHNlJztcclxuXHJcblx0XHRcdFx0dGhpcy5tYXAuc2V0T3B0aW9ucyggb3B0aW9ucyApO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHBhbmNvbnRyb2w6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucztcclxuXHJcblx0XHRcdFx0b3B0aW9uc1x0PSB7fTtcclxuXHJcblx0XHRcdFx0b3B0aW9ucy5wYW5Db250cm9sID0gdmFsdWUgIT09ICdmYWxzZSc7XHJcblxyXG5cdFx0XHRcdHRoaXMubWFwLnNldE9wdGlvbnMoIG9wdGlvbnMgKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRvdmVydmlld2NvbnRyb2w6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucztcclxuXHJcblx0XHRcdFx0b3B0aW9uc1x0PSB7fTtcclxuXHJcblx0XHRcdFx0aWYgKCB2YWx1ZSA9PT0gJ2ZhbHNlJyApe1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5vdmVydmlld01hcENvbnRyb2wgPSBmYWxzZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b3B0aW9ucyA9IHtcclxuXHRcdFx0XHRcdFx0b3ZlcnZpZXdNYXBDb250cm9sOiB0cnVlLFxyXG5cdFx0XHRcdFx0XHRvdmVydmlld01hcENvbnRyb2xPcHRpb25zOiB7XHJcblx0XHRcdFx0XHRcdFx0b3BlbmVkOiB2YWx1ZSA9PT0gJ29wZW5lZCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMubWFwLnNldE9wdGlvbnMoIG9wdGlvbnMgKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRkcmFnZ2FibGVjb250cm9sOiBmdW5jdGlvbiggdmFsdWUgKSB7XHJcblx0XHRcdFx0dmFyIG9wdGlvbnM7XHJcblxyXG5cdFx0XHRcdG9wdGlvbnNcdD0ge307XHJcblxyXG5cdFx0XHRcdG9wdGlvbnMuZHJhZ2dhYmxlID0gdmFsdWUgIT09ICdmYWxzZSc7XHJcblxyXG5cdFx0XHRcdHRoaXMubWFwLnNldE9wdGlvbnMoIG9wdGlvbnMgKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRjbGlja3Rvem9vbWNvbnRyb2w6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucztcclxuXHJcblx0XHRcdFx0b3B0aW9uc1x0PSB7fTtcclxuXHJcblx0XHRcdFx0b3B0aW9ucy5kaXNhYmxlRG91YmxlQ2xpY2tab29tID0gdmFsdWUgPT09ICdmYWxzZSc7XHJcblxyXG5cdFx0XHRcdHRoaXMubWFwLnNldE9wdGlvbnMoIG9wdGlvbnMgKTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRzY3JvbGx3aGVlbGNvbnRyb2w6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIgb3B0aW9ucztcclxuXHJcblx0XHRcdFx0b3B0aW9uc1x0PSB7fTtcclxuXHJcblx0XHRcdFx0b3B0aW9ucy5zY3JvbGx3aGVlbCA9IHZhbHVlICE9PSAnZmFsc2UnO1xyXG5cclxuXHRcdFx0XHR0aGlzLm1hcC5zZXRPcHRpb25zKCBvcHRpb25zICk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0bWFwdHlwZTogZnVuY3Rpb24oIHZhbHVlICkge1xyXG5cdFx0XHRcdHZhciBvcHRpb25zLFxyXG5cdFx0XHRcdFx0bWFwU3R5bGVzLFxyXG5cdFx0XHRcdFx0bWFwVHlwZTtcclxuXHJcblx0XHRcdFx0bWFwU3R5bGVzID0gdGhpcy4kd3JhcHBlci5maW5kKCAnW2RhdGEtYnVpbGRlci1maWVsZD1cIm1hcHRoZW1lXCJdJyApLmNoaWxkcmVuKCAnb3B0aW9uJyApLmZpbHRlciggJzpzZWxlY3RlZCcgKS5kYXRhKCAnanNvbicgKTtcclxuXHRcdFx0XHRtYXBUeXBlID0gIGdvb2dsZS5tYXBzLk1hcFR5cGVJZFsgdmFsdWUudG9VcHBlckNhc2UoKSBdO1xyXG5cclxuXHRcdFx0XHRvcHRpb25zXHQ9IHtcclxuXHRcdFx0XHRcdG1hcFR5cGVJZDogbWFwVHlwZVxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGlmICggJC5pbkFycmF5KCBnb29nbGUubWFwcy5NYXBUeXBlSWRbIHZhbHVlLnRvVXBwZXJDYXNlKCkgXSwgWyAndGVycmFpbicsICdyb2FkbWFwJyBdKSA+IC0xICYmICEhbWFwU3R5bGVzICkge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5zdHlsZXMgPSBldmFsKCBtYXBTdHlsZXMgKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b3B0aW9ucy5zdHlsZXMgPSBmYWxzZTtcclxuXHRcdFx0XHRcdHRoaXMudXBkYXRlQ29udHJvbCggJ21hcHRoZW1lJyApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5tYXAuc2V0T3B0aW9ucyggb3B0aW9ucyApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0bWFwdGhlbWU6IGZ1bmN0aW9uKCB2YWx1ZSApIHtcclxuXHRcdFx0XHR2YXIganNvbixcclxuXHRcdFx0XHRcdG1hcFR5cGUsXHJcblx0XHRcdFx0XHRvcHRpb25zO1xyXG5cclxuXHRcdFx0XHRtYXBUeXBlID0gZ29vZ2xlLm1hcHMuTWFwVHlwZUlkWyB0aGlzLm1hcC5nZXRNYXBUeXBlSWQoKSA9PT0gJ3RlcnJhaW4nID8gJ1RFUlJBSU4nIDogJ1JPQURNQVAnIF07XHJcblx0XHRcdFx0b3B0aW9ucyA9IHt9O1xyXG5cdFx0XHRcdGpzb24gPSB0aGlzLiR3cmFwcGVyLmZpbmQoICdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwdGhlbWVcIl0nICkuY2hpbGRyZW4oICdvcHRpb24nICkuZmlsdGVyKCAnOnNlbGVjdGVkJyApLmRhdGEoICdqc29uJyApO1xyXG5cclxuXHRcdFx0XHRpZiAoICFqc29uICkge1xyXG5cdFx0XHRcdFx0b3B0aW9ucyA9IHtcclxuXHRcdFx0XHRcdFx0bWFwVHlwZUlkOiBtYXBUeXBlLFxyXG5cdFx0XHRcdFx0XHRzdHlsZXM6IGZhbHNlXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvcHRpb25zID0ge1xyXG5cdFx0XHRcdFx0XHRtYXBUeXBlSWQ6IG1hcFR5cGUsXHJcblx0XHRcdFx0XHRcdHN0eWxlczogZXZhbCgganNvbiApXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5tYXAuc2V0T3B0aW9ucyggb3B0aW9ucyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBDT05UUk9MUyBGVU5DVElPTlNcclxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHR1cGRhdGVDb250cm9sOiBmdW5jdGlvbiggcHJvcCApIHtcclxuXHRcdFx0dmFyIHVwZGF0ZUZuO1xyXG5cclxuXHRcdFx0dXBkYXRlRm4gPSB0aGlzLnVwZGF0ZUNvbnRyb2xWYWx1ZVsgcHJvcCBdO1xyXG5cclxuXHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oIHVwZGF0ZUZuICkgKSB7XHJcblx0XHRcdFx0dXBkYXRlRm4uYXBwbHkoIHRoaXMgKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjb25zb2xlLmluZm8oICdtaXNzaW5nIHVwZGF0ZSBmdW5jdGlvbiBmb3InLCBwcm9wICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHR1cGRhdGVDb250cm9sVmFsdWU6IHtcclxuXHJcblx0XHRcdGxhdGxuZzogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGNlbnRlciA9IHRoaXMubWFwLmdldENlbnRlcigpO1xyXG5cclxuXHRcdFx0XHR0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGRdW25hbWU9XCJsYXRpdHVkZVwiXScpLnZhbCggcm91bmROdW1iZXIoIGNlbnRlci5sYXQoKSAsIDYgKSApO1xyXG5cdFx0XHRcdHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZF1bbmFtZT1cImxvbmdpdHVkZVwiXScpLnZhbCggcm91bmROdW1iZXIoIGNlbnRlci5sbmcoKSAsIDYgKSApO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0em9vbWxldmVsOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJGNvbnRyb2wsXHJcblx0XHRcdFx0XHRsZXZlbDtcclxuXHJcblx0XHRcdFx0bGV2ZWwgPSB0aGlzLm1hcC5nZXRab29tKCk7XHJcblxyXG5cdFx0XHRcdCRjb250cm9sID0gdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwiem9vbWxldmVsXCJdJyk7XHJcblxyXG5cdFx0XHRcdCRjb250cm9sXHJcblx0XHRcdFx0XHQuY2hpbGRyZW4oICdvcHRpb25bdmFsdWU9XCInICsgbGV2ZWwgKyAnXCJdJyApXHJcblx0XHRcdFx0XHQucHJvcCggJ3NlbGVjdGVkJywgdHJ1ZSApO1xyXG5cclxuXHRcdFx0XHRpZiAoICRjb250cm9sLmhhc0NsYXNzKCAnc2VsZWN0Mi1vZmZzY3JlZW4nICkgKSB7XHJcblx0XHRcdFx0XHQkY29udHJvbC5zZWxlY3QyKCAndmFsJywgbGV2ZWwgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRtYXB0eXBlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgJGNvbnRyb2wsXHJcblx0XHRcdFx0XHRtYXBUeXBlO1xyXG5cclxuXHRcdFx0XHRtYXBUeXBlID0gdGhpcy5tYXAuZ2V0TWFwVHlwZUlkKCk7XHJcblx0XHRcdFx0JGNvbnRyb2wgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGQ9XCJtYXB0eXBlXCJdJyk7XHJcblxyXG5cdFx0XHRcdCRjb250cm9sXHJcblx0XHRcdFx0XHQuY2hpbGRyZW4oICdvcHRpb25bdmFsdWU9XCInICsgbWFwVHlwZSArICdcIl0nIClcclxuXHRcdFx0XHRcdC5wcm9wKCAnc2VsZWN0ZWQnLCB0cnVlICk7XHJcblxyXG5cdFx0XHRcdGlmICggJGNvbnRyb2wuaGFzQ2xhc3MoICdzZWxlY3QyLW9mZnNjcmVlbicgKSApIHtcclxuXHRcdFx0XHRcdCRjb250cm9sLnNlbGVjdDIoICd2YWwnLCBtYXBUeXBlICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0bWFwdGhlbWU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkY29udHJvbDtcclxuXHJcblx0XHRcdFx0JGNvbnRyb2wgPSB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGQ9XCJtYXB0aGVtZVwiXScpO1xyXG5cclxuXHRcdFx0XHQkY29udHJvbFxyXG5cdFx0XHRcdFx0LmNoaWxkcmVuKCAnb3B0aW9uW3ZhbHVlPVwiZmFsc2VcIl0nIClcclxuXHRcdFx0XHRcdC5wcm9wKCAnc2VsZWN0ZWQnLCB0cnVlICk7XHJcblxyXG5cdFx0XHRcdGlmICggJGNvbnRyb2wuaGFzQ2xhc3MoICdzZWxlY3QyLW9mZnNjcmVlbicgKSApIHtcclxuXHRcdFx0XHRcdCRjb250cm9sLnNlbGVjdDIoICd2YWwnLCAnZmFsc2UnICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBNQVJLRVJTIEZVTkNUSU9OU1xyXG5cdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdGVkaXRNYXJrZXI6IGZ1bmN0aW9uKCBtYXJrZXIgKSB7XHJcblx0XHRcdHRoaXMuY3VycmVudE1hcmtlciA9IG1hcmtlcjtcclxuXHJcblx0XHRcdHRoaXMubWFya2VyLiRmb3JtXHJcblx0XHRcdFx0LmZpbmQoICcjTWFya2VyTG9jYXRpb24nICkudmFsKCBtYXJrZXIubG9jYXRpb24gKTtcclxuXHJcblx0XHRcdHRoaXMubWFya2VyLiRmb3JtXHJcblx0XHRcdFx0LmZpbmQoICcjTWFya2VyVGl0bGUnICkudmFsKCBtYXJrZXIudGl0bGUgKTtcclxuXHJcblx0XHRcdHRoaXMubWFya2VyLiRmb3JtXHJcblx0XHRcdFx0LmZpbmQoICcjTWFya2VyRGVzY3JpcHRpb24nICkudmFsKCBtYXJrZXIuZGVzY3JpcHRpb24gKTtcclxuXHJcblx0XHRcdHRoaXMubWFya2VyLiRtb2RhbC5tb2RhbCggJ3Nob3cnICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHJlbW92ZU1hcmtlcjogZnVuY3Rpb24oIG1hcmtlciApIHtcclxuXHRcdFx0dmFyIGk7XHJcblxyXG5cdFx0XHRtYXJrZXIuX2luc3RhbmNlLnNldE1hcCggbnVsbCApO1xyXG5cdFx0XHRtYXJrZXIuXyRodG1sLnJlbW92ZSgpO1xyXG5cclxuXHRcdFx0Zm9yKCBpID0gMDsgaSA8IHRoaXMubWFya2Vycy5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0XHRpZiAoIG1hcmtlciA9PT0gdGhpcy5tYXJrZXJzWyBpIF0gKSB7XHJcblx0XHRcdFx0XHR0aGlzLm1hcmtlcnMuc3BsaWNlKCBpLCAxICk7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggdGhpcy5tYXJrZXJzLmxlbmd0aCA9PT0gMCApIHtcclxuXHRcdFx0XHR0aGlzLm1hcmtlci4kbGlzdC5hZGRDbGFzcyggJ2hpZGRlbicgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRzYXZlTWFya2VyOiBmdW5jdGlvbiggbWFya2VyICkge1xyXG5cdFx0XHR0aGlzLl9nZW9jb2RlKCBtYXJrZXIgKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0cmVtb3ZlQWxsTWFya2VyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBpID0gMCxcclxuXHRcdFx0XHRsLFxyXG5cdFx0XHRcdG1hcmtlcjtcclxuXHJcblx0XHRcdGwgPSB0aGlzLm1hcmtlcnMubGVuZ3RoO1xyXG5cclxuXHRcdFx0Zm9yKCA7IGkgPCBsOyBpKysgKSB7XHJcblx0XHRcdFx0bWFya2VyID0gdGhpcy5tYXJrZXJzWyBpIF07XHJcblxyXG5cdFx0XHRcdG1hcmtlci5faW5zdGFuY2Uuc2V0TWFwKCBudWxsICk7XHJcblx0XHRcdFx0bWFya2VyLl8kaHRtbC5yZW1vdmUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5tYXJrZXJzID0gW107XHJcblx0XHRcdHRoaXMubWFya2VyLiRsaXN0LmFkZENsYXNzKCAnaGlkZGVuJyApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfZ2VvY29kZTogZnVuY3Rpb24oIG1hcmtlciApIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcyxcclxuXHRcdFx0XHRzdGF0dXM7XHJcblxyXG5cdFx0XHR0aGlzLmdlb2NvZGVyLmdlb2NvZGUoeyBhZGRyZXNzOiBtYXJrZXIubG9jYXRpb24gfSwgZnVuY3Rpb24oIHJlc3BvbnNlLCBzdGF0dXMgKSB7XHJcblx0XHRcdFx0X3NlbGYuX29uR2VvY29kZVJlc3VsdCggbWFya2VyLCByZXNwb25zZSwgc3RhdHVzICk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfb25HZW9jb2RlUmVzdWx0OiBmdW5jdGlvbiggbWFya2VyLCByZXNwb25zZSwgc3RhdHVzICkge1xyXG5cdFx0XHR2YXIgcmVzdWx0O1xyXG5cclxuXHRcdFx0aWYgKCAhcmVzcG9uc2UgfHwgc3RhdHVzICE9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSyApIHtcclxuXHRcdFx0XHRpZiAoIHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5aRVJPX1JFU1VMVFMgKSB7XHJcblx0XHRcdFx0XHQvLyBzaG93IG5vdGlmaWNhdGlvblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aW1lb3V0cysrO1xyXG5cdFx0XHRcdFx0aWYgKCB0aW1lb3V0cyA+IDMgKSB7XHJcblx0XHRcdFx0XHRcdC8vIHNob3cgbm90aWZpY2F0aW9uIHJlYWNoZWQgbGltaXQgb2YgcmVxdWVzdHNcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGltZW91dHMgPSAwO1xyXG5cclxuXHRcdFx0XHRpZiAoIHRoaXMuY3VycmVudE1hcmtlciApIHtcclxuXHRcdFx0XHRcdHRoaXMucmVtb3ZlTWFya2VyKCB0aGlzLmN1cnJlbnRNYXJrZXIgKTtcclxuXHRcdFx0XHRcdHRoaXMuY3VycmVudE1hcmtlciA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBncmFiIGZpcnN0IHJlc3VsdCBvZiB0aGUgbGlzdFxyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3BvbnNlWyAwIF07XHJcblxyXG5cdFx0XHRcdC8vIGdldCBsYXQgJiBsbmcgYW5kIHNldCB0byBtYXJrZXJcclxuXHRcdFx0XHRtYXJrZXIubGF0ID0gTWF0aC5yb3VuZCggcmVzdWx0Lmdlb21ldHJ5LmxvY2F0aW9uLmxhdCgpICogMTAwMDAwMCApIC8gMTAwMDAwMDtcclxuXHRcdFx0XHRtYXJrZXIubG5nID0gTWF0aC5yb3VuZCggcmVzdWx0Lmdlb21ldHJ5LmxvY2F0aW9uLmxuZygpICogMTAwMDAwMCApIC8gMTAwMDAwMDtcclxuXHJcblx0XHRcdFx0dmFyIG9wdHMgPSB7XHJcblx0XHRcdFx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggbWFya2VyLmxhdCwgbWFya2VyLmxuZyApLFxyXG5cdFx0XHRcdFx0bWFwOiB0aGlzLm1hcFxyXG5cdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdGlmICggbWFya2VyLnRpdGxlLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdFx0XHRvcHRzLnRpdGxlID0gbWFya2VyLnRpdGxlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCBtYXJrZXIuZGVzY3JpcHRpb24ubGVuZ3RoID4gMCApIHtcclxuXHRcdFx0XHRcdG9wdHMuZGVzYyA9IG1hcmtlci5kZXNjcmlwdGlvbjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdG1hcmtlci5wb3NpdGlvbiA9IG9wdHMucG9zaXRpb247XHJcblx0XHRcdFx0bWFya2VyLl9pbnN0YW5jZSA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoIG9wdHMgKTtcclxuXHJcblx0XHRcdFx0aWYgKCAhIW1hcmtlci50aXRsZSB8fCAhIW1hcmtlci5kZXNjcmlwdGlvbiAgKSB7XHJcblx0XHRcdFx0XHR0aGlzLl9iaW5kTWFya2VyQ2xpY2soIG1hcmtlciApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5tYXJrZXJzLnB1c2goIG1hcmtlciApO1xyXG5cclxuXHRcdFx0XHQvLyBhcHBlbmQgdG8gbWFya2VycyBsaXN0XHJcblx0XHRcdFx0dGhpcy5fYXBwZW5kTWFya2VyVG9MaXN0KCBtYXJrZXIgKTtcclxuXHJcblx0XHRcdFx0Ly8gaGlkZSBtb2RhbCBhbmQgcmVzZXQgZm9ybVxyXG5cdFx0XHRcdHRoaXMubWFya2VyLiRmb3JtLmdldCgwKS5yZXNldCgpO1xyXG5cdFx0XHRcdHRoaXMubWFya2VyLiRtb2RhbC5tb2RhbCggJ2hpZGUnICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X2FwcGVuZE1hcmtlclRvTGlzdDogZnVuY3Rpb24oIG1hcmtlciApIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcyxcclxuXHRcdFx0XHRodG1sO1xyXG5cclxuXHRcdFx0aHRtbCA9IFtcclxuXHRcdFx0XHQnPGxpPicsXHJcblx0XHRcdFx0XHQnPHA+e2xvY2F0aW9ufTwvcD4nLFxyXG5cdFx0XHRcdFx0JzxhIGhyZWY9XCIjXCIgY2xhc3M9XCJsb2NhdGlvbi1hY3Rpb24gbG9jYXRpb24tY2VudGVyXCI+PGkgY2xhc3M9XCJmYXMgZmEtbWFwLW1hcmtlci1hbHRcIj48L2k+PC9hPicsXHJcblx0XHRcdFx0XHQnPGEgaHJlZj1cIiNcIiBjbGFzcz1cImxvY2F0aW9uLWFjdGlvbiBsb2NhdGlvbi1lZGl0XCI+PGkgY2xhc3M9XCJmYXMgZmEtZWRpdFwiPjwvaT48L2E+JyxcclxuXHRcdFx0XHRcdCc8YSBocmVmPVwiI1wiIGNsYXNzPVwibG9jYXRpb24tYWN0aW9uIGxvY2F0aW9uLXJlbW92ZSB0ZXh0LWRhbmdlclwiPjxpIGNsYXNzPVwiZmFzIGZhLXRpbWVzXCI+PC9pPjwvYT4nLFxyXG5cdFx0XHRcdCc8L2xpPidcclxuXHRcdFx0XS5qb2luKCcnKTtcclxuXHJcblx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2UoIC9cXHtsb2NhdGlvblxcfS8sICEhbWFya2VyLnRpdGxlID8gbWFya2VyLnRpdGxlIDogbWFya2VyLmxvY2F0aW9uICk7XHJcblxyXG5cdFx0XHRtYXJrZXIuXyRodG1sID0gJCggaHRtbCApO1xyXG5cclxuXHRcdFx0Ly8gZXZlbnRzXHJcblx0XHRcdG1hcmtlci5fJGh0bWwuZmluZCggJy5sb2NhdGlvbi1jZW50ZXInIClcclxuXHRcdFx0XHQub24oICdjbGljaycsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdFx0X3NlbGYubWFwLnNldENlbnRlciggbWFya2VyLnBvc2l0aW9uICk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtYXJrZXIuXyRodG1sLmZpbmQoICcubG9jYXRpb24tcmVtb3ZlJyApXHJcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdF9zZWxmLnJlbW92ZU1hcmtlciggbWFya2VyICk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRtYXJrZXIuXyRodG1sLmZpbmQoICcubG9jYXRpb24tZWRpdCcgKVxyXG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oIGUgKSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRfc2VsZi5lZGl0TWFya2VyKCBtYXJrZXIgKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMubWFya2VyLiRsaXN0XHJcblx0XHRcdFx0LmFwcGVuZCggbWFya2VyLl8kaHRtbCApXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCAnaGlkZGVuJyApO1xyXG5cdFx0fSxcclxuXHJcblx0XHRfYmluZE1hcmtlckNsaWNrOiBmdW5jdGlvbiggbWFya2VyICkge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdGh0bWw7XHJcblxyXG5cdFx0XHRodG1sID0gW1xyXG5cdFx0XHRcdCc8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI0ZGRjsgY29sb3I6ICMwMDA7IHBhZGRpbmc6IDVweDsgd2lkdGg6IDE1MHB4O1wiPicsXHJcblx0XHRcdFx0XHQne3RpdGxlfScsXHJcblx0XHRcdFx0XHQne2Rlc2NyaXB0aW9ufScsXHJcblx0XHRcdFx0JzwvZGl2PidcclxuXHRcdFx0XS5qb2luKCcnKTtcclxuXHJcblx0XHRcdGh0bWwgPSBodG1sLnJlcGxhY2UoL1xce3RpdGxlXFx9LywgISFtYXJrZXIudGl0bGUgPyAgKFwiPGg0PlwiICsgbWFya2VyLnRpdGxlICsgXCI8L2g0PlwiKSA6IFwiXCIgKTtcclxuXHRcdFx0aHRtbCA9IGh0bWwucmVwbGFjZSgvXFx7ZGVzY3JpcHRpb25cXH0vLCAhIW1hcmtlci5kZXNjcmlwdGlvbiA/ICAoXCI8cD5cIiArIG1hcmtlci5kZXNjcmlwdGlvbiArIFwiPC9wPlwiKSA6IFwiXCIgKTtcclxuXHJcblx0XHRcdG1hcmtlci5faW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHsgY29udGVudDogaHRtbCB9KTtcclxuXHJcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCBtYXJrZXIuX2luc3RhbmNlLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdFx0aWYgKCBtYXJrZXIuX2luZm9XaW5kb3cuaXNPcGVuZWQgKSB7XHJcblx0XHRcdFx0XHRtYXJrZXIuX2luZm9XaW5kb3cuY2xvc2UoKTtcclxuXHRcdFx0XHRcdG1hcmtlci5faW5mb1dpbmRvdy5pc09wZW5lZCA9IGZhbHNlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYXJrZXIuX2luZm9XaW5kb3cub3BlbiggX3NlbGYubWFwLCB0aGlzICk7XHJcblx0XHRcdFx0XHRtYXJrZXIuX2luZm9XaW5kb3cuaXNPcGVuZWQgPSB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pO1xyXG5cdFx0fSxcclxuXHJcblx0XHRwcmV2aWV3OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGN1c3RvbVNjcmlwdCxcclxuXHRcdFx0XHRnb29nbGVTY3JpcHQsXHJcblx0XHRcdFx0aWZyYW1lLFxyXG5cdFx0XHRcdHByZXZpZXdIdG1sO1xyXG5cclxuXHRcdFx0cHJldmlld0h0bWwgPSBbXHJcblx0XHRcdFx0JzxzdHlsZT4nLFxyXG5cdFx0XHRcdFx0J2h0bWwsIGJvZHkgeyBtYXJnaW46IDA7IHBhZGRpbmc6IDA7IH0nLFxyXG5cdFx0XHRcdCc8L3N0eWxlPicsXHJcblx0XHRcdFx0JzxkaXYgaWQ9XCInICsgdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwaWRcIl0nKS52YWwoKSArICdcIiBzdHlsZT1cIndpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7XCI+PC9kaXY+J1xyXG5cdFx0XHRdO1xyXG5cclxuXHRcdFx0aWZyYW1lID0gdGhpcy4kcHJldmlld01vZGFsLmZpbmQoICdpZnJhbWUnICkuZ2V0KDApLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XHJcblxyXG5cdFx0XHRpZnJhbWUuYm9keS5pbm5lckhUTUwgPSBwcmV2aWV3SHRtbC5qb2luKCcnKTtcclxuXHJcblx0XHRcdGN1c3RvbVNjcmlwdCA9IGlmcmFtZS5jcmVhdGVFbGVtZW50KCAnc2NyaXB0JyApO1xyXG5cdFx0XHRjdXN0b21TY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG5cdFx0XHRjdXN0b21TY3JpcHQudGV4dCA9IFwid2luZG93LmluaXRpYWxpemUgPSBmdW5jdGlvbigpIHsgXCIgKyB0aGlzLmdlbmVyYXRlKCkgKyBcIiBpbml0KCk7IH07IFwiO1xyXG5cdFx0XHRpZnJhbWUuYm9keS5hcHBlbmRDaGlsZCggY3VzdG9tU2NyaXB0ICk7XHJcblxyXG5cdFx0XHRnb29nbGVTY3JpcHQgPSBpZnJhbWUuY3JlYXRlRWxlbWVudCggJ3NjcmlwdCcgKTtcclxuXHRcdFx0Z29vZ2xlU2NyaXB0LnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0JztcclxuXHRcdFx0Z29vZ2xlU2NyaXB0LnRleHQgPSAnZnVuY3Rpb24gbG9hZFNjcmlwdCgpIHsgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7IHNjcmlwdC50eXBlID0gXCJ0ZXh0L2phdmFzY3JpcHRcIjsgc2NyaXB0LnNyYyA9IFwiLy9tYXBzLmdvb2dsZWFwaXMuY29tL21hcHMvYXBpL2pzP2tleT0mc2Vuc29yPSZjYWxsYmFjaz1pbml0aWFsaXplXCI7IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTsgfSBsb2FkU2NyaXB0KCknO1xyXG5cdFx0XHRpZnJhbWUuYm9keS5hcHBlbmRDaGlsZCggZ29vZ2xlU2NyaXB0ICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGdldENvZGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRnZXRDb2RlTW9kYWwuZmluZCgnLm1vZGFsLWJvZHkgcHJlJykuaHRtbCggdGhpcy5nZW5lcmF0ZSgpLnJlcGxhY2UoIC88L2csICcmbHQ7JyApLnJlcGxhY2UoIC8+L2csICcmZ3Q7JyApICk7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIEdFTkVSQVRFIENPREVcclxuXHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRnZW5lcmF0ZTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBpLFxyXG5cdFx0XHRcdHdvcms7XHJcblxyXG5cdFx0XHR2YXIgb3V0cHV0ID0gW1xyXG5cdFx0XHRcdCcgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIod2luZG93LCBcImxvYWRcIiwgaW5pdCk7JyxcclxuXHRcdFx0XHQnICAgIHZhciBtYXA7JyxcclxuXHRcdFx0XHQnICAgIGZ1bmN0aW9uIGluaXQoKSB7JyxcclxuXHRcdFx0XHQnICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHsnLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoe2xhdH0sIHtsbmd9KSwnLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICB6b29tOiB7em9vbX0sJyxcclxuXHRcdFx0XHQnICAgICAgICAgICAgem9vbUNvbnRyb2w6IHt6b29tQ29udHJvbH0sJyxcclxuXHRcdFx0XHQnICAgICAgICAgICAge3pvb21Db250cm9sT3B0aW9uc30nLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICBkaXNhYmxlRG91YmxlQ2xpY2tab29tOiB7ZGlzYWJsZURvdWJsZUNsaWNrWm9vbX0sJyxcclxuXHRcdFx0XHQnICAgICAgICAgICAgbWFwVHlwZUNvbnRyb2w6IHttYXBUeXBlQ29udHJvbH0sJyxcclxuXHRcdFx0XHQnICAgICAgICAgICAge21hcFR5cGVDb250cm9sT3B0aW9uc30nLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICBzY2FsZUNvbnRyb2w6IHtzY2FsZUNvbnRyb2x9LCcsXHJcblx0XHRcdFx0JyAgICAgICAgICAgIHNjcm9sbHdoZWVsOiB7c2Nyb2xsd2hlZWx9LCcsXHJcblx0XHRcdFx0JyAgICAgICAgICAgIHBhbkNvbnRyb2w6IHtwYW5Db250cm9sfSwnLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICBzdHJlZXRWaWV3Q29udHJvbDoge3N0cmVldFZpZXdDb250cm9sfSwnLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICBkcmFnZ2FibGUgOiB7ZHJhZ2dhYmxlfSwnLFxyXG5cdFx0XHRcdCcgICAgICAgICAgICBvdmVydmlld01hcENvbnRyb2w6IHtvdmVydmlld01hcENvbnRyb2x9LCcsXHJcblx0XHRcdFx0JyAgICAgICAgICAgIHtvdmVydmlld01hcENvbnRyb2xPcHRpb25zfScsXHJcblx0XHRcdFx0JyAgICAgICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLnttYXBUeXBlSWR9e3N0eWxlc30nLFxyXG5cdFx0XHRcdCcgICAgICAgIH07JyxcclxuXHRcdFx0XHQnJyxcclxuXHRcdFx0XHQnICAgICAgICB2YXIgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwie21hcGlkfVwiKTsnLFxyXG5cdFx0XHRcdCcgICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpOycsXHJcblx0XHRcdFx0JyAgICAgICAge2xvY2F0aW9uc30nLFxyXG5cdFx0XHRcdCcgICAgfSdcclxuXHRcdFx0XTtcclxuXHJcblx0XHRcdG91dHB1dCA9IG91dHB1dC5qb2luKFwiXFxyXFxuXCIpO1xyXG5cclxuXHRcdFx0dmFyIHpvb21Db250cm9sXHRcdFx0PSB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGQ9XCJ6b29tY29udHJvbFwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSAhPT0gJ2ZhbHNlJztcclxuXHRcdFx0dmFyIG1hcFR5cGVDb250cm9sXHRcdD0gdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwdHlwZWNvbnRyb2xcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCkgIT09ICdmYWxzZSc7XHJcblx0XHRcdHZhciBvdmVydmlld01hcENvbnRyb2xcdD0gdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwib3ZlcnZpZXdjb250cm9sXCJdIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpLnRvTG93ZXJDYXNlKCk7XHJcblx0XHRcdHZhciAkdGhlbWVDb250cm9sXHRcdD0gdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwdGhlbWVcIl0gb3B0aW9uOnNlbGVjdGVkJykuZmlsdGVyKCAnOnNlbGVjdGVkJyApO1xyXG5cclxuXHRcdFx0b3V0cHV0ID0gb3V0cHV0XHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7bWFwaWRcXH0vLCB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGQ9XCJtYXBpZFwiXScpLnZhbCgpIClcclxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoIC9cXHtsYXRcXH0vLCB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGRdW25hbWU9XCJsYXRpdHVkZVwiXScpLnZhbCgpIClcclxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoIC9cXHtsbmdcXH0vLCB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGRdW25hbWU9XCJsb25naXR1ZGVcIl0nKS52YWwoKSApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7em9vbVxcfS8sIHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZD1cInpvb21sZXZlbFwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7em9vbUNvbnRyb2xcXH0vLCB6b29tQ29udHJvbCApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7ZGlzYWJsZURvdWJsZUNsaWNrWm9vbVxcfS8sIHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZD1cImNsaWNrdG96b29tY29udHJvbFwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSA9PT0gJ2ZhbHNlJyApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7bWFwVHlwZUNvbnRyb2xcXH0vLCBtYXBUeXBlQ29udHJvbCApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7c2NhbGVDb250cm9sXFx9LywgdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwic2NhbGVjb250cm9sXCJdIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpICE9PSAnZmFsc2UnIClcclxuXHRcdFx0XHRcdFx0LnJlcGxhY2UoIC9cXHtzY3JvbGx3aGVlbFxcfS8sIHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZD1cInNjcm9sbHdoZWVsY29udHJvbFwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKSAhPT0gJ2ZhbHNlJyApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7cGFuQ29udHJvbFxcfS8sIHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZD1cInBhbmNvbnRyb2xcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCkgIT09ICdmYWxzZScgKVxyXG5cdFx0XHRcdFx0XHQucmVwbGFjZSggL1xce3N0cmVldFZpZXdDb250cm9sXFx9LywgdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwic3RyZWV0dmlld2NvbnRyb2xcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCkgIT09ICdmYWxzZScgKVxyXG5cdFx0XHRcdFx0XHQucmVwbGFjZSggL1xce2RyYWdnYWJsZVxcfS8sIHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZD1cImRyYWdnYWJsZWNvbnRyb2xcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCkgIT09ICdmYWxzZScgKVxyXG5cdFx0XHRcdFx0XHQucmVwbGFjZSggL1xce292ZXJ2aWV3TWFwQ29udHJvbFxcfS8sIG92ZXJ2aWV3TWFwQ29udHJvbCAhPT0gJ2ZhbHNlJyApXHJcblx0XHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7bWFwVHlwZUlkXFx9LywgdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwdHlwZVwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKS50b1VwcGVyQ2FzZSgpICk7XHJcblxyXG5cdFx0XHRpZiAoIHpvb21Db250cm9sICkge1xyXG5cdFx0XHRcdHdvcmsgPSB7XHJcblx0XHRcdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcclxuXHRcdFx0XHRcdFx0c3R5bGU6IHRoaXMuJHdyYXBwZXIuZmluZCgnW2RhdGEtYnVpbGRlci1maWVsZD1cIm1hcHR5cGVjb250cm9sXCJdIG9wdGlvbjpzZWxlY3RlZCcpLnZhbCgpLnRvVXBwZXJDYXNlKClcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKCAvXFx7em9vbUNvbnRyb2xPcHRpb25zXFx9LywgXCJ6b29tQ29udHJvbE9wdGlvbnM6IHtcXHJcXG4gICAgICAgICAgICAgICAgc3R5bGU6IGdvb2dsZS5tYXBzLlpvb21Db250cm9sU3R5bGUuXCIgKyB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGQ9XCJ6b29tY29udHJvbFwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKS50b1VwcGVyQ2FzZSgpICsgXCJcXHJcXG5cXCAgICAgICAgICAgIH0sXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKCAvXFx7em9vbUNvbnRyb2xPcHRpb25zXFx9LywgJycgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBtYXBUeXBlQ29udHJvbCApIHtcclxuXHRcdFx0XHR3b3JrID0ge1xyXG5cdFx0XHRcdFx0em9vbUNvbnRyb2xPcHRpb25zOiB7XHJcblx0XHRcdFx0XHRcdHN0eWxlOiB0aGlzLiR3cmFwcGVyLmZpbmQoJ1tkYXRhLWJ1aWxkZXItZmllbGQ9XCJtYXB0eXBlY29udHJvbFwiXSBvcHRpb246c2VsZWN0ZWQnKS52YWwoKS50b1VwcGVyQ2FzZSgpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSggL1xce21hcFR5cGVDb250cm9sT3B0aW9uc1xcfS8sIFwibWFwVHlwZUNvbnRyb2xPcHRpb25zOiB7XFxyXFxuICAgICAgICAgICAgICAgIHN0eWxlOiBnb29nbGUubWFwcy5NYXBUeXBlQ29udHJvbFN0eWxlLlwiICsgdGhpcy4kd3JhcHBlci5maW5kKCdbZGF0YS1idWlsZGVyLWZpZWxkPVwibWFwdHlwZWNvbnRyb2xcIl0gb3B0aW9uOnNlbGVjdGVkJykudmFsKCkudG9VcHBlckNhc2UoKSArIFwiXFxyXFxuXFwgICAgICAgICAgICB9LFwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSggL1xce21hcFR5cGVDb250cm9sT3B0aW9uc1xcfS8sICcnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggb3ZlcnZpZXdNYXBDb250cm9sICE9PSAnZmFsc2UnICkge1xyXG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKCAvXFx7b3ZlcnZpZXdNYXBDb250cm9sT3B0aW9uc1xcfS8sIFwib3ZlcnZpZXdNYXBDb250cm9sT3B0aW9uczoge1xcclxcbiAgICAgICAgICAgICAgICBvcGVuZWQ6IFwiICsgKG92ZXJ2aWV3TWFwQ29udHJvbCA9PT0gJ29wZW5lZCcpICsgXCJcXHJcXG5cXCAgICAgICAgICAgIH0sXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKCAvXFx7b3ZlcnZpZXdNYXBDb250cm9sT3B0aW9uc1xcfS8sICcnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggJHRoZW1lQ29udHJvbC52YWwoKSAhPT0gJ2ZhbHNlJyApIHtcclxuXHRcdFx0XHRvdXRwdXQgPSBvdXRwdXQucmVwbGFjZSggL1xce3N0eWxlc1xcfS8sICcsXFxyXFxuICAgICAgICAgICAgc3R5bGVzOiAnICsgJHRoZW1lQ29udHJvbC5kYXRhKCAnanNvbicgKS5yZXBsYWNlKC9cXHJcXG4vZywgJycpICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3V0cHV0ID0gb3V0cHV0LnJlcGxhY2UoIC9cXHtzdHlsZXNcXH0vLCAnJyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMubWFya2Vycy5sZW5ndGggPiAwICkge1xyXG5cdFx0XHRcdHZhciB3b3JrID0gWyAndmFyIGxvY2F0aW9ucyA9IFsnIF07XHJcblx0XHRcdFx0dmFyIG0sXHJcblx0XHRcdFx0XHRvYmplY3Q7XHJcblxyXG5cdFx0XHRcdGZvciggaSA9IDA7IGkgPCB0aGlzLm1hcmtlcnMubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdFx0XHRtID0gdGhpcy5tYXJrZXJzWyBpIF07XHJcblx0XHRcdFx0XHRvYmplY3QgPSAnJztcclxuXHJcblx0XHRcdFx0XHRvYmplY3QgKz0gJyAgICAgICAgICAgIHsgbGF0OiAnICsgbS5sYXQgKyAnLCBsbmc6ICcgKyBtLmxuZztcclxuXHJcblx0XHRcdFx0XHRpZiAoICEhbS50aXRsZSApIHtcclxuXHRcdFx0XHRcdFx0b2JqZWN0ICs9ICcsIHRpdGxlOiBcIicgKyBtLnRpdGxlICsgJ1wiJztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZiAoICEhbS5kZXNjcmlwdGlvbiApIHtcclxuXHRcdFx0XHRcdFx0b2JqZWN0ICs9ICcsIGRlc2NyaXB0aW9uOiBcIicgKyBtLmRlc2NyaXB0aW9uICsgJ1wiJztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRvYmplY3QgKz0gJyB9JztcclxuXHJcblx0XHRcdFx0XHRpZiAoIGkgKyAxIDwgdGhpcy5tYXJrZXJzLmxlbmd0aCApIHtcclxuXHRcdFx0XHRcdFx0b2JqZWN0ICs9ICcsJztcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR3b3JrLnB1c2goIG9iamVjdCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICBdO1xcclxcbicgKVxyXG5cclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgIHZhciBvcHRzID0ge307JyApXHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykgeycgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICBvcHRzLnBvc2l0aW9uID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyggbG9jYXRpb25zWyBpIF0ubGF0LCBsb2NhdGlvbnNbIGkgXS5sbmcgKTsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgb3B0cy5tYXAgPSBtYXA7JyApO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgIGlmICggISFsb2NhdGlvbnNbIGkgXSAudGl0bGUgKSB7IG9wdHMudGl0bGUgPSBsb2NhdGlvbnNbIGkgXS50aXRsZTsgfScpO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgIGlmICggISFsb2NhdGlvbnNbIGkgXSAuZGVzY3JpcHRpb24gKSB7IG9wdHMuZGVzY3JpcHRpb24gPSBsb2NhdGlvbnNbIGkgXS5kZXNjcmlwdGlvbjsgfScpO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoIG9wdHMgKTsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnJyApO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgIChmdW5jdGlvbigpIHsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIHZhciBodG1sID0gWycgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICAgICAgXHRcXCc8ZGl2IHN0eWxlPVwiYmFja2dyb3VuZC1jb2xvcjogI0ZGRjsgY29sb3I6ICMwMDA7IHBhZGRpbmc6IDVweDsgd2lkdGg6IDE1MHB4O1wiPlxcJywnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIFx0XHRcXCd7dGl0bGV9XFwnLCcgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICAgICAgXHRcdFxcJ3tkZXNjcmlwdGlvbn1cXCcsJyApO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgICAgICBcdFxcJzwvZGl2PlxcJycgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICAgICAgXS5qb2luKFxcJ1xcJyk7JyApO1xyXG5cclxuXHRcdFx0XHR3b3JrLnB1c2goICcnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoL1xce3RpdGxlXFx9LywgISFvcHRzLnRpdGxlID8gIChcIjxoND5cIiArIG9wdHMudGl0bGUgKyBcIjwvaDQ+XCIpIDogXCJcIiApOycgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZSgvXFx7ZGVzY3JpcHRpb25cXH0vLCAhIW9wdHMuZGVzY3JpcHRpb24gPyAgKFwiPHA+XCIgKyBvcHRzLmRlc2NyaXB0aW9uICsgXCI8L3A+XCIpIDogXCJcIiApOycgKTtcclxuXHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIHZhciBpbmZvV2luZG93ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coeyBjb250ZW50OiBodG1sIH0pOycgKTtcclxuXHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKCBtYXJrZXIsIFxcJ2NsaWNrXFwnLCBmdW5jdGlvbigpIHsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIFx0aWYgKCBpbmZvV2luZG93LmlzT3BlbmVkICkgeycgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICAgICAgXHRcdGluZm9XaW5kb3cuY2xvc2UoKTsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIFx0XHRpbmZvV2luZG93LmlzT3BlbmVkID0gZmFsc2U7JyApO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgICAgICBcdH0gZWxzZSB7JyApO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgICAgICBcdFx0aW5mb1dpbmRvdy5vcGVuKCBtYXAsIHRoaXMgKTsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIFx0XHRpbmZvV2luZG93LmlzT3BlbmVkID0gdHJ1ZTsnICk7XHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICAgICAgICAgIFx0fScgKTtcclxuXHRcdFx0XHR3b3JrLnB1c2goICcgICAgICAgICAgICAgICAgfSk7JyApO1xyXG5cdFx0XHRcdHdvcmsucHVzaCggJyAgICAgICAgICAgIH0pKCk7JyApXHJcblx0XHRcdFx0d29yay5wdXNoKCAnICAgICAgICB9Jyk7XHJcblxyXG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKCAvXFx7bG9jYXRpb25zXFx9Lywgd29yay5qb2luKCdcXHJcXG4nKSApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKCAvXFx7bG9jYXRpb25zXFx9LywgJycgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Y29uc29sZS5sb2coIG91dHB1dCApO1xyXG5cclxuXHRcdFx0cmV0dXJuIG91dHB1dDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2VcclxuXHQkLmV4dGVuZCggdHJ1ZSwgdGhlbWUsIHtcclxuXHRcdE1hcHM6IHtcclxuXHRcdFx0R01hcEJ1aWxkZXI6IEdNYXBCdWlsZGVyXHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIGpRdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lR01hcEJ1aWxkZXIgPSBmdW5jdGlvbiggb3B0cyApIHtcclxuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCggdGhpcyApLFxyXG5cdFx0XHRcdGluc3RhbmNlO1xyXG5cclxuXHRcdFx0aW5zdGFuY2UgPSAkdGhpcy5kYXRhKCBpbnN0YW5jZU5hbWUgKTtcclxuXHJcblx0XHRcdGlmICggaW5zdGFuY2UgKSB7XHJcblx0XHRcdFx0cmV0dXJuIGluc3RhbmNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiAobmV3IEdNYXBCdWlsZGVyKCAkdGhpcywgb3B0cyApKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gYXV0byBpbml0aWFsaXplXHJcblx0JChmdW5jdGlvbigpIHtcclxuXHRcdCQoJ1tkYXRhLXRoZW1lLWdtYXAtYnVpbGRlcl0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKCB0aGlzICk7XHJcblxyXG5cdFx0XHR3aW5kb3cuYnVpbGRlciA9ICR0aGlzLnRoZW1lR01hcEJ1aWxkZXIoKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBNYXJrZG93blxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluc3RhbmNlTmFtZSA9ICdfX21hcmtkb3duRWRpdG9yJztcclxuXHJcblx0dmFyIFBsdWdpbk1hcmtkb3duRWRpdG9yID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luTWFya2Rvd25FZGl0b3IuZGVmYXVsdHMgPSB7XHJcblx0XHRpY29ubGlicmFyeTogJ2ZhJyxcclxuXHRcdGJ1dHRvbnM6IFtcclxuXHRcdFx0W3tcclxuXHRcdFx0XHRkYXRhOiBbe1xyXG5cdFx0XHRcdFx0aWNvbjoge1xyXG5cdFx0XHRcdFx0XHRmYTogJ2ZhIGZhLWJvbGQnXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSwge1xyXG5cdFx0XHRcdFx0aWNvbjoge1xyXG5cdFx0XHRcdFx0XHRmYTogJ2ZhIGZhLWl0YWxpYydcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LCB7XHJcblx0XHRcdFx0XHRpY29uOiB7XHJcblx0XHRcdFx0XHRcdGZhOiAnZmEgZmEtaGVhZGluZydcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0ZGF0YTogW3tcclxuXHRcdFx0XHRcdGljb246IHtcclxuXHRcdFx0XHRcdFx0ZmE6ICdmYSBmYS1saW5rJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0sIHtcclxuXHRcdFx0XHRcdGljb246IHtcclxuXHRcdFx0XHRcdFx0ZmE6ICdmYSBmYS1pbWFnZSdcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XVxyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0ZGF0YTogW3tcclxuXHRcdFx0XHRcdFx0aWNvbjoge1xyXG5cdFx0XHRcdFx0XHRcdGZhOiAnZmEgZmEtbGlzdCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWNvbjoge1xyXG5cdFx0XHRcdFx0XHRcdGZhOiAnZmEgZmEtbGlzdC1vbCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWNvbjoge1xyXG5cdFx0XHRcdFx0XHRcdGZhOiAnZmEgZmEtY29kZSdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWNvbjoge1xyXG5cdFx0XHRcdFx0XHRcdGZhOiAnZmEgZmEtcXVvdGUtbGVmdCdcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSwge1xyXG5cdFx0XHRcdGRhdGE6IFt7XHJcblx0XHRcdFx0XHRpY29uOiB7XHJcblx0XHRcdFx0XHRcdGZhOiAnZmEgZmEtc2VhcmNoJ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1dXHJcblx0XHRcdH1dXHJcblx0XHRdXHJcblx0fTtcclxuXHJcblx0UGx1Z2luTWFya2Rvd25FZGl0b3IucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5NYXJrZG93bkVkaXRvci5kZWZhdWx0cywgb3B0cyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwubWFya2Rvd24oIHRoaXMub3B0aW9ucyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpbk1hcmtkb3duRWRpdG9yOiBQbHVnaW5NYXJrZG93bkVkaXRvclxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpbk1hcmtkb3duRWRpdG9yID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luTWFya2Rvd25FZGl0b3IoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBNYXNrZWQgSW5wdXRcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19tYXNrZWRJbnB1dCc7XHJcblxyXG5cdHZhciBQbHVnaW5NYXNrZWRJbnB1dCA9IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgkZWwsIG9wdHMpO1xyXG5cdH07XHJcblxyXG5cdFBsdWdpbk1hc2tlZElucHV0LmRlZmF1bHRzID0ge1xyXG5cdH07XHJcblxyXG5cdFBsdWdpbk1hc2tlZElucHV0LnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0XHRpZiAoICRlbC5kYXRhKCBpbnN0YW5jZU5hbWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0LmJ1aWxkKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgUGx1Z2luTWFza2VkSW5wdXQuZGVmYXVsdHMsIG9wdHMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLm1hc2soIHRoaXMuJGVsLmRhdGEoJ2lucHV0LW1hc2snKSwgdGhpcy5vcHRpb25zICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2UgdG8gc2NvcGVcclxuXHQkLmV4dGVuZCh0aGVtZSwge1xyXG5cdFx0UGx1Z2luTWFza2VkSW5wdXQ6IFBsdWdpbk1hc2tlZElucHV0XHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luTWFza2VkSW5wdXQgPSBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQbHVnaW5NYXNrZWRJbnB1dCgkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIE1heExlbmd0aFxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluc3RhbmNlTmFtZSA9ICdfX21heGxlbmd0aCc7XHJcblxyXG5cdHZhciBQbHVnaW5NYXhMZW5ndGggPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5NYXhMZW5ndGguZGVmYXVsdHMgPSB7XHJcblx0XHRhbHdheXNTaG93OiB0cnVlLFxyXG5cdFx0cGxhY2VtZW50OiAnYm90dG9tLWxlZnQnLFxyXG5cdFx0d2FybmluZ0NsYXNzOiAnYmFkZ2UgYmFkZ2Utc3VjY2VzcyBib3R0b20tbGVmdCcsXHJcblx0XHRsaW1pdFJlYWNoZWRDbGFzczogJ2JhZGdlIGJhZGdlLWRhbmdlciBib3R0b20tbGVmdCdcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5NYXhMZW5ndGgucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5NYXhMZW5ndGguZGVmYXVsdHMsIG9wdHMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLm1heGxlbmd0aCggdGhpcy5vcHRpb25zICk7XHJcblxyXG5cdFx0XHR0aGlzLiRlbC5vbignYmx1cicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdCQoJy5ib290c3RyYXAtbWF4bGVuZ3RoJykucmVtb3ZlKCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpbk1heExlbmd0aDogUGx1Z2luTWF4TGVuZ3RoXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luTWF4TGVuZ3RoID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luTWF4TGVuZ3RoKCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pO1xyXG5cclxuLy8gTXVsdGlTZWxlY3RcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19tdWx0aXNlbGVjdCc7XHJcblxyXG5cdHZhciBQbHVnaW5NdWx0aVNlbGVjdCA9IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgkZWwsIG9wdHMpO1xyXG5cdH07XHJcblxyXG5cdFBsdWdpbk11bHRpU2VsZWN0LmRlZmF1bHRzID0ge1xyXG5cdFx0dGVtcGxhdGVzOiB7XHJcblx0XHRcdGxpOiAnPGxpPjxhIGNsYXNzPVwiZHJvcGRvd24taXRlbVwiIHRhYmluZGV4PVwiMFwiPjxsYWJlbCBzdHlsZT1cImRpc3BsYXk6IGJsb2NrO1wiPjwvbGFiZWw+PC9hPjwvbGk+JyxcclxuXHRcdFx0ZmlsdGVyOiAnPGRpdiBjbGFzcz1cImlucHV0LWdyb3VwXCI+PHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1wcmVwZW5kXCI+PHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC10ZXh0XCI+PGkgY2xhc3M9XCJmYXMgZmEtc2VhcmNoXCI+PC9pPjwvc3Bhbj48L3NwYW4+PGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sIG11bHRpc2VsZWN0LXNlYXJjaFwiIHR5cGU9XCJ0ZXh0XCI+PC9kaXY+J1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdFBsdWdpbk11bHRpU2VsZWN0LnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0XHRpZiAoICRlbC5kYXRhKCBpbnN0YW5jZU5hbWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0LmJ1aWxkKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgUGx1Z2luTXVsdGlTZWxlY3QuZGVmYXVsdHMsIG9wdHMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLm11bHRpc2VsZWN0KCB0aGlzLm9wdGlvbnMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5NdWx0aVNlbGVjdDogUGx1Z2luTXVsdGlTZWxlY3RcclxuXHR9KTtcclxuXHJcblx0Ly8ganF1ZXJ5IHBsdWdpblxyXG5cdCQuZm4udGhlbWVQbHVnaW5NdWx0aVNlbGVjdCA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpbk11bHRpU2VsZWN0KCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pO1xyXG5cclxuLy8gTm90aWZpY2F0aW9ucyAtIENvbmZpZ1xyXG4oZnVuY3Rpb24oJCkge1xyXG5cclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8vIHVzZSBmb250IGF3ZXNvbWUgaWNvbnMgaWYgYXZhaWxhYmxlXHJcblx0aWYgKCB0eXBlb2YgUE5vdGlmeSAhPSAndW5kZWZpbmVkJyApIHtcclxuXHRcdFBOb3RpZnkucHJvdG90eXBlLm9wdGlvbnMuc3R5bGluZyA9IFwiZm9udGF3ZXNvbWVcIjtcclxuXHJcblx0XHQkLmV4dGVuZCh0cnVlLCBQTm90aWZ5LnByb3RvdHlwZS5vcHRpb25zLCB7XHJcblx0XHRcdHNoYWRvdzogZmFsc2UsXHJcblx0XHRcdHN0YWNrOiB7XHJcblx0XHRcdFx0c3BhY2luZzE6IDE1LFxyXG5cdCAgICAgICAgXHRzcGFjaW5nMjogMTVcclxuICAgICAgICBcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdCQuZXh0ZW5kKFBOb3RpZnkuc3R5bGluZy5mb250YXdlc29tZSwge1xyXG5cdFx0XHQvLyBjbGFzc2VzXHJcblx0XHRcdGNvbnRhaW5lcjogXCJub3RpZmljYXRpb25cIixcclxuXHRcdFx0bm90aWNlOiBcIm5vdGlmaWNhdGlvbi13YXJuaW5nXCIsXHJcblx0XHRcdGluZm86IFwibm90aWZpY2F0aW9uLWluZm9cIixcclxuXHRcdFx0c3VjY2VzczogXCJub3RpZmljYXRpb24tc3VjY2Vzc1wiLFxyXG5cdFx0XHRlcnJvcjogXCJub3RpZmljYXRpb24tZGFuZ2VyXCIsXHJcblxyXG5cdFx0XHQvLyBpY29uc1xyXG5cdFx0XHRub3RpY2VfaWNvbjogXCJmYXMgZmEtZXhjbGFtYXRpb25cIixcclxuXHRcdFx0aW5mb19pY29uOiBcImZhcyBmYS1pbmZvXCIsXHJcblx0XHRcdHN1Y2Nlc3NfaWNvbjogXCJmYXMgZmEtY2hlY2tcIixcclxuXHRcdFx0ZXJyb3JfaWNvbjogXCJmYXMgZmEtdGltZXNcIlxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gUG9ydGxldHNcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19wb3J0bGV0JyxcclxuXHRcdHN0b3JhZ2VPcmRlcktleSA9ICdfX3BvcnRsZXRPcmRlcicsXHJcblx0XHRzdG9yYWdlU3RhdGVLZXkgPSAnX19wb3J0bGV0U3RhdGUnO1xyXG5cclxuXHR2YXIgUGx1Z2luUG9ydGxldCA9IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuaW5pdGlhbGl6ZSgkZWwsIG9wdHMpO1xyXG5cdH07XHJcblxyXG5cdFBsdWdpblBvcnRsZXQuZGVmYXVsdHMgPSB7XHJcblx0XHRjb25uZWN0V2l0aDogJ1tkYXRhLXBsdWdpbi1wb3J0bGV0XScsXHJcblx0XHRpdGVtczogJ1tkYXRhLXBvcnRsZXQtaXRlbV0nLFxyXG5cdFx0aGFuZGxlOiAnLnBvcnRsZXQtaGFuZGxlcicsXHJcblx0XHRvcGFjaXR5OiAwLjcsXHJcblx0XHRwbGFjZWhvbGRlcjogJ3BvcnRsZXQtcGxhY2Vob2xkZXInLFxyXG5cdFx0Y2FuY2VsOiAncG9ydGxldC1jYW5jZWwnLFxyXG5cdFx0Zm9yY2VQbGFjZWhvbGRlclNpemU6IHRydWUsXHJcblx0XHRmb3JjZUhlbHBlclNpemU6IHRydWUsXHJcblx0XHR0b2xlcmFuY2U6ICdwb2ludGVyJyxcclxuXHRcdGhlbHBlcjogJ29yaWdpbmFsJyxcclxuXHRcdHJldmVydDogMjAwXHJcblx0fTtcclxuXHJcblx0UGx1Z2luUG9ydGxldC5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIFBsdWdpblBvcnRsZXQuZGVmYXVsdHMsIG9wdHMsIHtcclxuXHRcdFx0XHR3cmFwcGVyOiB0aGlzLiRlbCxcclxuXHRcdFx0XHR1cGRhdGU6IF9zZWxmLm9uVXBkYXRlLFxyXG5cdFx0XHRcdGNyZWF0ZTogX3NlbGYub25Mb2FkXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uVXBkYXRlOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuXHRcdFx0dmFyIGtleSA9IHN0b3JhZ2VPcmRlcktleSxcclxuXHRcdFx0XHRkYXRhID0gc3RvcmUuZ2V0KGtleSksXHJcblx0XHRcdFx0JHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHBvcmxldElkID0gJHRoaXMucHJvcCgnaWQnKTtcclxuXHJcblx0XHRcdGlmICghZGF0YSkge1xyXG5cdFx0XHRcdGRhdGEgPSB7fTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCEhcG9ybGV0SWQpIHtcclxuXHRcdFx0XHRkYXRhW3BvcmxldElkXSA9ICR0aGlzLnNvcnRhYmxlKCd0b0FycmF5Jyk7XHJcblx0XHRcdFx0c3RvcmUuc2V0KGtleSwgZGF0YSk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0b25Mb2FkOiBmdW5jdGlvbihldmVudCwgdWkpIHtcclxuXHRcdFx0dmFyIGtleSA9IHN0b3JhZ2VPcmRlcktleSxcclxuXHRcdFx0XHRkYXRhID0gc3RvcmUuZ2V0KGtleSksXHJcblx0XHRcdFx0JHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdHBvcmxldElkID0gJHRoaXMucHJvcCgnaWQnKSxcclxuXHRcdFx0XHRwb3J0bGV0ID0gJCgnIycgKyBwb3JsZXRJZCk7XHJcblxyXG5cdFx0XHRpZiAoISFkYXRhKSB7XHJcblx0XHRcdFx0dmFyIGNhcmRzID0gZGF0YVtwb3JsZXRJZF07XHJcblxyXG5cdFx0XHRcdGlmICghIWNhcmRzKSB7XHJcblx0XHRcdFx0XHQkLmVhY2goY2FyZHMsIGZ1bmN0aW9uKGluZGV4LCBwYW5lbElkKSB7XHJcblx0XHRcdFx0XHRcdCQoJyMnICsgcGFuZWxJZCkuYXBwZW5kVG8ocG9ydGxldCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0c2F2ZVN0YXRlOiBmdW5jdGlvbiggcGFuZWwgKSB7XHJcblx0XHRcdHZhciBrZXkgPSBzdG9yYWdlU3RhdGVLZXksXHJcblx0XHRcdFx0ZGF0YSA9IHN0b3JlLmdldChrZXkpLFxyXG5cdFx0XHRcdHBhbmVsSWQgPSBwYW5lbC5wcm9wKCdpZCcpO1xyXG5cclxuXHRcdFx0aWYgKCFkYXRhKSB7XHJcblx0XHRcdFx0ZGF0YSA9IHt9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXBhbmVsSWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGNvbGxhcHNlID0gcGFuZWwuZmluZCgnLmNhcmQtYWN0aW9ucycpLmNoaWxkcmVuKCdhLmZhLWNhcmV0LXVwLCBhLmZhLWNhcmV0LWRvd24nKSxcclxuXHRcdFx0XHRpc0NvbGxhcHNlZCA9ICEhY29sbGFwc2UuaGFzQ2xhc3MoJ2ZhLWNhcmV0LXVwJyksXHJcblx0XHRcdFx0aXNSZW1vdmVkID0gIXBhbmVsLmNsb3Nlc3QoJ2JvZHknKS5nZXQoMCk7XHJcblxyXG5cdFx0XHRpZiAoaXNSZW1vdmVkKSB7XHJcblx0XHRcdFx0ZGF0YVtwYW5lbElkXSA9ICdyZW1vdmVkJztcclxuXHRcdFx0fSBlbHNlIGlmIChpc0NvbGxhcHNlZCkge1xyXG5cdFx0XHRcdGRhdGFbcGFuZWxJZF0gPSAnY29sbGFwc2VkJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkZWxldGUgZGF0YVtwYW5lbElkXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3RvcmUuc2V0KGtleSwgZGF0YSk7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRsb2FkU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIga2V5ID0gc3RvcmFnZVN0YXRlS2V5LFxyXG5cdFx0XHRcdGRhdGEgPSBzdG9yZS5nZXQoa2V5KTtcclxuXHJcblx0XHRcdGlmICghIWRhdGEpIHtcclxuXHRcdFx0XHQkLmVhY2goZGF0YSwgZnVuY3Rpb24ocGFuZWxJZCwgc3RhdGUpIHtcclxuXHRcdFx0XHRcdHZhciBwYW5lbCA9ICQoJyMnICsgcGFuZWxJZCk7XHJcblx0XHRcdFx0XHRpZiAoIXBhbmVsLmRhdGEoJ3BvcnRsZXQtc3RhdGUtbG9hZGVkJykpIHtcclxuXHRcdFx0XHRcdFx0aWYgKHN0YXRlID09ICdjb2xsYXBzZWQnKSB7XHJcblx0XHRcdFx0XHRcdFx0cGFuZWwuZmluZCgnLmNhcmQtYWN0aW9ucyBhLmZhLWNhcmV0LWRvd24nKS50cmlnZ2VyKCdjbGljaycpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKHN0YXRlID09ICdyZW1vdmVkJykge1xyXG5cdFx0XHRcdFx0XHRcdHBhbmVsLmZpbmQoJy5jYXJkLWFjdGlvbnMgYS5mYS10aW1lcycpLnRyaWdnZXIoJ2NsaWNrJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cGFuZWwuZGF0YSgncG9ydGxldC1zdGF0ZS1sb2FkZWQnLCB0cnVlKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmICggJC5pc0Z1bmN0aW9uKCAkLmZuLnNvcnRhYmxlICkgKSB7XHJcblx0XHRcdFx0dGhpcy4kZWwuc29ydGFibGUoIHRoaXMub3B0aW9ucyApO1xyXG5cdFx0XHRcdHRoaXMuJGVsLmZpbmQoJ1tkYXRhLXBvcnRsZXQtaXRlbV0nKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0X3NlbGYuZXZlbnRzKCAkKHRoaXMpICk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHZhciBwb3J0bGV0ID0gdGhpcy4kZWw7XHJcblx0XHRcdHBvcnRsZXQuY3NzKCdtaW4taGVpZ2h0JywgMTUwKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRldmVudHM6IGZ1bmN0aW9uKCRlbCkge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdHBvcnRsZXQgPSAkZWwuY2xvc2VzdCgnW2RhdGEtcGx1Z2luLXBvcnRsZXRdJyk7XHJcblxyXG5cdFx0XHR0aGlzLmxvYWRTdGF0ZSgpO1xyXG5cclxuXHRcdFx0JGVsLmZpbmQoJy5jYXJkLWFjdGlvbnMnKS5vbiggJ2NsaWNrJywgJ2EuZmEtY2FyZXQtdXAsIGEuZmEtY2FyZXQtZG93biwgYS5mYS10aW1lcycsIGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRfc2VsZi5zYXZlU3RhdGUoICRlbCApO1xyXG5cdFx0XHRcdH0sIDI1MCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpblBvcnRsZXQ6IFBsdWdpblBvcnRsZXRcclxuXHR9KTtcclxuXHJcblx0Ly8ganF1ZXJ5IHBsdWdpblxyXG5cdCQuZm4udGhlbWVQbHVnaW5Qb3J0bGV0ID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQbHVnaW5Qb3J0bGV0KCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pO1xyXG5cclxuLy8gU2Nyb2xsIHRvIFRvcFxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHJcblx0XHRQbHVnaW5TY3JvbGxUb1RvcDoge1xyXG5cclxuXHRcdFx0ZGVmYXVsdHM6IHtcclxuXHRcdFx0XHR3cmFwcGVyOiAkKCdib2R5JyksXHJcblx0XHRcdFx0b2Zmc2V0OiAxNTAsXHJcblx0XHRcdFx0YnV0dG9uQ2xhc3M6ICdzY3JvbGwtdG8tdG9wJyxcclxuXHRcdFx0XHRpY29uQ2xhc3M6ICdmYXMgZmEtY2hldnJvbi11cCcsXHJcblx0XHRcdFx0ZGVsYXk6IDUwMCxcclxuXHRcdFx0XHR2aXNpYmxlTW9iaWxlOiBmYWxzZSxcclxuXHRcdFx0XHRsYWJlbDogZmFsc2VcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0XHRpbml0aWFsaXplZCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdHRoaXNcclxuXHRcdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0XHQuYnVpbGQoKVxyXG5cdFx0XHRcdFx0LmV2ZW50cygpO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5kZWZhdWx0cywgb3B0cyk7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBzZWxmID0gdGhpcyxcclxuXHRcdFx0XHRcdCRlbDtcclxuXHJcblx0XHRcdFx0Ly8gQmFzZSBIVE1MIE1hcmt1cFxyXG5cdFx0XHRcdCRlbCA9ICQoJzxhIC8+JylcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyhzZWxmLm9wdGlvbnMuYnV0dG9uQ2xhc3MpXHJcblx0XHRcdFx0XHQuYXR0cih7XHJcblx0XHRcdFx0XHRcdCdocmVmJzogJyMnLFxyXG5cdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdC5hcHBlbmQoXHJcblx0XHRcdFx0XHRcdCQoJzxpIC8+JylcclxuXHRcdFx0XHRcdFx0LmFkZENsYXNzKHNlbGYub3B0aW9ucy5pY29uQ2xhc3MpXHJcblx0XHRcdFx0KTtcclxuXHJcblx0XHRcdFx0Ly8gVmlzaWJsZSBNb2JpbGVcclxuXHRcdFx0XHRpZiAoIXNlbGYub3B0aW9ucy52aXNpYmxlTW9iaWxlKSB7XHJcblx0XHRcdFx0XHQkZWwuYWRkQ2xhc3MoJ2hpZGRlbi1tb2JpbGUnKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIExhYmVsXHJcblx0XHRcdFx0aWYgKHNlbGYub3B0aW9ucy5sYWJlbCkge1xyXG5cdFx0XHRcdFx0JGVsLmFwcGVuZChcclxuXHRcdFx0XHRcdFx0JCgnPHNwYW4gLz4nKS5odG1sKHNlbGYub3B0aW9ucy5sYWJlbClcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0aGlzLm9wdGlvbnMud3JhcHBlci5hcHBlbmQoJGVsKTtcclxuXHJcblx0XHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cclxuXHRcdFx0ZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0XHRfaXNTY3JvbGxpbmcgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0Ly8gQ2xpY2sgRWxlbWVudCBBY3Rpb25cclxuXHRcdFx0XHRzZWxmLiRlbC5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHQkKCdib2R5LCBodG1sJykuYW5pbWF0ZSh7XHJcblx0XHRcdFx0XHRcdHNjcm9sbFRvcDogMFxyXG5cdFx0XHRcdFx0fSwgc2VsZi5vcHRpb25zLmRlbGF5KTtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0Ly8gU2hvdy9IaWRlIEJ1dHRvbiBvbiBXaW5kb3cgU2Nyb2xsIGV2ZW50LlxyXG5cdFx0XHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFfaXNTY3JvbGxpbmcpIHtcclxuXHJcblx0XHRcdFx0XHRcdF9pc1Njcm9sbGluZyA9IHRydWU7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoJCh3aW5kb3cpLnNjcm9sbFRvcCgpID4gc2VsZi5vcHRpb25zLm9mZnNldCkge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRzZWxmLiRlbC5zdG9wKHRydWUsIHRydWUpLmFkZENsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRcdFx0X2lzU2Nyb2xsaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0XHRzZWxmLiRlbC5zdG9wKHRydWUsIHRydWUpLnJlbW92ZUNsYXNzKCd2aXNpYmxlJyk7XHJcblx0XHRcdFx0XHRcdFx0X2lzU2Nyb2xsaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBTY3JvbGxhYmxlXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fc2Nyb2xsYWJsZSc7XHJcblxyXG5cdHZhciBQbHVnaW5TY3JvbGxhYmxlID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luU2Nyb2xsYWJsZS51cGRhdGVNb2RhbHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFBsdWdpblNjcm9sbGFibGUudXBkYXRlQm9vdHN0cmFwTW9kYWwoKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5TY3JvbGxhYmxlLnVwZGF0ZUJvb3RzdHJhcE1vZGFsID0gZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdXBkYXRlQm9vc3RyYXBNb2RhbDtcclxuXHJcblx0XHR1cGRhdGVCb29zdHJhcE1vZGFsID0gdHlwZW9mICQuZm4ubW9kYWwgIT09ICd1bmRlZmluZWQnO1xyXG5cdFx0dXBkYXRlQm9vc3RyYXBNb2RhbCA9IHVwZGF0ZUJvb3N0cmFwTW9kYWwgJiYgdHlwZW9mICQuZm4ubW9kYWwuQ29uc3RydWN0b3IgIT09ICd1bmRlZmluZWQnO1xyXG5cdFx0dXBkYXRlQm9vc3RyYXBNb2RhbCA9IHVwZGF0ZUJvb3N0cmFwTW9kYWwgJiYgdHlwZW9mICQuZm4ubW9kYWwuQ29uc3RydWN0b3IucHJvdG90eXBlICE9PSAndW5kZWZpbmVkJztcclxuXHRcdHVwZGF0ZUJvb3N0cmFwTW9kYWwgPSB1cGRhdGVCb29zdHJhcE1vZGFsICYmIHR5cGVvZiAkLmZuLm1vZGFsLkNvbnN0cnVjdG9yLnByb3RvdHlwZS5lbmZvcmNlRm9jdXMgIT09ICd1bmRlZmluZWQnO1xyXG5cclxuXHRcdGlmICggIXVwZGF0ZUJvb3N0cmFwTW9kYWwgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgb3JpZ2luYWxGb2N1cyA9ICQuZm4ubW9kYWwuQ29uc3RydWN0b3IucHJvdG90eXBlLmVuZm9yY2VGb2N1cztcclxuXHRcdCQuZm4ubW9kYWwuQ29uc3RydWN0b3IucHJvdG90eXBlLmVuZm9yY2VGb2N1cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRvcmlnaW5hbEZvY3VzLmFwcGx5KCB0aGlzICk7XHJcblxyXG5cdFx0XHR2YXIgJHNjcm9sbGFibGUgPSB0aGlzLiRlbGVtZW50LmZpbmQoJy5zY3JvbGxhYmxlJyk7XHJcblx0XHRcdGlmICggJHNjcm9sbGFibGUgKSB7XHJcblx0XHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oJC5mblsndGhlbWVQbHVnaW5TY3JvbGxhYmxlJ10pICApIHtcclxuXHRcdFx0XHRcdCRzY3JvbGxhYmxlLnRoZW1lUGx1Z2luU2Nyb2xsYWJsZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oJC5mblsnbmFub1Njcm9sbGVyJ10pICkge1xyXG5cdFx0XHRcdFx0JHNjcm9sbGFibGUubmFub1Njcm9sbGVyKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdFBsdWdpblNjcm9sbGFibGUuZGVmYXVsdHMgPSB7XHJcblx0XHRjb250ZW50Q2xhc3M6ICdzY3JvbGxhYmxlLWNvbnRlbnQnLFxyXG5cdFx0cGFuZUNsYXNzOiAnc2Nyb2xsYWJsZS1wYW5lJyxcclxuXHRcdHNsaWRlckNsYXNzOiAnc2Nyb2xsYWJsZS1zbGlkZXInLFxyXG5cdFx0YWx3YXlzVmlzaWJsZTogdHJ1ZSxcclxuXHRcdHByZXZlbnRQYWdlU2Nyb2xsaW5nOiB0cnVlXHJcblx0fTtcclxuXHJcblx0UGx1Z2luU2Nyb2xsYWJsZS5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgUGx1Z2luU2Nyb2xsYWJsZS5kZWZhdWx0cywgb3B0cywge1xyXG5cdFx0XHRcdHdyYXBwZXI6IHRoaXMuJGVsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zLndyYXBwZXIubmFub1Njcm9sbGVyKHRoaXMub3B0aW9ucyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2UgdG8gc2NvcGVcclxuXHQkLmV4dGVuZCh0aGVtZSwge1xyXG5cdFx0UGx1Z2luU2Nyb2xsYWJsZTogUGx1Z2luU2Nyb2xsYWJsZVxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpblNjcm9sbGFibGUgPSBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQbHVnaW5TY3JvbGxhYmxlKCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH07XHJcblxyXG5cdCQoZnVuY3Rpb24oKSB7XHJcblx0XHRQbHVnaW5TY3JvbGxhYmxlLnVwZGF0ZU1vZGFscygpO1xyXG5cdH0pO1xyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBTZWxlY3QyXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fc2VsZWN0Mic7XHJcblxyXG5cdHZhciBQbHVnaW5TZWxlY3QyID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luU2VsZWN0Mi5kZWZhdWx0cyA9IHtcclxuXHRcdHRoZW1lOiAnYm9vdHN0cmFwJ1xyXG5cdH07XHJcblxyXG5cdFBsdWdpblNlbGVjdDIucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5TZWxlY3QyLmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5zZWxlY3QyKCB0aGlzLm9wdGlvbnMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5TZWxlY3QyOiBQbHVnaW5TZWxlY3QyXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luU2VsZWN0MiA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpblNlbGVjdDIoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBTbGlkZXJcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19zbGlkZXInO1xyXG5cclxuXHR2YXIgUGx1Z2luU2xpZGVyID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luU2xpZGVyLmRlZmF1bHRzID0ge1xyXG5cclxuXHR9O1xyXG5cclxuXHRQbHVnaW5TbGlkZXIucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0VmFycygpXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0LmJ1aWxkKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0VmFyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkb3V0cHV0ID0gJCggdGhpcy4kZWwuZGF0YSgncGx1Z2luLXNsaWRlci1vdXRwdXQnKSApO1xyXG5cdFx0XHR0aGlzLiRvdXRwdXQgPSAkb3V0cHV0LmdldCgwKSA/ICRvdXRwdXQgOiBudWxsO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCggdHJ1ZSwge30sIFBsdWdpblNsaWRlci5kZWZhdWx0cywgb3B0cyApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLiRvdXRwdXQgKSB7XHJcblx0XHRcdFx0JC5leHRlbmQoIHRoaXMub3B0aW9ucywge1xyXG5cdFx0XHRcdFx0c2xpZGU6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcblx0XHRcdFx0XHRcdF9zZWxmLm9uU2xpZGUoIGV2ZW50LCB1aSApO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5zbGlkZXIoIHRoaXMub3B0aW9ucyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uU2xpZGU6IGZ1bmN0aW9uKCBldmVudCwgdWkgKSB7XHJcblx0XHRcdGlmICggIXVpLnZhbHVlcyApIHtcclxuXHRcdFx0XHR0aGlzLiRvdXRwdXQudmFsKCB1aS52YWx1ZSApO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuJG91dHB1dC52YWwoIHVpLnZhbHVlc1sgMCBdICsgJy8nICsgdWkudmFsdWVzWyAxIF0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kb3V0cHV0LnRyaWdnZXIoJ2NoYW5nZScpO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5TbGlkZXI6IFBsdWdpblNsaWRlclxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpblNsaWRlciA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpblNsaWRlcigkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIFNwaW5uZXJcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX19zcGlubmVyJztcclxuXHJcblx0dmFyIFBsdWdpblNwaW5uZXIgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5TcGlubmVyLmRlZmF1bHRzID0ge1xyXG5cdH07XHJcblxyXG5cdFBsdWdpblNwaW5uZXIucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5TcGlubmVyLmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5zcGlubmVyKCB0aGlzLm9wdGlvbnMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdC8vIGV4cG9zZSB0byBzY29wZVxyXG5cdCQuZXh0ZW5kKHRoZW1lLCB7XHJcblx0XHRQbHVnaW5TcGlubmVyOiBQbHVnaW5TcGlubmVyXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luU3Bpbm5lciA9IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XHJcblxyXG5cdFx0XHRpZiAoJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpKSB7XHJcblx0XHRcdFx0cmV0dXJuICR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFBsdWdpblNwaW5uZXIoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBTdW1tZXJOb3RlXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fc3VtbWVybm90ZSc7XHJcblxyXG5cdHZhciBQbHVnaW5TdW1tZXJOb3RlID0gZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCRlbCwgb3B0cyk7XHJcblx0fTtcclxuXHJcblx0UGx1Z2luU3VtbWVyTm90ZS5kZWZhdWx0cyA9IHtcclxuXHRcdG9uZm9jdXM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy5ub3RlLWVkaXRvcicgKS5hZGRDbGFzcyggJ2FjdGl2ZScgKTtcclxuXHRcdH0sXHJcblx0XHRvbmJsdXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCB0aGlzICkuY2xvc2VzdCggJy5ub3RlLWVkaXRvcicgKS5yZW1vdmVDbGFzcyggJ2FjdGl2ZScgKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRQbHVnaW5TdW1tZXJOb3RlLnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0XHRpZiAoICRlbC5kYXRhKCBpbnN0YW5jZU5hbWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0LmJ1aWxkKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgUGx1Z2luU3VtbWVyTm90ZS5kZWZhdWx0cywgb3B0cyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuc3VtbWVybm90ZSggdGhpcy5vcHRpb25zICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2UgdG8gc2NvcGVcclxuXHQkLmV4dGVuZCh0aGVtZSwge1xyXG5cdFx0UGx1Z2luU3VtbWVyTm90ZTogUGx1Z2luU3VtbWVyTm90ZVxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpblN1bW1lck5vdGUgPSBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQbHVnaW5TdW1tZXJOb3RlKCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pO1xyXG5cclxuLy8gVGV4dEFyZWEgQXV0b1NpemVcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX190ZXh0YXJlYUF1dG9zaXplJztcclxuXHJcblx0dmFyIFBsdWdpblRleHRBcmVhQXV0b1NpemUgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5UZXh0QXJlYUF1dG9TaXplLmRlZmF1bHRzID0ge1xyXG5cdH07XHJcblxyXG5cdFBsdWdpblRleHRBcmVhQXV0b1NpemUucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmIChpbml0aWFsaXplZCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQoIHRydWUsIHt9LCBQbHVnaW5UZXh0QXJlYUF1dG9TaXplLmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0YXV0b3NpemUoJCh0aGlzLiRlbCkpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpblRleHRBcmVhQXV0b1NpemU6IFBsdWdpblRleHRBcmVhQXV0b1NpemVcclxuXHR9KTtcclxuXHJcblx0Ly8ganF1ZXJ5IHBsdWdpblxyXG5cdCQuZm4udGhlbWVQbHVnaW5UZXh0QXJlYUF1dG9TaXplID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luVGV4dEFyZWFBdXRvU2l6ZSgkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIFRpbWVQaWNrZXJcclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdHRoZW1lID0gdGhlbWUgfHwge307XHJcblxyXG5cdHZhciBpbnN0YW5jZU5hbWUgPSAnX190aW1lcGlja2VyJztcclxuXHJcblx0dmFyIFBsdWdpblRpbWVQaWNrZXIgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5UaW1lUGlja2VyLmRlZmF1bHRzID0ge1xyXG5cdFx0ZGlzYWJsZU1vdXNld2hlZWw6IHRydWUsXHJcblx0XHRpY29uczoge1xyXG5cdFx0XHR1cDogJ2ZhcyBmYS1jaGV2cm9uLXVwJyxcclxuXHRcdFx0ZG93bjogJ2ZhcyBmYS1jaGV2cm9uLWRvd24nXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0UGx1Z2luVGltZVBpY2tlci5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCggdHJ1ZSwge30sIFBsdWdpblRpbWVQaWNrZXIuZGVmYXVsdHMsIG9wdHMgKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLnRpbWVwaWNrZXIoIHRoaXMub3B0aW9ucyApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpblRpbWVQaWNrZXI6IFBsdWdpblRpbWVQaWNrZXJcclxuXHR9KTtcclxuXHJcblx0Ly8ganF1ZXJ5IHBsdWdpblxyXG5cdCQuZm4udGhlbWVQbHVnaW5UaW1lUGlja2VyID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luVGltZVBpY2tlcigkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIFRvZ2dsZVxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluc3RhbmNlTmFtZSA9ICdfX3RvZ2dsZSc7XHJcblxyXG5cdHZhciBQbHVnaW5Ub2dnbGUgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5Ub2dnbGUuZGVmYXVsdHMgPSB7XHJcblx0XHRkdXJhdGlvbjogMzUwLFxyXG5cdFx0aXNBY2NvcmRpb246IGZhbHNlLFxyXG5cdFx0YWRkSWNvbnM6IHRydWVcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5Ub2dnbGUucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIFBsdWdpblRvZ2dsZS5kZWZhdWx0cywgb3B0cywge1xyXG5cdFx0XHRcdHdyYXBwZXI6IHRoaXMuJGVsXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdCR3cmFwcGVyID0gdGhpcy5vcHRpb25zLndyYXBwZXIsXHJcblx0XHRcdFx0JGl0ZW1zID0gJHdyYXBwZXIuZmluZCgnLnRvZ2dsZScpLFxyXG5cdFx0XHRcdCRlbCA9IG51bGw7XHJcblxyXG5cdFx0XHQkaXRlbXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkZWwgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0XHRpZihzZWxmLm9wdGlvbnMuYWRkSWNvbnMpIHtcclxuXHRcdFx0XHRcdCRlbC5maW5kKCc+IGxhYmVsJykucHJlcGVuZChcclxuXHRcdFx0XHRcdFx0JCgnPGkgLz4nKS5hZGRDbGFzcygnZmFzIGZhLXBsdXMnKSxcclxuXHRcdFx0XHRcdFx0JCgnPGkgLz4nKS5hZGRDbGFzcygnZmFzIGZhLW1pbnVzJylcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZigkZWwuaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcblx0XHRcdFx0XHQkZWwuZmluZCgnPiBwJykuYWRkQ2xhc3MoJ3ByZXZpZXctYWN0aXZlJyk7XHJcblx0XHRcdFx0XHQkZWwuZmluZCgnPiAudG9nZ2xlLWNvbnRlbnQnKS5zbGlkZURvd24oc2VsZi5vcHRpb25zLmR1cmF0aW9uKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHNlbGYuZXZlbnRzKCRlbCk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0aWYoc2VsZi5vcHRpb25zLmlzQWNjb3JkaW9uKSB7XHJcblx0XHRcdFx0c2VsZi5vcHRpb25zLmR1cmF0aW9uID0gc2VsZi5vcHRpb25zLmR1cmF0aW9uLzI7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRldmVudHM6IGZ1bmN0aW9uKCRlbCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0cHJldmlld1BhckN1cnJlbnRIZWlnaHQgPSAwLFxyXG5cdFx0XHRcdHByZXZpZXdQYXJBbmltYXRlSGVpZ2h0ID0gMCxcclxuXHRcdFx0XHR0b2dnbGVDb250ZW50ID0gbnVsbDtcclxuXHJcblx0XHRcdCRlbC5maW5kKCc+IGxhYmVsJykuY2xpY2soZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxyXG5cdFx0XHRcdFx0cGFyZW50U2VjdGlvbiA9ICR0aGlzLnBhcmVudCgpLFxyXG5cdFx0XHRcdFx0cGFyZW50V3JhcHBlciA9ICR0aGlzLnBhcmVudHMoJy50b2dnbGUnKSxcclxuXHRcdFx0XHRcdHByZXZpZXdQYXIgPSBudWxsLFxyXG5cdFx0XHRcdFx0Y2xvc2VFbGVtZW50ID0gbnVsbDtcclxuXHJcblx0XHRcdFx0aWYoc2VsZi5vcHRpb25zLmlzQWNjb3JkaW9uICYmIHR5cGVvZihlLm9yaWdpbmFsRXZlbnQpICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0XHRjbG9zZUVsZW1lbnQgPSBwYXJlbnRXcmFwcGVyLmZpbmQoJy50b2dnbGUuYWN0aXZlID4gbGFiZWwnKTtcclxuXHJcblx0XHRcdFx0XHRpZihjbG9zZUVsZW1lbnRbMF0gPT0gJHRoaXNbMF0pIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cGFyZW50U2VjdGlvbi50b2dnbGVDbGFzcygnYWN0aXZlJyk7XHJcblxyXG5cdFx0XHRcdC8vIFByZXZpZXcgUGFyYWdyYXBoXHJcblx0XHRcdFx0aWYocGFyZW50U2VjdGlvbi5maW5kKCc+IHAnKS5nZXQoMCkpIHtcclxuXHJcblx0XHRcdFx0XHRwcmV2aWV3UGFyID0gcGFyZW50U2VjdGlvbi5maW5kKCc+IHAnKTtcclxuXHRcdFx0XHRcdHByZXZpZXdQYXJDdXJyZW50SGVpZ2h0ID0gcHJldmlld1Bhci5jc3MoJ2hlaWdodCcpO1xyXG5cdFx0XHRcdFx0cHJldmlld1Bhci5jc3MoJ2hlaWdodCcsICdhdXRvJyk7XHJcblx0XHRcdFx0XHRwcmV2aWV3UGFyQW5pbWF0ZUhlaWdodCA9IHByZXZpZXdQYXIuY3NzKCdoZWlnaHQnKTtcclxuXHRcdFx0XHRcdHByZXZpZXdQYXIuY3NzKCdoZWlnaHQnLCBwcmV2aWV3UGFyQ3VycmVudEhlaWdodCk7XHJcblxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gQ29udGVudFxyXG5cdFx0XHRcdHRvZ2dsZUNvbnRlbnQgPSBwYXJlbnRTZWN0aW9uLmZpbmQoJz4gLnRvZ2dsZS1jb250ZW50Jyk7XHJcblxyXG5cdFx0XHRcdGlmKHBhcmVudFNlY3Rpb24uaGFzQ2xhc3MoJ2FjdGl2ZScpKSB7XHJcblxyXG5cdFx0XHRcdFx0JChwcmV2aWV3UGFyKS5hbmltYXRlKHtcclxuXHRcdFx0XHRcdFx0aGVpZ2h0OiBwcmV2aWV3UGFyQW5pbWF0ZUhlaWdodFxyXG5cdFx0XHRcdFx0fSwgc2VsZi5vcHRpb25zLmR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5hZGRDbGFzcygncHJldmlldy1hY3RpdmUnKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHRvZ2dsZUNvbnRlbnQuc2xpZGVEb3duKHNlbGYub3B0aW9ucy5kdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGlmKGNsb3NlRWxlbWVudCkge1xyXG5cdFx0XHRcdFx0XHRcdGNsb3NlRWxlbWVudC50cmlnZ2VyKCdjbGljaycpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQkKHByZXZpZXdQYXIpLmFuaW1hdGUoe1xyXG5cdFx0XHRcdFx0XHRoZWlnaHQ6IDBcclxuXHRcdFx0XHRcdH0sIHNlbGYub3B0aW9ucy5kdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdCQodGhpcykucmVtb3ZlQ2xhc3MoJ3ByZXZpZXctYWN0aXZlJyk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHR0b2dnbGVDb250ZW50LnNsaWRlVXAoc2VsZi5vcHRpb25zLmR1cmF0aW9uKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpblRvZ2dsZTogUGx1Z2luVG9nZ2xlXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luVG9nZ2xlID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBQbHVnaW5Ub2dnbGUoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBXaWRnZXQgLSBUb2RvXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fd2lkZ2V0VG9kb0xpc3QnO1xyXG5cclxuXHR2YXIgV2lkZ2V0VG9kb0xpc3QgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRXaWRnZXRUb2RvTGlzdC5kZWZhdWx0cyA9IHtcclxuXHR9O1xyXG5cclxuXHRXaWRnZXRUb2RvTGlzdC5wcm90b3R5cGUgPSB7XHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdFx0aWYgKCAkZWwuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJGVsID0gJGVsO1xyXG5cclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXREYXRhKClcclxuXHRcdFx0XHQuc2V0T3B0aW9ucyhvcHRzKVxyXG5cdFx0XHRcdC5idWlsZCgpXHJcblx0XHRcdFx0LmV2ZW50cygpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRlbC5kYXRhKGluc3RhbmNlTmFtZSwgdGhpcyk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0T3B0aW9uczogZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0XHR0aGlzLm9wdGlvbnMgPSAkLmV4dGVuZCggdHJ1ZSwge30sIFdpZGdldFRvZG9MaXN0LmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0Y2hlY2s6IGZ1bmN0aW9uKCBpbnB1dCwgbGFiZWwgKSB7XHJcblx0XHRcdGlmICggaW5wdXQuaXMoJzpjaGVja2VkJykgKSB7XHJcblx0XHRcdFx0bGFiZWwuYWRkQ2xhc3MoJ2xpbmUtdGhyb3VnaCcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxhYmVsLnJlbW92ZUNsYXNzKCdsaW5lLXRocm91Z2gnKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBfc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0JGNoZWNrID0gdGhpcy4kZWwuZmluZCgnLnRvZG8tY2hlY2snKTtcclxuXHJcblx0XHRcdCRjaGVjay5lYWNoKGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbGFiZWwgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuZmluZCgnLnRvZG8tbGFiZWwnKTtcclxuXHRcdFx0XHRfc2VsZi5jaGVjayggJCh0aGlzKSwgbGFiZWwgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcyxcclxuXHRcdFx0XHQkcmVtb3ZlID0gdGhpcy4kZWwuZmluZCggJy50b2RvLXJlbW92ZScgKSxcclxuXHRcdFx0XHQkY2hlY2sgPSB0aGlzLiRlbC5maW5kKCcudG9kby1jaGVjaycpLFxyXG5cdFx0XHRcdCR3aW5kb3cgPSAkKCB3aW5kb3cgKTtcclxuXHJcblx0XHRcdCRyZW1vdmUub24oJ2NsaWNrLndpZGdldC10b2RvLWxpc3QnLCBmdW5jdGlvbiggZXYgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoXCJsaVwiKS5yZW1vdmUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkY2hlY2sub24oJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHR2YXIgbGFiZWwgPSAkKHRoaXMpLmNsb3Nlc3QoJ2xpJykuZmluZCgnLnRvZG8tbGFiZWwnKTtcclxuXHRcdFx0XHRfc2VsZi5jaGVjayggJCh0aGlzKSwgbGFiZWwgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoICQuaXNGdW5jdGlvbiggJC5mbi5zb3J0YWJsZSApICkge1xyXG5cdFx0XHRcdHRoaXMuJGVsLnNvcnRhYmxlKHtcclxuXHRcdFx0XHRcdHNvcnQ6IGZ1bmN0aW9uKGV2ZW50LCB1aSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgdG9wID0gZXZlbnQucGFnZVkgLSBfc2VsZi4kZWwub2Zmc2V0KCkudG9wIC0gKHVpLmhlbHBlci5vdXRlckhlaWdodCh0cnVlKSAvIDIpO1xyXG5cdFx0XHRcdFx0XHR1aS5oZWxwZXIuY3NzKHsndG9wJyA6IHRvcCArICdweCd9KTtcclxuXHRcdFx0XHQgICAgfVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2UgdG8gc2NvcGVcclxuXHQkLmV4dGVuZCh0aGVtZSwge1xyXG5cdFx0V2lkZ2V0VG9kb0xpc3Q6IFdpZGdldFRvZG9MaXN0XHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luV2lkZ2V0VG9kb0xpc3QgPSBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBXaWRnZXRUb2RvTGlzdCgkdGhpcywgb3B0cyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIFdpZGdldCAtIFRvZ2dsZVxyXG4oZnVuY3Rpb24odGhlbWUsICQpIHtcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyIGluc3RhbmNlTmFtZSA9ICdfX3dpZGdldFRvZ2dsZUV4cGFuZCc7XHJcblxyXG5cdHZhciBXaWRnZXRUb2dnbGVFeHBhbmQgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRXaWRnZXRUb2dnbGVFeHBhbmQuZGVmYXVsdHMgPSB7XHJcblx0fTtcclxuXHJcblx0V2lkZ2V0VG9nZ2xlRXhwYW5kLnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCRlbCwgb3B0cykge1xyXG5cdFx0XHRpZiAoICRlbC5kYXRhKCBpbnN0YW5jZU5hbWUgKSApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy4kZWwgPSAkZWw7XHJcblxyXG5cdFx0XHR0aGlzXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5zZXRPcHRpb25zKG9wdHMpXHJcblx0XHRcdFx0LmJ1aWxkKClcclxuXHRcdFx0XHQuZXZlbnRzKCk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0RGF0YTogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuJGVsLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXRPcHRpb25zOiBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRcdHRoaXMub3B0aW9ucyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgV2lkZ2V0VG9nZ2xlRXhwYW5kLmRlZmF1bHRzLCBvcHRzICk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXZlbnRzOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcyxcclxuXHRcdFx0XHQkdG9nZ2xlciA9IHRoaXMuJGVsLmZpbmQoICcud2lkZ2V0LXRvZ2dsZScgKTtcclxuXHJcblx0XHRcdCR0b2dnbGVyLm9uKCdjbGljay53aWRnZXQtdG9nZ2xlcicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdF9zZWxmLiRlbC5oYXNDbGFzcygnd2lkZ2V0LWNvbGxhcHNlZCcpID8gX3NlbGYuZXhwYW5kKCBfc2VsZi4kZWwgKSA6IF9zZWxmLmNvbGxhcHNlKCBfc2VsZi4kZWwgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXhwYW5kOiBmdW5jdGlvbiggY29udGVudCApIHtcclxuXHRcdFx0Y29udGVudC5jaGlsZHJlbiggJy53aWRnZXQtY29udGVudC1leHBhbmRlZCcgKS5zbGlkZURvd24oICdmYXN0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5jc3MoICdkaXNwbGF5JywgJycgKTtcclxuXHRcdFx0XHRjb250ZW50LnJlbW92ZUNsYXNzKCAnd2lkZ2V0LWNvbGxhcHNlZCcgKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGNvbGxhcHNlOiBmdW5jdGlvbiggY29udGVudCApIHtcclxuXHRcdFx0Y29udGVudC5jaGlsZHJlbignLndpZGdldC1jb250ZW50LWV4cGFuZGVkJyApLnNsaWRlVXAoICdmYXN0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Y29udGVudC5hZGRDbGFzcyggJ3dpZGdldC1jb2xsYXBzZWQnICk7XHJcblx0XHRcdFx0JCh0aGlzKS5jc3MoICdkaXNwbGF5JywgJycgKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFdpZGdldFRvZ2dsZUV4cGFuZDogV2lkZ2V0VG9nZ2xlRXhwYW5kXHJcblx0fSk7XHJcblxyXG5cdC8vIGpxdWVyeSBwbHVnaW5cclxuXHQkLmZuLnRoZW1lUGx1Z2luV2lkZ2V0VG9nZ2xlRXhwYW5kID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgV2lkZ2V0VG9nZ2xlRXhwYW5kKCR0aGlzLCBvcHRzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pO1xyXG5cclxuLy8gV29yZCBSb3RhdG9yXHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fd29yZFJvdGF0b3InO1xyXG5cclxuXHR2YXIgUGx1Z2luV29yZFJvdGF0b3IgPSBmdW5jdGlvbigkZWwsIG9wdHMpIHtcclxuXHRcdHJldHVybiB0aGlzLmluaXRpYWxpemUoJGVsLCBvcHRzKTtcclxuXHR9O1xyXG5cclxuXHRQbHVnaW5Xb3JkUm90YXRvci5kZWZhdWx0cyA9IHtcclxuXHRcdGRlbGF5OiAyMDAwXHJcblx0fTtcclxuXHJcblx0UGx1Z2luV29yZFJvdGF0b3IucHJvdG90eXBlID0ge1xyXG5cdFx0aW5pdGlhbGl6ZTogZnVuY3Rpb24oJGVsLCBvcHRzKSB7XHJcblx0XHRcdGlmICggJGVsLmRhdGEoIGluc3RhbmNlTmFtZSApICkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLiRlbCA9ICRlbDtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0RGF0YSgpXHJcblx0XHRcdFx0LnNldE9wdGlvbnMob3B0cylcclxuXHRcdFx0XHQuYnVpbGQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRzZXREYXRhOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy4kZWwuZGF0YShpbnN0YW5jZU5hbWUsIHRoaXMpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldE9wdGlvbnM6IGZ1bmN0aW9uKG9wdHMpIHtcclxuXHRcdFx0dGhpcy5vcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIFBsdWdpbldvcmRSb3RhdG9yLmRlZmF1bHRzLCBvcHRzLCB7XHJcblx0XHRcdFx0d3JhcHBlcjogdGhpcy4kZWxcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGQ6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJGVsID0gdGhpcy5vcHRpb25zLndyYXBwZXIsXHJcblx0XHRcdFx0aXRlbXNXcmFwcGVyID0gJGVsLmZpbmQoXCIud29ydC1yb3RhdG9yLWl0ZW1zXCIpLFxyXG5cdFx0XHRcdGl0ZW1zID0gaXRlbXNXcmFwcGVyLmZpbmQoXCI+IHNwYW5cIiksXHJcblx0XHRcdFx0Zmlyc3RJdGVtID0gaXRlbXMuZXEoMCksXHJcblx0XHRcdFx0Zmlyc3RJdGVtQ2xvbmUgPSBmaXJzdEl0ZW0uY2xvbmUoKSxcclxuXHRcdFx0XHRpdGVtSGVpZ2h0ID0gZmlyc3RJdGVtLmhlaWdodCgpLFxyXG5cdFx0XHRcdGN1cnJlbnRJdGVtID0gMSxcclxuXHRcdFx0XHRjdXJyZW50VG9wID0gMDtcclxuXHJcblx0XHRcdGl0ZW1zV3JhcHBlci5hcHBlbmQoZmlyc3RJdGVtQ2xvbmUpO1xyXG5cclxuXHRcdFx0JGVsXHJcblx0XHRcdFx0LmhlaWdodChpdGVtSGVpZ2h0KVxyXG5cdFx0XHRcdC5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcclxuXHJcblx0XHRcdHNldEludGVydmFsKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHRjdXJyZW50VG9wID0gKGN1cnJlbnRJdGVtICogaXRlbUhlaWdodCk7XHJcblxyXG5cdFx0XHRcdGl0ZW1zV3JhcHBlci5hbmltYXRlKHtcclxuXHRcdFx0XHRcdHRvcDogLShjdXJyZW50VG9wKSArIFwicHhcIlxyXG5cdFx0XHRcdH0sIDMwMCwgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdFx0Y3VycmVudEl0ZW0rKztcclxuXHJcblx0XHRcdFx0XHRpZihjdXJyZW50SXRlbSA+IGl0ZW1zLmxlbmd0aCkge1xyXG5cclxuXHRcdFx0XHRcdFx0aXRlbXNXcmFwcGVyLmNzcyhcInRvcFwiLCAwKTtcclxuXHRcdFx0XHRcdFx0Y3VycmVudEl0ZW0gPSAxO1xyXG5cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHR9LCB0aGlzLm9wdGlvbnMuZGVsYXkpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0Ly8gZXhwb3NlIHRvIHNjb3BlXHJcblx0JC5leHRlbmQodGhlbWUsIHtcclxuXHRcdFBsdWdpbldvcmRSb3RhdG9yOiBQbHVnaW5Xb3JkUm90YXRvclxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZVBsdWdpbldvcmRSb3RhdG9yID0gZnVuY3Rpb24ob3B0cykge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcclxuXHJcblx0XHRcdGlmICgkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSkpIHtcclxuXHRcdFx0XHRyZXR1cm4gJHRoaXMuZGF0YShpbnN0YW5jZU5hbWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgUGx1Z2luV29yZFJvdGF0b3IoJHRoaXMsIG9wdHMpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxufSkuYXBwbHkodGhpcywgW3dpbmRvdy50aGVtZSwgalF1ZXJ5XSk7XHJcblxyXG4vLyBOYXZpZ2F0aW9uXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyICRpdGVtcyA9ICQoICcubmF2LW1haW4gbGkubmF2LXBhcmVudCcgKTtcclxuXHJcblx0ZnVuY3Rpb24gZXhwYW5kKCAkbGkgKSB7XHJcblx0XHQkbGkuY2hpbGRyZW4oICd1bC5uYXYtY2hpbGRyZW4nICkuc2xpZGVEb3duKCAnZmFzdCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkbGkuYWRkQ2xhc3MoICduYXYtZXhwYW5kZWQnICk7XHJcblx0XHRcdCQodGhpcykuY3NzKCAnZGlzcGxheScsICcnICk7XHJcblx0XHRcdGVuc3VyZVZpc2libGUoICRsaSApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBjb2xsYXBzZSggJGxpICkge1xyXG5cdFx0JGxpLmNoaWxkcmVuKCd1bC5uYXYtY2hpbGRyZW4nICkuc2xpZGVVcCggJ2Zhc3QnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0JCh0aGlzKS5jc3MoICdkaXNwbGF5JywgJycgKTtcclxuXHRcdFx0JGxpLnJlbW92ZUNsYXNzKCAnbmF2LWV4cGFuZGVkJyApO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBlbnN1cmVWaXNpYmxlKCAkbGkgKSB7XHJcblx0XHR2YXIgc2Nyb2xsZXIgPSAkbGkub2Zmc2V0UGFyZW50KCk7XHJcblx0XHRpZiAoICFzY3JvbGxlci5nZXQoMCkgKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdG9wID0gJGxpLnBvc2l0aW9uKCkudG9wO1xyXG5cdFx0aWYgKCB0b3AgPCAwICkge1xyXG5cdFx0XHRzY3JvbGxlci5hbmltYXRlKHtcclxuXHRcdFx0XHRzY3JvbGxUb3A6IHNjcm9sbGVyLnNjcm9sbFRvcCgpICsgdG9wXHJcblx0XHRcdH0sICdmYXN0Jyk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBidWlsZFNpZGViYXJOYXYoIGFuY2hvciwgcHJldiwgbmV4dCwgZXYgKSB7XHJcblx0XHRpZiAoIGFuY2hvci5wcm9wKCdocmVmJykgKSB7XHJcblx0XHRcdHZhciBhcnJvd1dpZHRoID0gcGFyc2VJbnQod2luZG93LmdldENvbXB1dGVkU3R5bGUoYW5jaG9yLmdldCgwKSwgJzphZnRlcicpLndpZHRoLCAxMCkgfHwgMDtcclxuXHRcdFx0aWYgKGV2Lm9mZnNldFggPiBhbmNob3IuZ2V0KDApLm9mZnNldFdpZHRoIC0gYXJyb3dXaWR0aCkge1xyXG5cdFx0XHRcdGV2LnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHByZXYuZ2V0KCAwICkgIT09IG5leHQuZ2V0KCAwICkgKSB7XHJcblx0XHRcdGNvbGxhcHNlKCBwcmV2ICk7XHJcblx0XHRcdGV4cGFuZCggbmV4dCApO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29sbGFwc2UoIHByZXYgKTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdCRpdGVtcy5maW5kKCc+IGEnKS5vbignY2xpY2snLCBmdW5jdGlvbiggZXYgKSB7XHJcblxyXG5cdFx0dmFyICRodG1sICAgPSAkKCdodG1sJyksXHJcblx0XHRcdCR3aW5kb3cgPSAkKHdpbmRvdyksXHJcblx0XHQgICAgJGFuY2hvciA9ICQoIHRoaXMgKSxcclxuXHRcdFx0JHByZXYgICA9ICRhbmNob3IuY2xvc2VzdCgndWwubmF2JykuZmluZCgnPiBsaS5uYXYtZXhwYW5kZWQnICksXHJcblx0XHRcdCRuZXh0ICAgPSAkYW5jaG9yLmNsb3Nlc3QoJ2xpJyksXHJcblx0XHRcdCRldiAgICAgPSBldjtcclxuXHJcblx0XHRpZiggJGFuY2hvci5hdHRyKCdocmVmJykgPT0gJyMnICkge1xyXG5cdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmKCAhJGh0bWwuaGFzQ2xhc3MoJ3NpZGViYXItbGVmdC1iaWctaWNvbnMnKSApIHtcclxuXHRcdFx0YnVpbGRTaWRlYmFyTmF2KCAkYW5jaG9yLCAkcHJldiwgJG5leHQsICRldiApO1xyXG5cdFx0fSBlbHNlIGlmKCAkaHRtbC5oYXNDbGFzcygnc2lkZWJhci1sZWZ0LWJpZy1pY29ucycpICYmICR3aW5kb3cud2lkdGgoKSA8IDc2OCApIHtcclxuXHRcdFx0YnVpbGRTaWRlYmFyTmF2KCAkYW5jaG9yLCAkcHJldiwgJG5leHQsICRldiApO1xyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcblx0Ly8gQ2hyb21lIEZpeFxyXG5cdCQuYnJvd3Nlci5jaHJvbWUgPSAvY2hyb20oZXxpdW0pLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKSk7XHJcblx0aWYoICQuYnJvd3Nlci5jaHJvbWUgJiYgISQuYnJvd3Nlci5tb2JpbGUgKSB7XHJcblx0XHR2YXIgZmxhZyA9IHRydWU7XHJcblx0XHQkKCcuc2lkZWJhci1sZWZ0IC5uYXYtbWFpbiBsaSBhJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0ZmxhZyA9IGZhbHNlO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0ZmxhZyA9IHRydWU7XHJcblx0XHRcdH0sIDIwMCk7XHJcblx0XHR9KTtcclxuXHJcblx0XHQkKCcubmFubycpLm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdCQodGhpcykuYWRkQ2xhc3MoJ2hvdmVyZWQnKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdCQoJy5uYW5vJykub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbihlKXtcclxuXHRcdFx0aWYoIGZsYWcgKSB7XHJcblx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnaG92ZXJlZCcpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcdFxyXG5cdH1cclxuXHJcblx0JCgnLm5hdi1tYWluIGEnKS5maWx0ZXIoJzpub3QoW2hyZWZdKScpLmF0dHIoJ2hyZWYnLCAnIycpO1xyXG5cclxufSkuYXBwbHkodGhpcywgW2pRdWVyeV0pO1xyXG5cclxuLy8gU2tlbGV0b25cclxuKGZ1bmN0aW9uKHRoZW1lLCAkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dGhlbWUgPSB0aGVtZSB8fCB7fTtcclxuXHJcblx0dmFyICRib2R5XHRcdFx0XHQ9ICQoICdib2R5JyApLFxyXG5cdFx0JGh0bWxcdFx0XHRcdD0gJCggJ2h0bWwnICksXHJcblx0XHQkd2luZG93XHRcdFx0XHQ9ICQoIHdpbmRvdyApLFxyXG5cdFx0aXNBbmRyb2lkXHRcdFx0PSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZignYW5kcm9pZCcpID4gLTEsXHJcblx0XHRpc0lwYWQgICAgICBcdFx0PSBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpICE9IG51bGwsXHJcblx0XHR1cGRhdGluZ05hbm9TY3JvbGwgID0gZmFsc2U7XHJcblxyXG5cdC8vIG1vYmlsZSBkZXZpY2VzIHdpdGggZml4ZWQgaGFzIGEgbG90IG9mIGlzc3VlcyB3aGVuIGZvY3VzIGlucHV0cyBhbmQgb3RoZXJzLi4uXHJcblx0aWYgKCB0eXBlb2YgJC5icm93c2VyICE9PSAndW5kZWZpbmVkJyAmJiAkLmJyb3dzZXIubW9iaWxlICYmICRodG1sLmhhc0NsYXNzKCdmaXhlZCcpICkge1xyXG5cdFx0JGh0bWwucmVtb3ZlQ2xhc3MoICdmaXhlZCcgKS5hZGRDbGFzcyggJ3Njcm9sbCcgKTtcclxuXHR9XHJcblxyXG5cdHZhciBTa2VsZXRvbiA9IHtcclxuXHJcblx0XHRvcHRpb25zOiB7XHJcblx0XHRcdHNpZGViYXJzOiB7XHJcblx0XHRcdFx0bWVudTogJyNjb250ZW50LW1lbnUnLFxyXG5cdFx0XHRcdGxlZnQ6ICcjc2lkZWJhci1sZWZ0JyxcclxuXHRcdFx0XHRyaWdodDogJyNzaWRlYmFyLXJpZ2h0J1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGN1c3RvbVNjcm9sbDogKCAhTW9kZXJuaXpyLm92ZXJmbG93c2Nyb2xsaW5nICYmICFpc0FuZHJvaWQgJiYgJC5mbi5uYW5vU2Nyb2xsZXIgIT09ICd1bmRlZmluZWQnKSxcclxuXHJcblx0XHRpbml0aWFsaXplOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpc1xyXG5cdFx0XHRcdC5zZXRWYXJzKClcclxuXHRcdFx0XHQuYnVpbGQoKVxyXG5cdFx0XHRcdC5ldmVudHMoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0VmFyczogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuc2lkZWJhcnMgPSB7fTtcclxuXHJcblx0XHRcdHRoaXMuc2lkZWJhcnMubGVmdCA9IHtcclxuXHRcdFx0XHQkZWw6ICQoIHRoaXMub3B0aW9ucy5zaWRlYmFycy5sZWZ0IClcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuc2lkZWJhcnMucmlnaHQgPSB7XHJcblx0XHRcdFx0JGVsOiAkKCB0aGlzLm9wdGlvbnMuc2lkZWJhcnMucmlnaHQgKSxcclxuXHRcdFx0XHRpc09wZW5lZDogJGh0bWwuaGFzQ2xhc3MoICdzaWRlYmFyLXJpZ2h0LW9wZW5lZCcgKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy5zaWRlYmFycy5tZW51ID0ge1xyXG5cdFx0XHRcdCRlbDogJCggdGhpcy5vcHRpb25zLnNpZGViYXJzLm1lbnUgKSxcclxuXHRcdFx0XHRpc09wZW5lZDogJGh0bWwuaGFzQ2xhc3MoICdpbm5lci1tZW51LW9wZW5lZCcgKVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdGlmICggdHlwZW9mICQuYnJvd3NlciAhPT0gJ3VuZGVmaW5lZCcgJiYgJC5icm93c2VyLm1vYmlsZSApIHtcclxuXHRcdFx0XHQkaHRtbC5hZGRDbGFzcyggJ21vYmlsZS1kZXZpY2UnICk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JGh0bWwuYWRkQ2xhc3MoICduby1tb2JpbGUtZGV2aWNlJyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkaHRtbC5hZGRDbGFzcyggJ2N1c3RvbS1zY3JvbGwnICk7XHJcblx0XHRcdGlmICggdGhpcy5jdXN0b21TY3JvbGwgKSB7XHJcblx0XHRcdFx0dGhpcy5idWlsZFNpZGViYXJMZWZ0KCk7XHJcblx0XHRcdFx0dGhpcy5idWlsZENvbnRlbnRNZW51KCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKCBpc0lwYWQgKSB7XHJcblx0XHRcdFx0dGhpcy5maXhJcGFkKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuYnVpbGRTaWRlYmFyUmlnaHQoKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRldmVudHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIHRoaXMuY3VzdG9tU2Nyb2xsICkge1xyXG5cdFx0XHRcdHRoaXMuZXZlbnRzU2lkZWJhckxlZnQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5ldmVudHNTaWRlYmFyUmlnaHQoKTtcclxuXHRcdFx0dGhpcy5ldmVudHNDb250ZW50TWVudSgpO1xyXG5cclxuXHRcdFx0aWYgKCB0eXBlb2YgJC5icm93c2VyICE9PSAndW5kZWZpbmVkJyAmJiAhdGhpcy5jdXN0b21TY3JvbGwgJiYgaXNBbmRyb2lkICkge1xyXG5cdFx0XHRcdHRoaXMuZml4U2Nyb2xsKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRmaXhTY3JvbGw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgX3NlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0JHdpbmRvd1xyXG5cdFx0XHRcdC5vbiggJ3NpZGViYXItbGVmdC1vcGVuZWQgc2lkZWJhci1yaWdodC10b2dnbGUnLCBmdW5jdGlvbiggZSwgZGF0YSApIHtcclxuXHRcdFx0XHRcdF9zZWxmLnByZXZlbnRCb2R5U2Nyb2xsVG9nZ2xlKCBkYXRhLmFkZGVkICk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRmaXhJcGFkOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdCQoJy5oZWFkZXIsIC5wYWdlLWhlYWRlciwgLmNvbnRlbnQtYm9keScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0JGh0bWwucmVtb3ZlQ2xhc3MoJ3NpZGViYXItbGVmdC1vcGVuZWQnKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkU2lkZWJhckxlZnQ6IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0dmFyIGluaXRpYWxQb3NpdGlvbiA9IDA7XHJcblxyXG5cdFx0XHR0aGlzLnNpZGViYXJzLmxlZnQuaXNPcGVuZWQgPSAhJGh0bWwuaGFzQ2xhc3MoICdzaWRlYmFyLWxlZnQtY29sbGFwc2VkJyApIHx8ICRodG1sLmhhc0NsYXNzKCAnc2lkZWJhci1sZWZ0LW9wZW5lZCcgKTtcclxuXHJcblx0XHRcdHRoaXMuc2lkZWJhcnMubGVmdC4kbmFubyA9IHRoaXMuc2lkZWJhcnMubGVmdC4kZWwuZmluZCggJy5uYW5vJyApO1xyXG5cclxuXHRcdFx0aWYgKHR5cGVvZiBsb2NhbFN0b3JhZ2UgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0dGhpcy5zaWRlYmFycy5sZWZ0LiRuYW5vLm9uKCd1cGRhdGUnLCBmdW5jdGlvbihlLCB2YWx1ZXMpIHtcclxuXHRcdFx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdzaWRlYmFyLWxlZnQtcG9zaXRpb24nLCB2YWx1ZXMucG9zaXRpb24pO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ3NpZGViYXItbGVmdC1wb3NpdGlvbicpICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRpbml0aWFsUG9zaXRpb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc2lkZWJhci1sZWZ0LXBvc2l0aW9uJyk7XHJcblx0XHRcdFx0XHR0aGlzLnNpZGViYXJzLmxlZnQuJGVsLmZpbmQoICcubmFuby1jb250ZW50Jykuc2Nyb2xsVG9wKGluaXRpYWxQb3NpdGlvbik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnNpZGViYXJzLmxlZnQuJG5hbm8ubmFub1Njcm9sbGVyKHtcclxuXHRcdFx0XHRzY3JvbGxUb3A6IGluaXRpYWxQb3NpdGlvbixcclxuXHRcdFx0XHRhbHdheXNWaXNpYmxlOiB0cnVlLFxyXG5cdFx0XHRcdHByZXZlbnRQYWdlU2Nyb2xsaW5nOiAkaHRtbC5oYXNDbGFzcyggJ2ZpeGVkJyApXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGV2ZW50c1NpZGViYXJMZWZ0OiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdHZhciBfc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0JG5hbm8gPSB0aGlzLnNpZGViYXJzLmxlZnQuJG5hbm87XHJcblxyXG5cdFx0XHR2YXIgb3BlbiA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGlmICggX3NlbGYuc2lkZWJhcnMubGVmdC5pc09wZW5lZCApIHtcclxuXHRcdFx0XHRcdHJldHVybiBjbG9zZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0X3NlbGYuc2lkZWJhcnMubGVmdC5pc09wZW5lZCA9IHRydWU7XHJcblxyXG5cdFx0XHRcdCRodG1sLmFkZENsYXNzKCAnc2lkZWJhci1sZWZ0LW9wZW5lZCcgKTtcclxuXHJcblx0XHRcdFx0JHdpbmRvdy50cmlnZ2VyKCAnc2lkZWJhci1sZWZ0LXRvZ2dsZScsIHtcclxuXHRcdFx0XHRcdGFkZGVkOiB0cnVlLFxyXG5cdFx0XHRcdFx0cmVtb3ZlZDogZmFsc2VcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0JGh0bWwub24oICdjbGljay5jbG9zZS1sZWZ0LXNpZGViYXInLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRcdFx0Y2xvc2UoZSk7XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHZhciBjbG9zZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRpZiAoICEhZSAmJiAhIWUudGFyZ2V0ICYmICgkKGUudGFyZ2V0KS5jbG9zZXN0KCAnLnNpZGViYXItbGVmdCcgKS5nZXQoMCkgfHwgISQoZS50YXJnZXQpLmNsb3Nlc3QoICdodG1sJyApLmdldCgwKSkgKSB7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0XHQkaHRtbC5yZW1vdmVDbGFzcyggJ3NpZGViYXItbGVmdC1vcGVuZWQnICk7XHJcblx0XHRcdFx0XHQkaHRtbC5vZmYoICdjbGljay5jbG9zZS1sZWZ0LXNpZGViYXInICk7XHJcblxyXG5cdFx0XHRcdFx0JHdpbmRvdy50cmlnZ2VyKCAnc2lkZWJhci1sZWZ0LXRvZ2dsZScsIHtcclxuXHRcdFx0XHRcdFx0YWRkZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdFx0XHRyZW1vdmVkOiB0cnVlXHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRfc2VsZi5zaWRlYmFycy5sZWZ0LmlzT3BlbmVkID0gISRodG1sLmhhc0NsYXNzKCAnc2lkZWJhci1sZWZ0LWNvbGxhcHNlZCcgKTtcclxuXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIHVwZGF0ZU5hbm9TY3JvbGwgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAodXBkYXRpbmdOYW5vU2Nyb2xsKSB7XHJcblx0XHRcdFx0XHRpZiAoICQuc3VwcG9ydC50cmFuc2l0aW9uICkge1xyXG5cdFx0XHRcdFx0XHQkbmFuby5uYW5vU2Nyb2xsZXIoKTtcclxuXHRcdFx0XHRcdFx0JG5hbm9cclxuXHRcdFx0XHRcdFx0XHQub25lKCdic1RyYW5zaXRpb25FbmQnLCB1cGRhdGVOYW5vU2Nyb2xsKVxyXG5cdFx0XHRcdFx0XHRcdC5lbXVsYXRlVHJhbnNpdGlvbkVuZCgxNTApXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR1cGRhdGVOYW5vU2Nyb2xsKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dXBkYXRpbmdOYW5vU2Nyb2xsID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHR1cGRhdGluZ05hbm9TY3JvbGwgPSBmYWxzZTtcclxuXHRcdFx0XHRcdH0sIDIwMCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIGlzVG9nZ2xlciA9IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xyXG5cdFx0XHRcdHJldHVybiAkKGVsZW1lbnQpLmRhdGEoJ2ZpcmUtZXZlbnQnKSA9PT0gJ3NpZGViYXItbGVmdC10b2dnbGUnIHx8ICQoZWxlbWVudCkucGFyZW50cygpLmRhdGEoJ2ZpcmUtZXZlbnQnKSA9PT0gJ3NpZGViYXItbGVmdC10b2dnbGUnO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dGhpcy5zaWRlYmFycy5sZWZ0LiRlbFxyXG5cdFx0XHRcdC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR1cGRhdGVOYW5vU2Nyb2xsKCk7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0XHQub24oJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0X3NlbGYuc2lkZWJhcnMubGVmdC5pc09wZW5lZCA9ICEkaHRtbC5oYXNDbGFzcyggJ3NpZGViYXItbGVmdC1jb2xsYXBzZWQnICkgfHwgJGh0bWwuaGFzQ2xhc3MoICdzaWRlYmFyLWxlZnQtb3BlbmVkJyApO1xyXG5cdFx0XHRcdFx0aWYgKCAhX3NlbGYuc2lkZWJhcnMubGVmdC5pc09wZW5lZCAmJiAhaXNUb2dnbGVyKGUudGFyZ2V0KSApIHtcclxuXHRcdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRvcGVuKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHQkbmFub1xyXG5cdFx0XHRcdC5vbiggJ21vdXNlZW50ZXInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmICggJGh0bWwuaGFzQ2xhc3MoICdzaWRlYmFyLWxlZnQtY29sbGFwc2VkJyApICkge1xyXG5cdFx0XHRcdFx0XHQkbmFuby5uYW5vU2Nyb2xsZXIoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KVxyXG5cdFx0XHRcdC5vbiggJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdGlmICggJGh0bWwuaGFzQ2xhc3MoICdzaWRlYmFyLWxlZnQtY29sbGFwc2VkJyApICkge1xyXG5cdFx0XHRcdFx0XHQkbmFuby5uYW5vU2Nyb2xsZXIoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdCR3aW5kb3cub24oICdzaWRlYmFyLWxlZnQtdG9nZ2xlJywgZnVuY3Rpb24oZSwgdG9nZ2xlKSB7XHJcblx0XHRcdFx0aWYgKCB0b2dnbGUucmVtb3ZlZCApIHtcclxuXHRcdFx0XHRcdCRodG1sLnJlbW92ZUNsYXNzKCAnc2lkZWJhci1sZWZ0LW9wZW5lZCcgKTtcclxuXHRcdFx0XHRcdCRodG1sLm9mZiggJ2NsaWNrLmNsb3NlLWxlZnQtc2lkZWJhcicgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gUmVjYWxjdWxhdGUgT3dsIENhcm91c2VsIHNpemVzXHJcblx0XHRcdFx0JCgnLm93bC1jYXJvdXNlbCcpLnRyaWdnZXIoJ3JlZnJlc2gub3dsLmNhcm91c2VsJyk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkU2lkZWJhclJpZ2h0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5zaWRlYmFycy5yaWdodC5pc09wZW5lZCA9ICRodG1sLmhhc0NsYXNzKCAnc2lkZWJhci1yaWdodC1vcGVuZWQnICk7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMuY3VzdG9tU2Nyb2xsICkge1xyXG5cdFx0XHRcdHRoaXMuc2lkZWJhcnMucmlnaHQuJG5hbm8gPSB0aGlzLnNpZGViYXJzLnJpZ2h0LiRlbC5maW5kKCAnLm5hbm8nICk7XHJcblxyXG5cdFx0XHRcdHRoaXMuc2lkZWJhcnMucmlnaHQuJG5hbm8ubmFub1Njcm9sbGVyKHtcclxuXHRcdFx0XHRcdGFsd2F5c1Zpc2libGU6IHRydWUsXHJcblx0XHRcdFx0XHRwcmV2ZW50UGFnZVNjcm9sbGluZzogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0ZXZlbnRzU2lkZWJhclJpZ2h0OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHZhciBvcGVuID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCBfc2VsZi5zaWRlYmFycy5yaWdodC5pc09wZW5lZCApIHtcclxuXHRcdFx0XHRcdHJldHVybiBjbG9zZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0X3NlbGYuc2lkZWJhcnMucmlnaHQuaXNPcGVuZWQgPSB0cnVlO1xyXG5cclxuXHRcdFx0XHQkaHRtbC5hZGRDbGFzcyggJ3NpZGViYXItcmlnaHQtb3BlbmVkJyApO1xyXG5cclxuXHRcdFx0XHQkd2luZG93LnRyaWdnZXIoICdzaWRlYmFyLXJpZ2h0LXRvZ2dsZScsIHtcclxuXHRcdFx0XHRcdGFkZGVkOiB0cnVlLFxyXG5cdFx0XHRcdFx0cmVtb3ZlZDogZmFsc2VcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0JGh0bWwub24oICdjbGljay5jbG9zZS1yaWdodC1zaWRlYmFyJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGNsb3NlKGUpO1xyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIGNsb3NlID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcdGlmICggISFlICYmICEhZS50YXJnZXQgJiYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoICcuc2lkZWJhci1yaWdodCcgKS5nZXQoMCkgfHwgISQoZS50YXJnZXQpLmNsb3Nlc3QoICdodG1sJyApLmdldCgwKSkgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkaHRtbC5yZW1vdmVDbGFzcyggJ3NpZGViYXItcmlnaHQtb3BlbmVkJyApO1xyXG5cdFx0XHRcdCRodG1sLm9mZiggJ2NsaWNrLmNsb3NlLXJpZ2h0LXNpZGViYXInICk7XHJcblxyXG5cdFx0XHRcdCR3aW5kb3cudHJpZ2dlciggJ3NpZGViYXItcmlnaHQtdG9nZ2xlJywge1xyXG5cdFx0XHRcdFx0YWRkZWQ6IGZhbHNlLFxyXG5cdFx0XHRcdFx0cmVtb3ZlZDogdHJ1ZVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRfc2VsZi5zaWRlYmFycy5yaWdodC5pc09wZW5lZCA9IGZhbHNlO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIGJpbmQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCdbZGF0YS1vcGVuPVwic2lkZWJhci1yaWdodFwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoICRlbC5pcygnYScpIClcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRcdG9wZW4oKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHRoaXMuc2lkZWJhcnMucmlnaHQuJGVsLmZpbmQoICcubW9iaWxlLWNsb3NlJyApXHJcblx0XHRcdFx0Lm9uKCAnY2xpY2snLCBmdW5jdGlvbiggZSApIHtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdCRodG1sLnRyaWdnZXIoICdjbGljay5jbG9zZS1yaWdodC1zaWRlYmFyJyApO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0YmluZCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkQ29udGVudE1lbnU6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoICEkaHRtbC5oYXNDbGFzcyggJ2ZpeGVkJyApICkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zaWRlYmFycy5tZW51LiRuYW5vID0gdGhpcy5zaWRlYmFycy5tZW51LiRlbC5maW5kKCAnLm5hbm8nICk7XHJcblxyXG5cdFx0XHR0aGlzLnNpZGViYXJzLm1lbnUuJG5hbm8ubmFub1Njcm9sbGVyKHtcclxuXHRcdFx0XHRhbHdheXNWaXNpYmxlOiB0cnVlLFxyXG5cdFx0XHRcdHByZXZlbnRQYWdlU2Nyb2xsaW5nOiB0cnVlXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdGV2ZW50c0NvbnRlbnRNZW51OiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHZhciBvcGVuID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKCBfc2VsZi5zaWRlYmFycy5tZW51LmlzT3BlbmVkICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNsb3NlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRfc2VsZi5zaWRlYmFycy5tZW51LmlzT3BlbmVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0JGh0bWwuYWRkQ2xhc3MoICdpbm5lci1tZW51LW9wZW5lZCcgKTtcclxuXHJcblx0XHRcdFx0JHdpbmRvdy50cmlnZ2VyKCAnaW5uZXItbWVudS10b2dnbGUnLCB7XHJcblx0XHRcdFx0XHRhZGRlZDogdHJ1ZSxcclxuXHRcdFx0XHRcdHJlbW92ZWQ6IGZhbHNlXHJcblx0XHRcdFx0fSk7XHJcblxyXG5cdFx0XHRcdCRodG1sLm9uKCAnY2xpY2suY2xvc2UtaW5uZXItbWVudScsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHRcdFx0XHRjbG9zZShlKTtcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR2YXIgY2xvc2UgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0dmFyIGhhc0V2ZW50LFxyXG5cdFx0XHRcdFx0aGFzVGFyZ2V0LFxyXG5cdFx0XHRcdFx0aXNDb2xsYXBzZUJ1dHRvbixcclxuXHRcdFx0XHRcdGlzSW5zaWRlTW9kYWwsXHJcblx0XHRcdFx0XHRpc0luc2lkZUlubmVyTWVudSxcclxuXHRcdFx0XHRcdGlzSW5zaWRlSFRNTCxcclxuXHRcdFx0XHRcdCR0YXJnZXQ7XHJcblxyXG5cdFx0XHRcdGhhc0V2ZW50ID0gISFlO1xyXG5cdFx0XHRcdGhhc1RhcmdldCA9IGhhc0V2ZW50ICYmICEhZS50YXJnZXQ7XHJcblxyXG5cdFx0XHRcdGlmICggaGFzVGFyZ2V0ICkge1xyXG5cdFx0XHRcdFx0JHRhcmdldCA9ICQoZS50YXJnZXQpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aXNDb2xsYXBzZUJ1dHRvbiA9IGhhc1RhcmdldCAmJiAhISR0YXJnZXQuY2xvc2VzdCggJy5pbm5lci1tZW51LWNvbGxhcHNlJyApLmdldCgwKTtcclxuXHRcdFx0XHRpc0luc2lkZU1vZGFsID0gaGFzVGFyZ2V0ICYmICEhJHRhcmdldC5jbG9zZXN0KCAnLm1mcC13cmFwJyApLmdldCgwKTtcclxuXHRcdFx0XHRpc0luc2lkZUlubmVyTWVudSA9IGhhc1RhcmdldCAmJiAhISR0YXJnZXQuY2xvc2VzdCggJy5pbm5lci1tZW51JyApLmdldCgwKTtcclxuXHRcdFx0XHRpc0luc2lkZUhUTUwgPSBoYXNUYXJnZXQgJiYgISEkdGFyZ2V0LmNsb3Nlc3QoICdodG1sJyApLmdldCgwKTtcclxuXHJcblx0XHRcdFx0aWYgKCAoIWlzQ29sbGFwc2VCdXR0b24gJiYgKGlzSW5zaWRlSW5uZXJNZW51IHx8ICFpc0luc2lkZUhUTUwpKSB8fCBpc0luc2lkZU1vZGFsICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHRcdFx0JGh0bWwucmVtb3ZlQ2xhc3MoICdpbm5lci1tZW51LW9wZW5lZCcgKTtcclxuXHRcdFx0XHQkaHRtbC5vZmYoICdjbGljay5jbG9zZS1pbm5lci1tZW51JyApO1xyXG5cclxuXHRcdFx0XHQkd2luZG93LnRyaWdnZXIoICdpbm5lci1tZW51LXRvZ2dsZScsIHtcclxuXHRcdFx0XHRcdGFkZGVkOiBmYWxzZSxcclxuXHRcdFx0XHRcdHJlbW92ZWQ6IHRydWVcclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0X3NlbGYuc2lkZWJhcnMubWVudS5pc09wZW5lZCA9IGZhbHNlO1xyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0dmFyIGJpbmQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHQkKCdbZGF0YS1vcGVuPVwiaW5uZXItbWVudVwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdHZhciAkZWwgPSAkKHRoaXMpO1xyXG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoICRlbC5pcygnYScpIClcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRcdG9wZW4oKTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdGJpbmQoKTtcclxuXHJcblx0XHRcdC8qIE5hbm8gU2Nyb2xsICovXHJcblx0XHRcdGlmICggJGh0bWwuaGFzQ2xhc3MoICdmaXhlZCcgKSApIHtcclxuXHRcdFx0XHR2YXIgJG5hbm8gPSB0aGlzLnNpZGViYXJzLm1lbnUuJG5hbm87XHJcblxyXG5cdFx0XHRcdHZhciB1cGRhdGVOYW5vU2Nyb2xsID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoICQuc3VwcG9ydC50cmFuc2l0aW9uICkge1xyXG5cdFx0XHRcdFx0XHQkbmFuby5uYW5vU2Nyb2xsZXIoKTtcclxuXHRcdFx0XHRcdFx0JG5hbm9cclxuXHRcdFx0XHRcdFx0XHQub25lKCdic1RyYW5zaXRpb25FbmQnLCB1cGRhdGVOYW5vU2Nyb2xsKVxyXG5cdFx0XHRcdFx0XHRcdC5lbXVsYXRlVHJhbnNpdGlvbkVuZCgxNTApXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR1cGRhdGVOYW5vU2Nyb2xsKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0dGhpcy5zaWRlYmFycy5tZW51LiRlbFxyXG5cdFx0XHRcdFx0Lm9uKCAnY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dXBkYXRlTmFub1Njcm9sbCgpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRwcmV2ZW50Qm9keVNjcm9sbFRvZ2dsZTogZnVuY3Rpb24oIHNob3VsZFByZXZlbnQsICRlbCApIHtcclxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRpZiAoIHNob3VsZFByZXZlbnQgKSB7XHJcblx0XHRcdFx0XHQkYm9keVxyXG5cdFx0XHRcdFx0XHQuZGF0YSggJ3Njcm9sbFRvcCcsICRib2R5LmdldCgwKS5zY3JvbGxUb3AgKVxyXG5cdFx0XHRcdFx0XHQuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogJ2ZpeGVkJyxcclxuXHRcdFx0XHRcdFx0XHR0b3A6ICRib2R5LmdldCgwKS5zY3JvbGxUb3AgKiAtMVxyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQkYm9keVxyXG5cdFx0XHRcdFx0XHQuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHRwb3NpdGlvbjogJycsXHJcblx0XHRcdFx0XHRcdFx0dG9wOiAnJ1xyXG5cdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQuc2Nyb2xsVG9wKCAkYm9keS5kYXRhKCAnc2Nyb2xsVG9wJyApICk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LCAxNTApO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2UgdG8gc2NvcGVcclxuXHQkLmV4dGVuZCh0aGVtZSwge1xyXG5cdFx0U2tlbGV0b246IFNrZWxldG9uXHJcblx0fSk7XHJcblxyXG59KS5hcHBseSh0aGlzLCBbd2luZG93LnRoZW1lLCBqUXVlcnldKTtcclxuXHJcbi8vIFRhYiBOYXZpZ2F0aW9uXHJcbihmdW5jdGlvbigkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0aWYoICQoJ2h0bWwuaGFzLXRhYi1uYXZpZ2F0aW9uJykuZ2V0KDApICkge1xyXG5cclxuXHRcdHZhciAkd2luZG93IFx0IFx0ICA9ICQoIHdpbmRvdyApLFxyXG5cdFx0XHQkdG9nZ2xlTWVudUJ1dHRvbiA9ICQoJy50b2dnbGUtbWVudScpLFxyXG5cdFx0XHQkbmF2QWN0aXZlICAgXHQgID0gJCgnLnRhYi1uYXZpZ2F0aW9uIG5hdiA+IHVsIC5uYXYtYWN0aXZlJyksXHJcblx0XHRcdCR0YWJOYXYgICAgICBcdCAgPSAkKCcudGFiLW5hdmlnYXRpb24nKSxcclxuXHRcdFx0JHRhYkl0ZW0gXHQgXHQgID0gJCgnLnRhYi1uYXZpZ2F0aW9uIG5hdiA+IHVsID4gbGkgYScpLFxyXG5cdFx0XHQkY29udGVudEJvZHkgXHQgID0gJCgnLmNvbnRlbnQtYm9keScpO1xyXG5cclxuXHRcdCR0YWJJdGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRpZiggJCh0aGlzKS5wYXJlbnQoKS5oYXNDbGFzcygnZHJvcGRvd24nKSB8fCAkKHRoaXMpLnBhcmVudCgpLmhhc0NsYXNzKCdkcm9wZG93bi1zdWJtZW51JykgKSB7XHJcblx0XHRcdFx0aWYoICR3aW5kb3cud2lkdGgoKSA8IDk5MiApIHtcclxuXHRcdFx0XHRcdGlmKCAkKHRoaXMpLnBhcmVudCgpLmhhc0NsYXNzKCduYXYtZXhwYW5kZWQnKSApIHtcclxuXHRcdFx0XHRcdFx0JCh0aGlzKS5jbG9zZXN0KCdsaScpLmZpbmQoICc+IHVsJyApLnNsaWRlVXAoICdmYXN0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JCh0aGlzKS5jc3MoICdkaXNwbGF5JywgJycgKTtcclxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmNsb3Nlc3QoJ2xpJykucmVtb3ZlQ2xhc3MoICduYXYtZXhwYW5kZWQnICk7XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYoICQodGhpcykucGFyZW50KCkuaGFzQ2xhc3MoJ2Ryb3Bkb3duJykgKSB7XHJcblx0XHRcdFx0XHRcdFx0JHRhYkl0ZW0ucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ25hdi1leHBhbmRlZCcpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCdleHBhbmRpbmcnKTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnbGknKS5maW5kKCAnPiB1bCcgKS5zbGlkZURvd24oICdmYXN0JywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0JHRhYkl0ZW0ucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2V4cGFuZGluZycpO1xyXG5cdFx0XHRcdFx0XHRcdCQodGhpcykuY2xvc2VzdCgnbGknKS5hZGRDbGFzcyggJ25hdi1leHBhbmRlZCcgKTtcclxuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmNzcyggJ2Rpc3BsYXknLCAnJyApO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRpZiggKCQodGhpcykucG9zaXRpb24oKS50b3AgKyAkKHRoaXMpLmhlaWdodCgpKSA8ICR3aW5kb3cuc2Nyb2xsVG9wKCkgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQkKCdodG1sLGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKHRoaXMpLm9mZnNldCgpLnRvcCAtIDEwMCB9LCAzMDApO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKCAhJCh0aGlzKS5wYXJlbnQoKS5oYXNDbGFzcygnZHJvcGRvd24nKSApIHtcclxuXHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKCAkKHRoaXMpLnBhcmVudCgpLmhhc0NsYXNzKCduYXYtZXhwYW5kZWQnKSApIHtcclxuXHRcdFx0XHRcdFx0JHRhYkl0ZW0ucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ25hdi1leHBhbmRlZCcpO1xyXG5cdFx0XHRcdFx0XHQkY29udGVudEJvZHkucmVtb3ZlQ2xhc3MoJ3RhYi1tZW51LW9wZW5lZCcpO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdCR0YWJJdGVtLnBhcmVudCgpLnJlbW92ZUNsYXNzKCduYXYtZXhwYW5kZWQnKTtcclxuXHRcdFx0XHRcdCRjb250ZW50Qm9keS5hZGRDbGFzcygndGFiLW1lbnUtb3BlbmVkJyk7XHJcblx0XHRcdFx0XHQkKHRoaXMpLnBhcmVudCgpLmFkZENsYXNzKCduYXYtZXhwYW5kZWQnKTtcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0JHdpbmRvdy5vbignc2Nyb2xsJywgZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYoICR3aW5kb3cud2lkdGgoKSA8IDk5MiApIHtcclxuXHRcdFx0XHR2YXIgdGFiTmF2T2Zmc2V0ID0gKCAkdGFiTmF2LnBvc2l0aW9uKCkudG9wICsgJHRhYk5hdi5oZWlnaHQoKSApICsgMTAwLFxyXG5cdFx0XHRcdFx0d2luZG93T2Zmc2V0ID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHRcdFx0aWYoIHdpbmRvd09mZnNldCA+IHRhYk5hdk9mZnNldCApIHtcclxuXHRcdFx0XHRcdCR0YWJOYXYucmVtb3ZlQ2xhc3MoJ3Nob3cnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cclxuXHRcdCR0b2dnbGVNZW51QnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcblx0XHRcdGlmKCAhJHRhYk5hdi5oYXNDbGFzcygnc2hvdycpICkge1xyXG5cdFx0XHRcdCQoJ2h0bWwsYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICR0YWJOYXYub2Zmc2V0KCkudG9wIC0gNTAgfSwgMzAwKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRcclxuXHR9XHJcblxyXG59KS5hcHBseSh0aGlzLCBbalF1ZXJ5XSk7XHJcblxyXG4vKiBCcm93c2VyIFNlbGVjdG9yICovXHJcbihmdW5jdGlvbigkKSB7XHJcblx0JC5leHRlbmQoe1xyXG5cclxuXHRcdGJyb3dzZXJTZWxlY3RvcjogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHQvLyBqUXVlcnkuYnJvd3Nlci5tb2JpbGUgKGh0dHA6Ly9kZXRlY3Rtb2JpbGVicm93c2VyLmNvbS8pXHJcblx0XHRcdChmdW5jdGlvbihhKXsoalF1ZXJ5LmJyb3dzZXI9alF1ZXJ5LmJyb3dzZXJ8fHt9KS5tb2JpbGU9LyhhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIChjZXxwaG9uZSl8eGRhfHhpaW5vL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLDQpKX0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7XHJcblxyXG5cdFx0XHQvLyBUb3VjaFxyXG5cdFx0XHR2YXIgaGFzVG91Y2ggPSAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgfHwgbmF2aWdhdG9yLm1zTWF4VG91Y2hQb2ludHM7XHJcblxyXG5cdFx0XHR2YXIgdSA9IG5hdmlnYXRvci51c2VyQWdlbnQsXHJcblx0XHRcdFx0dWEgPSB1LnRvTG93ZXJDYXNlKCksXHJcblx0XHRcdFx0aXMgPSBmdW5jdGlvbiAodCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHVhLmluZGV4T2YodCkgPiAtMTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdGcgPSAnZ2Vja28nLFxyXG5cdFx0XHRcdHcgPSAnd2Via2l0JyxcclxuXHRcdFx0XHRzID0gJ3NhZmFyaScsXHJcblx0XHRcdFx0byA9ICdvcGVyYScsXHJcblx0XHRcdFx0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcclxuXHRcdFx0XHRiID0gWyghKC9vcGVyYXx3ZWJ0di9pLnRlc3QodWEpKSAmJiAvbXNpZVxccyhcXGQpLy50ZXN0KHVhKSkgPyAoJ2llIGllJyArIHBhcnNlRmxvYXQobmF2aWdhdG9yLmFwcFZlcnNpb24uc3BsaXQoXCJNU0lFXCIpWzFdKSkgOiBpcygnZmlyZWZveC8yJykgPyBnICsgJyBmZjInIDogaXMoJ2ZpcmVmb3gvMy41JykgPyBnICsgJyBmZjMgZmYzXzUnIDogaXMoJ2ZpcmVmb3gvMycpID8gZyArICcgZmYzJyA6IGlzKCdnZWNrby8nKSA/IGcgOiBpcygnb3BlcmEnKSA/IG8gKyAoL3ZlcnNpb25cXC8oXFxkKykvLnRlc3QodWEpID8gJyAnICsgbyArIFJlZ0V4cC5qUXVlcnkxIDogKC9vcGVyYShcXHN8XFwvKShcXGQrKS8udGVzdCh1YSkgPyAnICcgKyBvICsgUmVnRXhwLmpRdWVyeTIgOiAnJykpIDogaXMoJ2tvbnF1ZXJvcicpID8gJ2tvbnF1ZXJvcicgOiBpcygnY2hyb21lJykgPyB3ICsgJyBjaHJvbWUnIDogaXMoJ2lyb24nKSA/IHcgKyAnIGlyb24nIDogaXMoJ2FwcGxld2Via2l0LycpID8gdyArICcgJyArIHMgKyAoL3ZlcnNpb25cXC8oXFxkKykvLnRlc3QodWEpID8gJyAnICsgcyArIFJlZ0V4cC5qUXVlcnkxIDogJycpIDogaXMoJ21vemlsbGEvJykgPyBnIDogJycsIGlzKCdqMm1lJykgPyAnbW9iaWxlJyA6IGlzKCdpcGhvbmUnKSA/ICdpcGhvbmUnIDogaXMoJ2lwb2QnKSA/ICdpcG9kJyA6IGlzKCdtYWMnKSA/ICdtYWMnIDogaXMoJ2RhcndpbicpID8gJ21hYycgOiBpcygnd2VidHYnKSA/ICd3ZWJ0dicgOiBpcygnd2luJykgPyAnd2luJyA6IGlzKCdmcmVlYnNkJykgPyAnZnJlZWJzZCcgOiAoaXMoJ3gxMScpIHx8IGlzKCdsaW51eCcpKSA/ICdsaW51eCcgOiAnJywgJ2pzJ107XHJcblxyXG5cdFx0XHRjID0gYi5qb2luKCcgJyk7XHJcblxyXG5cdFx0XHRpZiAoJC5icm93c2VyLm1vYmlsZSkge1xyXG5cdFx0XHRcdGMgKz0gJyBtb2JpbGUnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoaGFzVG91Y2gpIHtcclxuXHRcdFx0XHRjICs9ICcgdG91Y2gnO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRoLmNsYXNzTmFtZSArPSAnICcgKyBjO1xyXG5cclxuXHRcdFx0Ly8gSUUxMSBEZXRlY3RcclxuXHRcdFx0dmFyIGlzSUUxMSA9ICEod2luZG93LkFjdGl2ZVhPYmplY3QpICYmIFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdztcclxuXHJcblx0XHRcdGlmIChpc0lFMTEpIHtcclxuXHRcdFx0XHQkKCdodG1sJykucmVtb3ZlQ2xhc3MoJ2dlY2tvJykuYWRkQ2xhc3MoJ2llIGllMTEnKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIERhcmsgYW5kIEJveGVkIENvbXBhdGliaWxpdHlcclxuXHRcdFx0aWYoJCgnYm9keScpLmhhc0NsYXNzKCdkYXJrJykpIHtcclxuXHRcdFx0XHQkKCdodG1sJykuYWRkQ2xhc3MoJ2RhcmsnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYoJCgnYm9keScpLmhhc0NsYXNzKCdib3hlZCcpKSB7XHJcblx0XHRcdFx0JCgnaHRtbCcpLmFkZENsYXNzKCdib3hlZCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcblx0JC5icm93c2VyU2VsZWN0b3IoKTtcclxuXHJcbn0pKGpRdWVyeSk7XHJcblxyXG4vLyBNYWlsYm94XHJcbihmdW5jdGlvbih0aGVtZSwgJCkge1xyXG5cclxuXHR0aGVtZSA9IHRoZW1lIHx8IHt9O1xyXG5cclxuXHR2YXIgaW5zdGFuY2VOYW1lID0gJ19fbWFpbGJveCc7XHJcblxyXG5cdHZhciBjYXBpdGFsaXplU3RyaW5nID0gZnVuY3Rpb24oIHN0ciApIHtcclxuICAgIFx0cmV0dXJuIHN0ci5jaGFyQXQoIDAgKS50b1VwcGVyQ2FzZSgpICsgc3RyLnNsaWNlKCAxICk7XHJcblx0fVxyXG5cclxuXHR2YXIgTWFpbGJveCA9IGZ1bmN0aW9uKCR3cmFwcGVyKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5pbml0aWFsaXplKCR3cmFwcGVyKTtcclxuXHR9O1xyXG5cclxuXHRNYWlsYm94LnByb3RvdHlwZSA9IHtcclxuXHRcdGluaXRpYWxpemU6IGZ1bmN0aW9uKCR3cmFwcGVyKSB7XHJcblx0XHRcdGlmICggJHdyYXBwZXIuZGF0YSggaW5zdGFuY2VOYW1lICkgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuJHdyYXBwZXIgPSAkd3JhcHBlcjtcclxuXHJcblx0XHRcdHRoaXNcclxuXHRcdFx0XHQuc2V0VmFycygpXHJcblx0XHRcdFx0LnNldERhdGEoKVxyXG5cdFx0XHRcdC5idWlsZCgpXHJcblx0XHRcdFx0LmV2ZW50cygpO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldFZhcnM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLnZpZXcgPSBjYXBpdGFsaXplU3RyaW5nKCB0aGlzLiR3cmFwcGVyLmRhdGEoICdtYWlsYm94LXZpZXcnICkgfHwgXCJcIiApO1xyXG5cclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldERhdGE6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiR3cmFwcGVyLmRhdGEoaW5zdGFuY2VOYW1lLCB0aGlzKTtcclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRidWlsZDogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRpZiAoIHR5cGVvZiB0aGlzWyAnYnVpbGQnICsgdGhpcy52aWV3IF0gPT09ICdmdW5jdGlvbicgKSB7XHJcblx0XHRcdFx0dGhpc1sgJ2J1aWxkJyArIHRoaXMudmlldyBdLmNhbGwoIHRoaXMgKTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSxcclxuXHJcblx0XHRldmVudHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoIHR5cGVvZiB0aGlzWyAnZXZlbnRzJyArIHRoaXMudmlldyBdID09PSAnZnVuY3Rpb24nICkge1xyXG5cdFx0XHRcdHRoaXNbICdldmVudHMnICsgdGhpcy52aWV3IF0uY2FsbCggdGhpcyApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGRGb2xkZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiR3cmFwcGVyLmZpbmQoJy5tYWlsYm94LWVtYWlsLWxpc3QgLm5hbm8nKS5uYW5vU2Nyb2xsZXIoe1xyXG5cdFx0XHRcdGFsd2F5c1Zpc2libGU6IHRydWUsXHJcblx0XHRcdFx0cHJldmVudFBhZ2VTY3JvbGxpbmc6IHRydWVcclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkRW1haWw6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmJ1aWxkQ29tcG9zZXIoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0YnVpbGRDb21wb3NlOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5idWlsZENvbXBvc2VyKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGJ1aWxkQ29tcG9zZXI6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiR3cmFwcGVyLmZpbmQoICcjY29tcG9zZS1maWVsZCcgKS5zdW1tZXJub3RlKHtcclxuXHRcdFx0XHRoZWlnaHQ6IDI1MCxcclxuXHRcdFx0XHR0b29sYmFyOiBbXHJcblx0XHRcdFx0XHRbJ3N0eWxlJywgWydzdHlsZSddXSxcclxuXHRcdFx0XHRcdFsnZm9udCcsIFsnYm9sZCcsICdpdGFsaWMnLCAndW5kZXJsaW5lJywgJ2NsZWFyJ11dLFxyXG5cdFx0XHRcdFx0Wydmb250bmFtZScsIFsnZm9udG5hbWUnXV0sXHJcblx0XHRcdFx0XHRbJ2NvbG9yJywgWydjb2xvciddXSxcclxuXHRcdFx0XHRcdFsncGFyYScsIFsndWwnLCAnb2wnLCAncGFyYWdyYXBoJ11dLFxyXG5cdFx0XHRcdFx0WydoZWlnaHQnLCBbJ2hlaWdodCddXSxcclxuXHRcdFx0XHRcdFsndGFibGUnLCBbJ3RhYmxlJ11dLFxyXG5cdFx0XHRcdFx0WydpbnNlcnQnLCBbJ2xpbmsnLCAncGljdHVyZScsICd2aWRlbyddXSxcclxuXHRcdFx0XHRcdFsndmlldycsIFsnZnVsbHNjcmVlbiddXSxcclxuXHRcdFx0XHRcdFsnaGVscCcsIFsnaGVscCddXVxyXG5cdFx0XHRcdF1cclxuXHRcdFx0fSk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGV2ZW50c0NvbXBvc2U6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJGNvbXBvc2VyLFxyXG5cdFx0XHRcdCRjb250ZW50Qm9keSxcclxuXHRcdFx0XHQkaHRtbCxcclxuXHRcdFx0XHQkaW5uZXJCb2R5O1xyXG5cclxuXHRcdFx0JGNvbXBvc2VyXHRcdD0gJCggJy5ub3RlLWVkaXRhYmxlJyApO1xyXG5cdFx0XHQkY29udGVudEJvZHlcdD0gJCggJy5jb250ZW50LWJvZHknICk7XHJcblx0XHRcdCRodG1sXHRcdFx0PSAkKCAnaHRtbCcgKTtcclxuXHRcdFx0JGlubmVyQm9keVx0XHQ9ICQoICcuaW5uZXItYm9keScgKTtcclxuXHJcblx0XHRcdHZhciBhZGp1c3RDb21wb3NlU2l6ZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBjb21wb3NlckhlaWdodCxcclxuXHRcdFx0XHRcdGNvbXBvc2VyVG9wLFxyXG5cdFx0XHRcdFx0Y29udGVudEJvZHlQYWRkaW5nQm90dG9tLFxyXG5cdFx0XHRcdFx0aW5uZXJCb2R5SGVpZ2h0LFxyXG5cdFx0XHRcdFx0dmlld3BvcnRIZWlnaHQsXHJcblx0XHRcdFx0XHR2aWV3cG9ydFdpZHRoO1xyXG5cclxuXHJcblx0XHRcdFx0Y29udGVudEJvZHlQYWRkaW5nQm90dG9tXHQ9IHBhcnNlSW50KCAkY29udGVudEJvZHkuY3NzKCdwYWRkaW5nQm90dG9tJyksIDEwICkgfHwgMDtcclxuXHRcdFx0XHR2aWV3cG9ydEhlaWdodFx0XHRcdFx0PSBNYXRoLm1heCggZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCwgd2luZG93LmlubmVySGVpZ2h0IHx8IDAgKTtcclxuXHRcdFx0XHR2aWV3cG9ydFdpZHRoXHRcdFx0XHQ9IE1hdGgubWF4KCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsIHdpbmRvdy5pbm5lcldpZHRoIHx8IDAgKTtcclxuXHJcblx0XHRcdFx0JGNvbXBvc2VyLmNzcyggJ2hlaWdodCcsICcnICk7XHJcblxyXG5cdFx0XHRcdGlmICggdmlld3BvcnRXaWR0aCA8IDc2NyB8fCAkaHRtbC5oYXNDbGFzcygnbW9iaWxlLWRldmljZScpICkge1xyXG5cdFx0XHRcdFx0Y29tcG9zZXJUb3BcdCAgID0gJGNvbXBvc2VyLm9mZnNldCgpLnRvcDtcclxuXHRcdFx0XHRcdGNvbXBvc2VySGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQgLSBjb21wb3NlclRvcDtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0aWYgKCAkaHRtbC5oYXNDbGFzcyggJ2ZpeGVkJyApICkge1xyXG5cdFx0XHRcdFx0XHRjb21wb3NlclRvcFx0PSAkY29tcG9zZXIub2Zmc2V0KCkudG9wO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0Y29tcG9zZXJUb3BcdD0gJGNvbXBvc2VyLnBvc2l0aW9uKCkudG9wO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Y29tcG9zZXJIZWlnaHQgPSAkaW5uZXJCb2R5Lm91dGVySGVpZ2h0KCkgLSBjb21wb3NlclRvcDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGNvbXBvc2VySGVpZ2h0IC09IGNvbnRlbnRCb2R5UGFkZGluZ0JvdHRvbTtcclxuXHJcblx0XHRcdFx0JGNvbXBvc2VyLmNzcyh7XHJcblx0XHRcdFx0XHRoZWlnaHQ6IGNvbXBvc2VySGVpZ2h0XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHR2YXIgdGltZXI7XHJcblx0XHRcdCQod2luZG93KVxyXG5cdFx0XHRcdC5vbiggJ3Jlc2l6ZSBvcmllbnRhdGlvbmNoYW5nZSBzaWRlYmFyLWxlZnQtdG9nZ2xlIG1haWxib3gtcmVjYWxjJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVyICk7XHJcblx0XHRcdFx0XHR0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdGFkanVzdENvbXBvc2VTaXplKCk7XHJcblx0XHRcdFx0XHR9LCAxMDApO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0YWRqdXN0Q29tcG9zZVNpemUoKTtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQvLyBleHBvc2UgdG8gc2NvcGVcclxuXHQkLmV4dGVuZCh0aGVtZSwge1xyXG5cdFx0TWFpbGJveDogTWFpbGJveFxyXG5cdH0pO1xyXG5cclxuXHQvLyBqcXVlcnkgcGx1Z2luXHJcblx0JC5mbi50aGVtZU1haWxib3ggPSBmdW5jdGlvbihvcHRzKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG5cclxuXHRcdFx0aWYgKCR0aGlzLmRhdGEoaW5zdGFuY2VOYW1lKSkge1xyXG5cdFx0XHRcdHJldHVybiAkdGhpcy5kYXRhKGluc3RhbmNlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBNYWlsYm94KCR0aGlzKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcbn0pLmFwcGx5KHRoaXMsIFt3aW5kb3cudGhlbWUsIGpRdWVyeV0pOyIsIi8vIFRvb2x0aXAgYW5kIFBvcG92ZXJcclxuKGZ1bmN0aW9uKCQpIHtcclxuXHQkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykudG9vbHRpcCgpO1xyXG5cdCQoJ1tkYXRhLXRvZ2dsZT1cInBvcG92ZXJcIl0nKS5wb3BvdmVyKCk7XHJcbn0pKGpRdWVyeSk7XHJcblxyXG4vLyBUYWJzXHJcbiQoJ2FbZGF0YS10b2dnbGU9XCJ0YWJcIl0nKS5vbignc2hvd24uYnMudGFiJywgZnVuY3Rpb24gKGUpIHtcclxuXHQkKHRoaXMpLnBhcmVudHMoJy5uYXYtdGFicycpLmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcblx0JCh0aGlzKS5wYXJlbnRzKCcubmF2LXBpbGxzJykuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuXHQkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKS5wYXJlbnQoKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbn0pO1xyXG5cclxuLy8gQm9vdHN0cmFwIERhdGVwaWNrZXJcclxuaWYgKHR5cGVvZigkLmZuLmRhdGVwaWNrZXIpICE9ICd1bmRlZmluZWQnKSB7XHJcblx0JC5mbi5ib290c3RyYXBEUCA9ICQuZm4uZGF0ZXBpY2tlci5ub0NvbmZsaWN0KCk7XHJcbn0iLCIoZnVuY3Rpb24oYSl7KGpRdWVyeS5icm93c2VyPWpRdWVyeS5icm93c2VyfHx7fSkubW9iaWxlPS8oaXBob25lfGlwYWR8aXBvZHxhbmRyb2lkKS9pLnRlc3QoYSl8fC8oaXBob25lfGlwYWR8aXBvZHxhbmRyb2lkfGJiXFxkK3xtZWVnbykuK21vYmlsZXxhdmFudGdvfGJhZGFcXC98YmxhY2tiZXJyeXxibGF6ZXJ8Y29tcGFsfGVsYWluZXxmZW5uZWN8aGlwdG9wfGllbW9iaWxlfGlwKGhvbmV8b2QpfGlyaXN8a2luZGxlfGxnZSB8bWFlbW98bWlkcHxtbXB8bW9iaWxlLitmaXJlZm94fG5ldGZyb250fG9wZXJhIG0ob2J8aW4paXxwYWxtKCBvcyk/fHBob25lfHAoaXhpfHJlKVxcL3xwbHVja2VyfHBvY2tldHxwc3B8c2VyaWVzKDR8NikwfHN5bWJpYW58dHJlb3x1cFxcLihicm93c2VyfGxpbmspfHZvZGFmb25lfHdhcHx3aW5kb3dzIChjZXxwaG9uZSl8eGRhfHhpaW5vL2kudGVzdChhKXx8LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2kudGVzdChhLnN1YnN0cigwLDQpKX0pKG5hdmlnYXRvci51c2VyQWdlbnR8fG5hdmlnYXRvci52ZW5kb3J8fHdpbmRvdy5vcGVyYSk7Il0sInNvdXJjZVJvb3QiOiIifQ==