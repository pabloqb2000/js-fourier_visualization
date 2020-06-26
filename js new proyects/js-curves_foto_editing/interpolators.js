/**
 * Interpolation wich works by creating a linear
 * function between every two nodes.
 */
class LinearInterpolation {
    /**
     * Calculate the inclination of each interval
     * between two nodes
     */
    build() {  
        this.ms = [];
        for(let i = 1; i < points.length; i++) {
            let p1 = points[i - 1].getCPos();
            let p2 = points[i].getCPos();
            this.ms.push((p2.y - p1.y) / (p2.x - p1.x));
        }
    }

    /**
     * Evaluate the interpolation
     * 
     * @param x Point to evaluate
     * @param nextNode Index of the first node after x value
     */
    eval(x, nextNode) {
        let m = this.ms[nextNode - 1];
        let p1 = points[nextNode - 1].getCPos();
        return m*(x - p1.x) + p1.y;
    }
}

/**
 * Builds the interpolation polynomial for all the nodes
 * this is the minimum degree polynomial wich goes throw all the nodes
 * Finds the coeficients the with Newtons aproach calculating all the divided differences
 * Then evaluates the polynomial using a variation of horners algorithm 
 */
class PolynomialInterpolation {
    /**
     * Calculate the coeficients of the polynomial
     * First calculate the divided differences using 
     * newtons algorithm 
     * Then apply the horner algorithm
     * to further simplify the evaluation
     */
    build() {  
        let dd = points.map(p => [p.getCPos().y]);
        let n = points.length - 1;
        for(let j = 1; j <= n; j++) {
            for(let i = 1; i <= j; i++) {
                dd[j].push( 
                    (dd[j][i-1] - dd[j-1][i-1]) / (points[j].getCPos().x - points[j-i].getCPos().x));
            }
        }
        this.divDifs = dd.map(l => l[l.length - 1]).reverse();
    }

    /**
     * Evaluate the interpolation
     * 
     * @param x Point to evaluate
     * @param nextNode Index of the first node after x value
     */
    eval(x, nextNode) {
        return this.horner(this.divDifs, x);
    }

    /**
     * Applies a variant of horner algorithm
     * to evaluate the polynomial
     * @param l List of coefficients 
     * @param x X value to evaluate
     */
    horner(l, x) {
        let n = l.length;
        let q = l[0];
        for(let i = 1; i < n; i++) {
            q = q*(x - points[n-i-1].getCPos().x) + l[i];
        }
        return q;
    }
}

/**
 * For every two nodes builds a polynomial wich passes throw those nodes
 * and has derivative 1 in those nodes and has degree 3
 * If nodes x values are a, b
 * the coefficients are calculated for polynomial base:
 *   1,  (x-a),  (x-a)^2,  (x-a)^2(x-b)
 * First two coefficients come given (f(a), f'(a))
 * and the other two are calculated with the conditions:
 *   p(b) = f(b),  p'(b) = f'(b)
 */
class Spline1sInterpolation {
    /**
     * Returns a list of what the derivative should be
     * in each node
     * In this case returns an all 1's array
     */
    derivatives() {
        return points.map(p => 1);
    }

    /**
     * For every pair of points calculates
     * the coeficients of the corresponding polynomial
     */
    build() {
        let ders = this.derivatives();
        this.coefs = [];
        for(let i = 1; i < points.length; i++) {
            let a = points[i-1].getCPos();
            let b = points[i].getCPos();
            let c1 = (b.y - a.y - ders[i-1]*(b.x - a.x)) / (b.x - a.x)**2;
            let c2 = (ders[i] - ders[i-1]) / (b.x - a.x) - 2*c1;
            this.coefs.push([c2, c1, ders[i-1], a.y]);
        }
    }

    /**
     * Evaluates the corresponding polynomial,
     * the one between the given nextNode and the last one
     */
    eval(x, nextNode) {
        let a = points[nextNode - 1].getCPos().x;
        let b = points[nextNode].getCPos().x;
        let cs = this.coefs[nextNode - 1];

        let q = cs[0] * (x - b) + cs[1];
        q = q * (x - a) + cs[2];
        q = q * (x - a) + cs[3];
        return q;
    }
}

/**
 * Same interpolation as Spline1sInterpolation
 * but with 0 derivative at every node
 */
class Spline0sInterpolation extends Spline1sInterpolation{
    /**
     * Overrides the way deriavtives are calculated
     * Returns a list of what the derivative should be
     * in each node
     * In this case returns an all 0's array
     */
    derivatives() {
        return points.map(p => 0);
    }
}

class NaturalSplineInterpolation extends Spline1sInterpolation{
    /**
     * Overrides the way deriavtives are calculated
     * Calculates a list of derivatives such that 
     * the polynomial has continous curvature
     * It also makes curvature be 0 in the extreme points
     * 
     * To do so we solve one linear system of ecuations
     */
    derivatives() {
        let n = points.length;
        let A = Matrix.zeros(n);
        let v = Vector.fromDim(n);
        let pts = points.map(p => p.getCPos());

        for(let i = 1; i < n-1; i++) {
            A.data[i][i-1] = 1/(pts[i].x - pts[i-1].x);
            A.data[i][i+1] = 1/(pts[i+1].x - pts[i].x);
            A.data[i][i] = 2*(A.data[i][i-1] + A.data[i][i+1]);

            v.data[i] = 3 * ((pts[i].y - pts[i-1].y) / ((pts[i].x - pts[i-1].x) * (pts[i].x - pts[i-1].x)) +
                (pts[i+1].y - pts[i].y) / ((pts[i+1].x - pts[i].x) * (pts[i+1].x - pts[i].x)));
        }

        A.data[0][0] = 2/(pts[1].x - pts[0].x);
        A.data[0][1] = 1/(pts[1].x - pts[0].x);
        v.data[0] = 3 * (pts[1].y - pts[0].y) / ((pts[1].x - pts[0].x)**2);
        
        A.data[n-1][n-2] = 1/(pts[n-1].x - pts[n-2].x);
        A.data[n-1][n-1] = 2/(pts[n-1].x - pts[n-2].x);

        v.data[n-1] = 3 * (pts[n-1].y - pts[n-2].y) / ((pts[n-1].x - pts[n-2].x)**2);
        
        return A.solve(v).toArray();
    }
}