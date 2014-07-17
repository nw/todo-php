(function(){
	var events;
	var check = function(e){
		var target = $(e.target);
		var parents = target.getParents();
		events.each(function(item){
			var element = item.element;
			if (element != target && !parents.contains(element)) 
				item.fn.call(element, e);
		});
	};

	Element.Events.outerClick = {
		onAdd: function(fn){
			if(!events) {
				document.addEvent('click', check);
				events = [];
			}
			events.push({element: this, fn: fn});
		},

		onRemove: function(fn){
			events = events.filter(function(item){
				return item.element != this || item.fn != fn;
			}, this);
			if (!events.length) {
				document.removeEvent('click', check);
				events = null;
			}
		}
	};
})();

Request.implement({
	processScripts: function(text){
		if(this.getHeader('X-JSON')) return JSON.decode(text);
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return $exec(text);
		return text.stripScripts(this.options.evalScripts);
	}	
});

Fx.Block.Explode2 = function(e, x, y, c, r, d) {
	q = (Math.random() * 70) + 30;
	dx = (x-(c/3)+1) * q;
	dy = (y-(c/2)+1) * q;
	//t = Math.tan(dy/dx) + (Math.random()*20);
	return {
		'margin-top': dy,
		'margin-left': dx,
		'opacity': 0,
		'delay': 0
	};
};


var Todos = new Class({
	
	active : false,
	
	list : $H(),	
	queue : [],
	order : [],
	nodes : [],
	
	initialize : function(){
		
		this.container = $('list');
		
		// Be responsible with your events.
		// bind created to remove outerclick event when not needed.
		this.cancelFunc = this.cancel.bind(this);
		
		// add todo form
		this.create_todo = $('create_todo'); 
		this.msg = this.create_todo.getElement('textarea');
		this.create_todo.getElement('input').addEvent('click',this.add.bind(this));
				
		var sortOptions = {
			'revert' : { duration : 700 },
			'constrain' : false, 
			'clone' : true,
			'opacity' : .3,
			'onStart' : this.sortStart.bind(this),
			'onComplete' : this.sortComplete.bind(this)
		};
		
		this.todoSortables = new Sortables(null, $merge(sortOptions,{'handle' : '.top'}) );
	
	
		this.refreshRequest = new Request({
			url : 'json.todoList',
			link : 'ignore',
			onRequest : function(){
				this.container.empty();
				this.container.addClass('loading');
			}.bind(this),
			onSuccess : function(resp){
				this.queue = resp;
				this.process();
			}.bind(this),
			onComplete : function(){
				this.container.removeClass('loading');
			}.bind(this)
		});
		
		this.addRequest = 	new Request({
			url : 'create.todo',
			'link' : 'ignore',
			onRequest : function(){
				this.msg.addClass('loading');
			}.bind(this),
			onSuccess : function(resp){
				this.queue.push(resp);
				this.process(true);
			}.bind(this),
			onComplete : function(){
				this.msg.removeClass('loading');
				this.msg.set('value','');
			}.bind(this)
		});

		this.refresh();
//		this.refresh.periodical(1000*20,this);
	},
	
	refresh : function (){

		this.list.empty();
		this.queue = [];
		this.order = [];
		this.todoSortables.removeItems(this.nodes).destroy();
		this.nodes = [];
		
		this.refreshRequest.send();	
	},
	
	/*
	 Injection should be based on priority
	 it should crawl and compare to find its spot
	*/
	process : function(flag){
		
		var todo = this.queue.shift();
		if(!todo) return this.todoSortables.attach();
		
		var el = new Element('div',{
					'id' : 'todo_'+todo.id,
					'class' : 'todo',
					'events' : {
						'mouseover' : this.over.bind(this,todo.id),
						'mouseout' : this.out.bind(this,todo.id),
						'dblclick' : this.remove.bind(this,todo.id),
						'click' : this.edit.bind(this,todo.id)
					}});
		
		this.list.set(todo.id,{
			'data' : todo,
			'el' : el,
			'started' : new Element('span',{'class' : 'started', 'html' : this.relative_time(todo.created)}).inject(el),
			'category' : new Element('span',{'class' : 'category', 'html' : todo.category}).inject(el),
			'top' : new Element('div',{'class' : 'top'}).inject(el),
			'message' : new Element('p',{'html' : todo.message }).inject(el),
			'status' : new Element('span',{'class' : 'status', 'html' : ((todo.status.toInt()) ? 'completed' : 'incomplete')}).inject(el)
		});

		this.order.unshift(todo.id);
		this.nodes.push(el);
		this.todoSortables.addItems(el);
		
		if(flag){
			
			el.setStyles({'position' : 'absolute', 'left' : -1000 }).inject(this.container,'top');
			var h = el.getSize().y;
			el.setStyles({'height' : 0, 'left' : '', 'opacity' : .2, 'overflow' : 'hidden', 'position' : '' });			
			
			new Fx.Morph(el,{
				duration : 300, 
				onComplete : function(){ 
					el.setStyles({'overflow' : ''});
					this.process();
				}.bind(this) 
			}).start({'height' : h, 'opacity' : 1 });
			return;
		} else {
			el.inject(this.container,'top');
			this.process();
		}
		
	},
	
	add : function(){
		this.addRequest.send(this.create_todo.toQueryString());	
		return false;
	},
	
	remove : function(id){
		
		var el = this.list.get(id).el.removeEvents();
		this.todoSortables.removeItems(el);
		this.nodes.erase(el);
		this.list.erase(id);
		this.order.erase(id);
		
		new Fx.Block(el, { 
			effect: Fx.Block.Explode2, 
			rows: 4 /* 2 */, 
			cols: Math.round(el.getSize().x / 20 /* 25 */),
			delay: 300,
			duration: 1000,
			transition: Fx.Transitions.Sine.easeOut,
			effect: Fx.Block.DropRandom, transition: Fx.Transitions.Quint.easeIn
		}).start();
		el.setStyles({'overflow' : 'hidden'});
		
		new Fx.Morph(el,{ 
			duration: 1400,
			onComplete : function(){
				this.destroy();
			}.bind(el)
			}).start({ 'height' : 0 });
			
		return false;
		
	},
	
	edit : function(id){
		
		if(this.active == id) return false;
		
		var todo = this.list.get(id);
		if(!todo) return false;

		if(this.active) this.cancel();
		this.active = id;	
		
		// register outClick event
		todo.el.addEvent('outerClick',this.cancelFunc);
		
		var txt = new Element('textarea',{
			'html' : todo.message.get('html'),
			'class' : 'active',
			'styles' : {
				width : todo.message.getStyle('width'),
				height : todo.message.getStyle('height')
			}
		}).inject(todo.message.getParent());
		
		var coords = txt.getParent().getCoordinates();
		
		var submit = new Element('span',{
			'class' : 'submit',
			'html' : 'submit',
			'styles' : {
				'left' : coords.width - 2
			}, 
			'events' : {
				'mouseover' : function(){ this.addClass('over'); },
				'mouseout' : function(){ this.removeClass('over'); }
			}
		}).inject(txt.getParent());
		
		var cancel = new Element('span',{
			'class' : 'cancel',
			'html' : 'cancel',
			'styles' : {
				'left' : coords.width - 2
			},
			'events' : {
				'mouseover' : function(){ this.addClass('over'); },
				'mouseout' : function(){ this.removeClass('over'); },
				'click' : this.cancel.bind(this)
			}
		}).inject(txt.getParent());
		
		todo.submit = submit;
		todo.cancel = cancel;
		todo.message = txt.replaces(todo.message);
		txt.focus();
		
		return false;
	},
		
	cancel : function(){
		if(!this.active) return false;
		var todo = this.list.get(this.active);
		if(!todo || !todo.el) return false;
		
		todo.el.removeEvent('outerClick',this.cancelFunc);
		
		this.active = null;
		
		var p = new Element('p',{
			'html' : todo.message.get('value')
		}).inject(todo.message.getParent());

		todo.message = p.replaces(todo.message);
		todo.submit.destroy();
		todo.cancel.destroy();

		todo.el.fireEvent('mouseout');
		return false;
	},

	over : function(id){
		this.list.get(id).el.addClass('over');
	},
	
	out : function(id){
		if(this.active == id) return false;
		this.list.get(id).el.removeClass('over');
	},

	sortStart : function(item,clone){
		clone.setStyles({'z-index' : 1000, 'opacity' : .8});
	},	
	
	// disable this event from firing when deleting
	sortComplete : function(){
		console.debug('sort completed....');
		// second loop could be included within this.
		var sorted = $$('#list .todo').map(function(todo,idx){
			return todo.get('id').replace('todo_','');
		});
	
		var serial = {}; var changed = [];
		for(var i = 0, l = this.order.length; i < l; i++){
			if(this.order[i] != sorted[i]){
				var priority = this.list.get(this.order[i]).data.priority;
				changed.push([sorted[i], priority]);
				serial[sorted[i]] = priority;
			}
		}
		
		if(!changed.length) 
			return false;
		
		changed.each(function(todo){
			this.list.get(todo[0]).data.priority = todo[1];
		},this);
		
		this.order = sorted;
		
		new Request({
			url : 'json.reorder'
		}).send(JSON.encode(serial));
		
		return; //serial.join(',');
	},
		
	relative_time : function(C){
	    var B = C.split(" ");
	    C = B[1] + " " + B[2] + ", " + B[5] + " " + B[3];
	    var A = Date.parse(C);
	    var D = (arguments.length > 1) ? arguments[1] : new Date();
	    var E = parseInt((D.getTime() - A) / 1000);
	    E = E + (D.getTimezoneOffset() * 60);
	    if (E < 60) {
	        return "less than a minute ago"
	    } else {
	        if (E < 120) {
	            return "about a minute ago"
	        } else {
	            if (E < (60 * 60)) {
	                return (parseInt(E / 60)).toString() + " minutes ago"
	            } else {
	                if (E < (120 * 60)) {
	                    return "about an hour ago"
	                } else {
	                    if (E < (24 * 60 * 60)) {
	                        return "about " + (parseInt(E / 3600)).toString() + " hours ago"
	                    } else {
	                        if (E < (48 * 60 * 60)) {
	                            return "1 day ago"
	                        } else {
	                            return (parseInt(E / 86400)).toString() + " days ago"
	                        }
	                    }
	                }
	            }
	        }
	    }		
	}	
	
	
});


var App = new Class({
	
	
	initialize : function(){
		
		this.todos = new Todos();

	}
	
});

window.addEvent('domready',function(){
	$('settings_link').store('shown',false);
	
	var fx = new Fx.Tween('settings',{duration : 1200});
	
	$('settings_link').addEvent('click',function(){
		var state = this.retrieve('shown');
		if(!state) fx.start('height',150);	
		else  fx.start('height',0);
		this.store('shown',!state);
	});
	
	
	
	new App();	
});
