var noop = function() {};

var router = {
  table: {},

  add: function(rule, handler){
    var originalRule = rule;
    if(rule instanceof RegExp){
      // if the rule is a RegExp, leave out the surrounding '/'
      rule = rule.toString().slice(1,-1);
    } else{
      rule = 
          '^'
        + rule.toString()
          .replace(/\//g, '\\\/')
          // match pattern like /<param1>/<param2>/
          .replace(/<\w+>/g, '(\\w+)')
          // path like '/test/' and '/test' match the same rule
          // but must added as '/test/'
          .replace(/\/$/, '\/?')
        + '$';
    }
    this.table[rule] = {};
    // match pattern like '<param1>' and initialize the keys
    this.table[rule].params = originalRule.toString().match(/<\w*>/g) || [];
    this.table[rule].handler = handler;
  },

  match: function(path) {
    var obj = {};
    var params = {};
    // if not matched, do nothing
    obj.handler = noop;
    obj.matched = false;
    for(var rule in this.table){
      var matching = path.match(RegExp(rule));
      if(matching){
        var matched = this.table[rule];
        for(var i = 0; i < matched.params.length; i++){
          params[matched.params[i].replace(/<|>/g,'')] = matching[i+1];
          // RegExp here to cut '<' or '>' off in the names of the keys
        }
        obj.handler = matched.handler;
        obj.matched = true;
        break;
      }
    }
    obj.params = params;
    return obj;
  }
}

module.exports = router;