class Circle {
    /**
     * Cosntructor of one of the circles
     * 
     * @param f Frecuency at wich this circle is spining
     */
    constructor(f) {
        this.f = f;
        this.z = new Complex(random(-1,1), random(-1,1)).mult(50);
    }

    update() {
        this.z.mult((new Complex(0, this.f * speedSld.value * 2*PI * deltaTime / 10000)).exp());
    }

    /**
     * Draw this circle based on the sum of the last complex numbers drawn
     */
    draw(last) {
        let d = Complex.add(this.z, last);
        if(showBtn.active) {
            ellipse(last.r, last.i, this.z.norm()*2, this.z.norm()*2);
            line(last.r, last.i, d.r, d.i);
        }
        return this.z;
    }
}