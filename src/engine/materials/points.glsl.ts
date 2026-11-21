// Drifting, twinkling point sprites (fireflies, dust motes).
export const pointsVertex = /* glsl */ `attribute float ph;uniform float t,pr,sz,amp,spd,br;varying float a;
void main(){vec3 p=position;p.x+=sin(t*.5*spd+ph*3.)*amp;p.y+=sin(t*.7*spd+ph*5.)*amp*.6;p.z+=cos(t*.4*spd+ph*2.)*amp;
  vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;a=mix(1.,pow(.5+.5*sin(t*1.6+ph*10.),3.),br);
  gl_PointSize=sz*pr*(1./-mv.z)*(.35+.65*a);}`;

export const pointsFragment = /* glsl */ `uniform vec3 col;varying float a;
void main(){float d=length(gl_PointCoord-.5);float g=smoothstep(.5,0.,d);gl_FragColor=vec4(col,g*g*a);}`;
