"use strict";

var canvas;
var gl;

var numVertices  = 36;

var texSize = 64;

var program;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

var texture;

var minT = 0.0;
var maxT = 1.0;

//Texture coordinates at the corners of a quadrilateral

/*
//Sideways
var texCoord = [
    vec2(minT, minT),
    vec2(maxT, minT),
    vec2(maxT, maxT),
    vec2(minT, maxT)
];
*/

//Right side up

var texCoord = [
    vec2(minT, minT),
    vec2(minT, maxT),
    vec2(maxT, maxT),
    vec2(maxT, minT)
];

/*
//Flipped on vertical
var texCoord = [
    vec2(maxT, minT),
    vec2(maxT, maxT),
    vec2(minT, maxT),
    vec2(minT, minT)
];
*/
var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [45.0, 45.0, 45.0];

var thetaLoc;

function createATexture()
{
    //
    // Initialize a texture
    //

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);

    // Fill the texture with a 1x1 blue pixel.
    //Specify the array of the two-dimensional texture elements
    //target, level, iformat, format, type, image
    //target - lets us choose a single image or set up a cube map
    //level - mipmapping, where 0 denotes the highest resolution or that we are not using mipmapping
    //iformat - how to store the texture in memory
    //width
    //height
    //border - deprecated, so should always be 0
    //format and type - how the pixels are stored, so that WebGL knows how to read those pixels in
    //image - self-explanatory
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE,
        new Uint8Array([0, 0, 255, 255, 255, 0, 0, 255, 0, 0, 255, 255, 0, 0, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
}

function configureTexture( image ) {
    //Create a texture object
    texture = gl.createTexture();

    //Bind it as the current two-dimensional texture
    gl.bindTexture( gl.TEXTURE_2D, texture );

    //Needed to flip the image from top to bottom due to the different
    //coordinate systems used for the image and by our application
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    //How do we interpret a value of s or t outside of the range (0.0, 1.0)?
    //Generally, we want the texture either to repeat or to clamp the values to 0.0 or 1.0
    //By executing these functions after the gl.bindTexture, the parameters become part of the texture object
    //Other option for last parameter is gl.REPEAT, but that doesn't work here
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    //Specify the array of the two-dimensional texture elements
    //target, level, iformat, format, type, image
    //target - lets us choose a single image or set up a cube map
    //level - mipmapping, where 0 denotes the highest resolution or that we are not using mipmapping
    //iformat - how to store the texture in memory
    //format and type - how the pixels are stored, so that WebGL knows how to read those pixels in
    //image - self-explanatory
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );

    //The size of the pixel that we are trying to color on the screen may be smaller or larger than one pixel
    //magnification - the texel is larger than one pixel
    //minification - the texture is smaller than one pixel
    //NEAREST - use the value of the nearest point sampling
    //LINEAR - linear filtering
    //mip-mapping - create a series of texture arrays at reduced sizes; webgl requires row and column
    //dimensions that are powers of two
    //gl.NEAREST_MIPMAP_NEAREST
    //use point sampling with the best mipmap, filtering with the best mipmap, point sampling using linear filtering
    //between mipmaps, or both (NEAREST_MIPMAP_LINEAR, LINEAR_MIPMAP_NEAREST, LINEAR_MIPMAP_LINEAR)
    //gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    //Link the texture object we create in the application to the sampler in the fragment shader
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);
}


function colorCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    createATexture();
	
    var image = new Image();
	image.crossOrigin = "";
    //image.src = "http://web.cs.wpi.edu/~jmcuneo/grass.bmp";
	image.src = "https://web.cs.wpi.edu/~jmcuneo/a.jpg";
	//image.src = "SA2011_black.gif";
    image.onload = function() {
configureTexture( image );
    }
    

/*
    var image = document.getElementById("texImage");

    configureTexture( image );
*/
    thetaLoc = gl.getUniformLocation(program, "theta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    console.log(colorsArray.length);
    console.log(pointsArray.length);
    console.log(texCoordsArray.length);
    render();

}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );
    requestAnimFrame(render);
}
