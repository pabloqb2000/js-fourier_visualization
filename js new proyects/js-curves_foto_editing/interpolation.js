/**
 * Evaluates the interpolation of the paremeter x 
 * Uses one king of interpolation or other depending
 * on the UI state
 * 
 * @param x 
 */
function getInterpolation(x) {
    let f;
    // Sort the nodes in ascending order 
    points.sort((a, b) => a.getCPos().x - b.getCPos().x);

    if(extremesLimit.active && (x < points[0].getCPos().x || x > points[points.length - 1].getCPos().x)) {
        // If limits are active and x is outside the first or last node
        f = limit(x);
    } else {
        // Find the next node and evaluate the interpolation
        let i = 1;
        while(points[i].getCPos().x <= x && i < points.length - 1)
            i++;
        f = interpolation.eval(x, i);
    }
    
    // Crops the result in [0,1]
    return min(1,max(0, f));
}

/**
 * Updates the interpolation 
 * depending on the selected option
 */
function updateInterp() {
    switch(interpBox.selected) {
        case "Spline":
            interpolation = new NaturalSplineInterpolation();
            break;
        case "Poly":
            interpolation = new PolynomialInterpolation();
            break;
        case "0s spline":
            interpolation = new Spline0sInterpolation();
            break;
        case "1s spline":
            interpolation = new Spline1sInterpolation();
            break;
        default:
            interpolation = new LinearInterpolation();
    }
    resetIndex();
}

/**
 * Limits the given value before and after the first and last nodes
 * if called outside that range returns 0
 */
function limit(x) {
    if(x < points[0].getCPos().x)
        return points[0].getCPos().y;
    if(x > points[points.length - 1].getCPos().x)
        return points[points.length - 1].getCPos().y;
    return 0;
}
