define(function(){
	function TestComplexThing(props) {
		if(props) {
			for(var i in props) {
				this[i] = props[i];
			}
		}
	}
	TestComplexThing.prototype.declaredClass = 'TestComplexThing';
	TestComplexThing.prototype.propertiesWithReferences = ['subthings', 'bundle'];

	return TestComplexThing;
})