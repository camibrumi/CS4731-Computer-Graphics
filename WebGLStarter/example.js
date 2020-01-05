function main() 
{
	// Retrieve <canvas> element
	var canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	var gl = WebGLUtils.setupWebGL(canvas); // this is one method from on of the imported libraries. we want to do sth inside the canvas tag
	if (!gl) 
	{
		console.log('Failed to get the rendering context for WebGL');
		return;
	}
	
	// Initialize shaders
	program = initShaders(gl, "vshader", "fshader"); //gl parameter to say that we are in the gl context
	gl.useProgram(program);

	//Set up the viewport
	gl.viewport( 0, 0, canvas.width, canvas.height ); // canvas from 0,0 to height, width

	var points = []; // array
	points.push(vec4(0.5, -0.5, 0.0, 1.0)); // we give it a point WE CAN ALSO USE VEC3 AND WE REMOVE THE LAST COORDINATE
	points.push(vec4(-0.5, -0.5, 0.0, 1.0)); // we give it a point
	points.push(vec4(0.0, 0.5, 0.0, 1.0)); // we give it a point



	//memory buffer
	//we create a buffer in the gpu
	//lets create a buffer
	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer); // we make it an active buffer


	for (var i = 0; i < 50; ++i) {
		var points = [];
		points.push(vec4(0.5, -0.5, 0.0, 1.0)); // we give it a point WE CAN ALSO USE VEC3 AND WE REMOVE THE LAST COORDINATE
		points.push(vec4(-0.5, -0.5, 0.0, 1.0)); // we give it a point
		points.push(vec4(0.0, 0.5, 0.0, 1.0)); // we give it a point
		//now we take the data and we pass it to the active buffer
		//pass the data into the buffer
		gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW); //flatten because we want jus one dimentional array, but points is an array of arrays
	}


	//now we take the data and we pass it to the active buffer
	//pass the data into the buffer
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW); //flatten because we want jus one dimentional array, but points is an array of arrays

	// now we want to draw the points
	//we have to tell the vertex shader that it has to do a correspindence between the points we created above and the vPosition
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0); // 4 points per vector, each of them is a float, the last 3 param is a normalisation stuff, use them as default values, don't worry about them
	// we need t0 turn attribute on
	//we turn on the global variable we created in the shader
	gl.enableVertexAttribArray(vPosition);
	// -----all of the above id only for the position

	//Define the colors of our points
	var colors = []; // array
	colors.push(vec4(1.0, 0.0, 0.0, 1.0)); // we give it a point WE CAN ALSO USE VEC3 AND WE REMOVE THE LAST COORDINATE
	colors.push(vec4(0.0, 1.0, 0.0, 1.0)); // we give it a point
	colors.push(vec4(0.0, 0.0, 1.0, 1.0)); // we give it a point

	var cBuffer = gl.createBuffer(); // buffer e o matrita. se numeste asa pentru ca ia un pic sa se consume numerele din ea. numerele respective o sa reprezinte pixelii care se vor arata pe ecran. I guess.
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer); // we make it an active buffer
	//now we take the data and we pass it to the active buffer
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW); //flatten because we want jus one dimentional array, but points is an array of arrays

	// now we want to draw the points
	//we have to tell the vertex shader that it has to do a correspondence between the points we created above and the vPosition
	var vColor = gl.getAttribLocation(program, "vColor");
	//
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0); // 4 points per vector, each of them is a float, the last 3 param is a normalisation stuff, use them as default values, don't worry about them
	// we need t0 turn attribute on
	gl.enableVertexAttribArray(vColor);


	//var pointSizeLoc = gl.getUniformLocation(program, "vPointSize");
	//gl.uniform1f(pointSizeLoc, 10.0);
	// ---- above for the color

	gl.clearColor(0.0, 0.0, 0.0, 1.0); // we set the background. if we change the last parameter to 0.5, means that we change the transparency (alpha channel/ paramenter?)
	gl.clear(gl.COLOR_BUFFER_BIT); // I actually clear the backgroupnd
	gl.drawArrays(gl.POINTS, 0, points.length);
	//gl.drawArrays(g.TRIANGLES, 0, points.length);
	//gl.POINTS says that  we want points unified by
	//gl.LINES a line
	//gl.LINE_STRIP two lines
	//LINE_LOOP a triangle
	//TRIANGLES a coloured triangle

	//yesterday taking data and passing them to the shaders
	//when we create the buffer we make space in the memory
	// before drawing clear please!

	// add user interaction
	/*window.onkeypress = function(event) {
		var key = event.key;
		switch(key) {
			case 'a':
				gl.clearColor(0.0, 0.0, 0.0, 1.0); // we can avoid this if we want to use the same background
				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.drawArrays(gl.TRIANGLES, 0, points.length);
				break;
			case 'b':
				//gl.clearColor(0.0, 0.0, 0.0, 1.0); if we do not put this two lines the backgrouund will not appear again as defined before. we can void this line if we want the same background.
				//gl.clear(gl.COLOR_BUFFER_BIT);
				gl.drawArrays(gl.POINTS, 0, points.length);
				break;
		}
	}

	window.onclick = function(event) {
		gl.clear(gl.COLOR_BUFFER_BIT);
	}*/

	// the canvas is the place where we can see the background
	// the viewport s where we place the triangle


}
