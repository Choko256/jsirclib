/**
 * IRC Message Sender - Message origin
 */
var IRCOrigin = function(prefix) {
	var _prefix = (prefix[0] == ':' ? prefix.substring(1) : prefix);
	this.nickname = "";
	this.username = "";
	this.host = "";
	
	this.parse = function() {
		var hs = 0;
		var nu_pos = _prefix.indexOf('!');
		if(nu_pos > -1) {
			this.nickname = _prefix.substring(0, nu_pos);
			this.username = _prefix.substring(nu_pos + 1, _prefix.indexOf('@'));
			hs = _prefix.indexOf('@') + 1;
		}
		this.host = _prefix.substring(hs);
	};
};

/**
 * IRC Message
 */
var IRCMessage = function(raw) {
	var _raw = raw;
	this.sender = null;
	this.command = "";
	this.target = "";
	this.args = new Array();
	this.message = "";
	
	this.parse = function() {
		var pieces = _raw.split(' ');
		var i = 0;
		if(pieces[i][0] == ':') {
			this.sender = new IRCOrigin(pieces[i++]);
		}
		this.command = pieces[i++].toLowerCase();
		if(pieces[i][0] != ':') {
			this.target = pieces[i++];
			while(pieces[i][0] != ':') {
				this.args.push(pieces[i++]);
			}
		}
		if(i < pieces.length && pieces[i][0] == ':') {
			this.message = pieces[i];
		}
	};
};
