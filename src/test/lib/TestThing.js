define(function(){
	function TestThing(props) {
		if(props) {
			for(var i in props) {
				this[i] = props[i];
			}
		}
	}
	TestThing.prototype.declaredClass = 'TestThing';

	TestThing.OtherThing = function(){};
	TestThing.OtherThing.prototype.declaredClass= 'OtherThing';
	
	return TestThing;
})