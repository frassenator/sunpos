AFRAME.registerComponent("axes-helper", {
    schema: {
        size: {
            type: "number",
	    default: 5
        }
    },
    init: function () {
        var data = this.data;
        this.axes = new THREE.AxesHelper(data.size);
        this.el.setObject3D("axes-helper", this.axes);
    }
});
