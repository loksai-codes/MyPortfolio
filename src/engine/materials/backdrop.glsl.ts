// Studio backdrop dome: a seamless warm cyclorama. Deep warm black overhead, a soft spotlight pool
// behind the house, and the floor colour at the horizon so the floor sweeps up into the wall with no edge.
// Raw output (no colour-space chunk). Below the horizon it settles on the fog colour `hz`.
export const backdropVertex = /* glsl */ `varying vec3 d;
void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;

export const backdropFragment = /* glsl */ `uniform vec3 sd;uniform vec3 hz;varying vec3 d;
void main(){float h=clamp(d.y,-.2,1.);
  vec3 wall=vec3(.11,.08,.065),top=vec3(.025,.018,.016);
  vec3 c=mix(hz,wall,smoothstep(0.,.22,h));c=mix(c,top,smoothstep(.2,.85,h));
  float s=max(dot(d,sd),0.);c+=vec3(.42,.3,.2)*(pow(s,10.)*.55+pow(s,3.)*.12)*smoothstep(0.,.16,h);
  if(h<0.)c=hz;gl_FragColor=vec4(c,1.);}`;
