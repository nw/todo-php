Request.implement({
	processScripts: function(text){
		if(this.getHeader('X-JSON')) return JSON.decode(text);
		if (this.options.evalResponse || (/(ecma|java)script/).test(this.getHeader('Content-type'))) return $exec(text);
		return text.stripScripts(this.options.evalScripts);
	}	
});


var Tabber = new Class({
	
	active : null,
	
	initialize : function(tabs,content){
		this.tabs = $$(tabs);
		this.content = $$(content);
		
		
		this.tabs.each(function(tab,idx){
			if(tab.hasClass('active')){
				this.active = idx;
				this.content[idx].setStyle('display','block');
			} else {
				this.content[idx].setStyle('display','none');
			}
			
			tab.addEvents({
				'mouseover' : function(){ this.addClass('over'); },
				'mouseout' : function(){ this.removeClass('over'); },
				'click' : this.click.bind(this,idx)
			});
			
		},this);
		
	},
	
	click : function(idx){
		if(idx == this.active) return;
		
		this.tabs[this.active].removeClass('active');
		this.content[this.active].setStyle('display','none');
		
		this.tabs[idx].addClass('active');
		this.content[idx].setStyle('display','block');
		this.active = idx;
	}
});

var Login_Page = new Class({
	
	initialize : function(){
		this.loginForm  = $('user_login');
		this.createForm = $('create_account');
		
		this.checkButton = this.createForm.check.addEvent('click',function(){
			new Request({
				url : 'check.name',
				link : 'ignore',
				onRequest : function(){
					this.userAddParent.addClass('loading');
				}.bind(this),
				onSuccess : function(resp){
					if(resp) this.userAddParent.addClass('valid');
					else this.userAddParent.addClass('invalid');
				}.bind(this),
				onComplete : function(){
					this.userAddParent.removeClass('loading');
				}.bind(this)
			}).send(this.createForm.toQueryString());
			return false;
		}.bind(this));
		
		this.userAddField = this.createForm.user.addEvents({
			'focus' : function(){
				this.userAddParent.removeClass('valid').removeClass('invalid');
			}.bind(this),
			'blur' : function(){
				this.checkButton.fireEvent('click')
			}.bind(this)
		});
		
		this.userAddParent = this.userAddField.getParent();
		
		
	}
	
	
});




window.addEvent('domready',function(){
	new Tabber('.tab','.tabContent');
	new Login_Page();
});