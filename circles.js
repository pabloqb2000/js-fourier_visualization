class Circle {
    /**
     * Cosntructor of one of the circles
     * and calculates the initial complex number for this vector
     * 
     * @param f Frecuency at wich this circle is spining
     */
    constructor(f) {
        this.f = f;
        // The initial complex number z is calucalted with the following integral:
        // Integral (e^(-f2PIit) dt) from 0 to 1
        let z = new Complex();
        for(let t = 0; t <= 1; t += dt) {
            z.add((new Complex(0, -f * 2*PI * t)).exp().mult(pathPt(t)));
        }
        z.mult(dt);
        this.z = z;
    }

    update() {
        this.z.mult((new Complex(0, this.f * speedSld.value * 2*PI * deltaTime / 10000)).exp());
        return this.z;
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