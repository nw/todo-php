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

var ToDos = new Class({
	
	initialize : function(){
		
		this.list = $$('#list .todo');
		
		this.list.each(function(todo){
			var spans = todo.getElements('span, select');
			todo.store('spans' , spans);
			todo.store('outFunc' , this.outClick.bind(this,todo));
			todo.store('note' , todo.getElement('p'));
			
			spans.setStyle('visibility','hidden');
			
			spans.each(function(span){
				span.addEvent('click' , this.spanClicked.bind(this,span))
			},this);
			
			
			todo.addEvents({
				'mouseover' : this.over.bind(this,todo),
				'mouseout' : this.out.bind(this,todo),
				'click' : this.clicked.bind(this,todo)
			});

			var sortables = new Sortables(null, {
				'revert' : { duration : 700 },
				'constrain' : false,
				'clone' : true,
				'opacity' : 1,
				'handle' : '.top',
				'onStart' : function(item,clone){
			//		console.debug(item,clone);
					clone.setStyles({'z-index' : 1000, 'opacity' : .8});
				}
			});
			sortables.addItems(todo);
			sortables.attach();
			
			new Sortables('#sidebar .section',{
				'constrain' : false,
				'clone' : true,
				'handle' : 'h3',
				'onStart' : function(item,clone){
					clone.setStyles({'z-index' : 1000, 'opacity' : .8});
				}
			}).attach();
			//.addItems($$('#sidebar .section')).attach();
			
			
			new Sortables(null,{
				'constrain' : true,
				'clone' : true,
				'onStart' : function(item,clone){
					clone.setStyles({'z-index' : 1000, 'opacity' : .8});
				}
			}).addItems($$('ul.categories li')).attach();
			
			
		},this);
		
		
	},
	
	spanClicked : function(el){
		return;
		var coords = el.getParent().getCoordinates();
		var c = el.getCoordinates();
		var menu = new Element('div',{
			'styles' : {
				'position' : 'absolute',
				'width' : c.width,
				'height' : c.height*3 + 20,
				'top' : -20,
				'left' : coords.width - c.width,
				'border' : '1px solid #999',
				'background' : '#EEE',
				'z-index' : 5
			}
		});
		
		if(el.hasClass('category')){
				menu.setStyles({
					'width' : c.width / 2,
					'left' : coords.width - (c.width / 2)
				}).inject(el.getParent());
		}
	},
	
	clicked : function(el){
		if(el.retrieve('active')) return false;
		el.store('active',true);
		el.addEvent( 'outerClick' , el.retrieve('outFunc'));
		
		var note = el.retrieve('note');
		var txt = new Element('textarea', {
			'html' : note.get('html'),
			'class' : 'active',
			'styles' : {
				'font-family' : 'verdana',
				'display': 'block',
				'width': note.getStyle('width'),
				'background-color': '#DDD',
				'border': 'none',
				'clear': 'both',
				'margin': '0 0 3px 0',
				'padding': '8px 5px',
				'border': '1px dotted #999',
				'font-size': '14px',
				'vertical-align' : 'baseline',
				'text-align' : 'left',
				'color': '#333' ,
				'height' : note.getStyle('height')
			}
		}).inject(note.getParent());
		
		
		el.store('note',txt.replaces(note));
		
		txt.focus();
		
		
		var coords = txt.getParent().getCoordinates();
		
		var submit = new Element('span',{
			'html' : 'submit',
			'styles' : {
				'border' : '1px dotted #999',
				'background' : '#F6F6F6',
				'border-left' : 'none',
				'width' : 40,
				'text-align' : 'center',
				'padding' : 2,
				'position' : 'absolute',
				'top' : 25,
				'left' : coords.width
			}	,
				'events' : {
					'mouseover' : function(){ this.setStyles({'background-color' : '#999', 'color' : '#EEE'}); },
					'mouseout' : function(){ this.setStyles({'background-color' : '#F6F6F6', 'color' : '#999'}); }
				}
		}).inject(txt.getParent());
		
		var cancel = new Element('span',{
			'html' : 'cancel',
			'styles' : {
				'border' : '1px dotted #999',
				'background' : '#F6F6F6',
				'border-left' : 'none',
				'width' : 40,
				'text-align' : 'center',
				'padding' : 2,
				'position' : 'absolute',
				'top' : 48,
				'left' : coords.width
			},
			'events' : {
				'mouseover' : function(){ this.setStyles({'background-color' : '#999', 'color' : '#EEE'}); },
				'mouseout' : function(){ this.setStyles({'background-color' : '#F6F6F6', 'color' : '#999'}); }
			}
		}).inject(txt.getParent());
		
		el.store('submit',submit);
		el.store('cancel',cancel);
		
		return false;
	},
	
	outClick : function(el){
		el.removeEvent('outerClick', el.retrieve('outFunc'));
		
		var note = el.retrieve('note');
		var p = new Element('p',{
			'html' : note.get('value')
		}).inject(note.getParent());
		
		el.store('note',p.replaces(note));
		
		el.retrieve('submit').destroy();
		el.retrieve('cancel').destroy();
		
		el.store('active',false);
		this.out(el);
	},
	
	over : function(el){
		el.retrieve('spans').setStyle('visibility','visible');
	},
	
	out : function(el){
		if(el.retrieve('active')) return false;
		el.retrieve('spans').setStyle('visibility','hidden');
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
	
	new ToDos();
	
});