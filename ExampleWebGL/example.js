//global
var gl;
var program;

var gl_PointSizecolors;
var theta = 0;
var alpha = 0;

function main()
{
	// Retrieve <canvas> element
	var canvas = document.getElementById('webgl');

	// Get the rendering context for WebGL
	gl = WebGLUtils.setupWebGL(canvas, undefined);

	//Check that the return value is not null.
	if (!gl)
	{
		console.log('Failed to get the rendering context for WebGL');
		return;
	}

	// Initialize shaders
	program = initShaders(gl, "vshader", "fshader");
	gl.useProgram(program);

	//Set up the viewport
	gl.viewport( 0, 0, canvas.width, canvas.height ); // we have to make sure that the canvas will contain the part of the virtual world we are interested in

	var points = [];
	points.push(vec4(0.5, -0.5, 0.0, 1.0)); //now 0.5, but larger numbers zoom in
	points.push(vec4(-0.5, -0.5, 0.0, 1.0));
	points.push(vec4(0.0, 0.5, 0.0, 1.0));


	//memory buffer
	//we create a buffer in the gpu
	//lets create a buffer
	var pBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
	//now we take the data and we pass it to the active buffer
	//pass the data into the buffer
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	// now we want to draw the points
	//we have to tell the vertex shader that it has to do a correspindence between the points we created above and the vPosition
	var vPosition = gl.getAttribLocation(program,  "vPosition");
	gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
	// we need t0 turn attribute on
	//we turn on the global variable we created in the shader
	gl.enableVertexAttribArray(vPosition);
	//

	//Define the colors of our points
	var colors = [];
	colors.push(vec4(1.0, 0.0, 0.0, 1.0));
	colors.push(vec4(0.0, 1.0, 0.0, 1.0));
	colors.push(vec4(0.0, 0.0, 1.0, 1.0));

	var cBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	//
	gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);



	var vColor = gl.getAttribLocation(program,  "vColor");

	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(vColor);
 	// Set clear color
	gl.clearColor(0.0, 0.0, 0.0, 1.0);

	// Clear <canvas> by clearning the color buffer
	gl.clear(gl.COLOR_BUFFER_BIT);

	var projMatrix = ortho(-1, 1, -1, 1, -1, 1); // bigger numbers we zoom out. if part of your image is dissapearing because it is out of the bounds of the viewspace, then change these coordinates in the ortho function. 2 param for x, y, z
	var projMatrixLoc = gl.getUniformLocation(program, "projMatrix");
	gl.uniformMatrix4fv(projectMatrixLoc, false, flatten(projMatrix));

	// Draw a point
	gl.drawArrays(gl.TRIANGLES, 0, points.length);







}

function render() {
	//rotateZ(theta), theta -=0.5
	var ctMatrix = rotateZ(theta);
  var translateMatrix = translate(alpha, 0, 0);
	var ctMatrix = mult(rotMatrix, translateMatrix);

	theta -= 0.5;
	alpha += 0.005;

	//matrix transformations
	var ctMatrix = gl.getUniformLocation(program, "modelMatrix");
	gl.uniformMatrix4fv(projMatrixLoc, false, flatten(ctMatrix)); // not finished!

	gl.clear(gl..COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, points.length);

	requestAnimationFrame(render);
}
