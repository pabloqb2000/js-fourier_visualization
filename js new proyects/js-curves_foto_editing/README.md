# js-curves_photo_editing
This is an example proyect where I built a Photoshop like curves editing tool <a href="https://p5js.org/">p5.js</a>.
## URL
This proyect is hosted by github pages at <a href="https://pabloqb2000.github.io/js-curves_foto_editing/">this link</a>.
## Options
#### Add img
Add an image to the list of editable images. </br>
To add the image you need to copy the url from an image you find online or an image you uploaded yourself to the internet, then click the add img button and you'll probably need to give the web page access to your clipboard in order to read the link. </br>
The url should reference a png / jpg image.
#### Limits
This is an option refering to whether before the first node and after the last node to keep applying the defined function or just take the value of the correspoinding extreme node.
#### Save
Apply the effect to the full resolution image and download it to your computer. </br>
This option takes some time so you have to patiently wait until the effect is applied to the whole image.
#### Reset
Delete all nodes and reset to the starting state
#### Image
You can choose an image to apply the effect two in the image option box.
#### Interpolation
The different kind of interpolation you want to apply to the nodes. </br>
It deffaults to spline wich aplies a natural cubic spline interpolation to the nodes.
The posible intepolations are:
  - Natural spline
  - Linear
  - Polynomial
  - 0 derivatives spline
  - 1 derivatives spline
## Nodes
#### Add nodes
To add a node simply click and dragg outside the other nodes
#### Move nodes
Nodes can be dragged with the mouse
#### Delete nodes
If you have more than 2 nodes you can delete any node by double clicking a node.
## Image
The image shows the result of applying the effect to the choosen image. </br>
You can click and hold in the image to see the before and after.
## Gradient
The dradient shown bellow the image just shows what the result of applying the effect to a gradient varying from black to white looks like.
## Image updating
Each time some setting changes the image shown is updted. </br>
And each frame the image updates some of it's pixels until it has updated the whole image. </br>
At the beggining it updates a ceirtain ammount of pixels and then it updates this ammount to try to keep the frame rate to at least 40 fps
## Interpolations
In this proyect I implemented different kinds of interpolation
Every interpolation has at least two functions:
  - Build: is used to compute some coefficients wich will be used later
  - Eval: is used to evaluate the interpolation, this function is called a lot of times so i've tried to reduce the ammount of coputations performed here.
#### Linear interpolation
This kind of interpolation creates a linear function between every consecutive pair of nodes.
#### Polynomial interpolation
This interpolation calculates the minimum degree polynomial wich goes throw all the nodes. </br>
To do so it uses the Newtons aproach calculating the divided differences table. </br>
To evaluate the final polynomial it uses a small variation of Horners algorithm. </br>
#### Spline interpolation
This interpolation implements a natural cubic spline interpolation. </br>
This is that for each pair of consecutive nodes it builds a polynomial wich goes throw those nodes and has an specific derivative in those nodes. </br>
The derivative for each node is chosen so that the curvature of the full function is continuous and so that it equals 0 in the extreme points
#### 1s / 0s spline intepolation
Is the same idea as the spline interpolation but using derivative 1 / 0 in all nodes
## Screenshot
<img src="imgs/screenshot01.png"></img>
## References
To find more information about the <b>awesome</b> library used for this proyect visit:
<a href="https://p5js.org/"> https://p5js.org/ </a></br>
To find more about the <b>natural cubic spline interpolation</b> visit this amazing website <a href="http://blog.ivank.net/interpolation-with-cubic-splines.html">Cubic spline interpolation</a></br>
The example images used in this proyect come from <a href="https://www.pexels.com/?locale=en-us">pexels.com</a> and they are copyright free.

## Other proyects
Checkout my other proyects at <a href="https://pabloqb2000.github.io/Click_math/">Click math</a>