// Get canvas and context
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('boidCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');

    // Set canvas to window size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Get background color
    function getBackgroundColor() {
        return 'rgba(30, 30, 46, 0.1)'; // Mocha base with opacity
    }

    // Generate fish color using Mocha palette
    function generateFishColor() {
        // Mocha palette colors
        const colors = [
            'rgb(245, 224, 220)', // rosewater
            'rgb(242, 205, 205)', // flamingo
            'rgb(245, 194, 231)', // pink
            'rgb(203, 166, 247)', // mauve
            'rgb(243, 139, 168)', // red
            'rgb(235, 160, 172)', // maroon
            'rgb(250, 179, 135)', // peach
            'rgb(249, 226, 175)', // yellow
            'rgb(166, 227, 161)', // green
            'rgb(148, 226, 213)', // teal
            'rgb(137, 220, 235)', // sky
            'rgb(116, 199, 236)', // sapphire
            'rgb(137, 180, 250)', // blue
            'rgb(180, 190, 254)'  // lavender
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Boid class
    class Boid {
        constructor() {
            // Random starting position
            this.position = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height
            };
            
            // Random velocity
            this.velocity = {
                x: (Math.random() * 2 - 1) * 2,
                y: (Math.random() * 2 - 1) * 2
            };
            
            // Acceleration
            this.acceleration = { x: 0, y: 0 };
            
            // Maximum speed and force
            this.maxSpeed = 3 + Math.random() * 1.5;
            this.maxForce = 0.05;
            
            // Perception radius
            this.perceptionRadius = 50;
            
            // Size (varies slightly)
            this.size = 5 + Math.random() * 3;
            
            // Color
            this.color = generateFishColor();
            
            // Oscillator for swimming motion
            this.oscillator = Math.random() * Math.PI * 2;
            this.oscillatorSpeed = 0.1 + Math.random() * 0.1;
        }
        
        // Apply a force to the boid
        applyForce(force) {
            this.acceleration.x += force.x;
            this.acceleration.y += force.y;
        }
        
        // Keep velocity within bounds
        limitVelocity() {
            const speed = Math.sqrt(
                this.velocity.x * this.velocity.x + 
                this.velocity.y * this.velocity.y
            );
            
            if (speed > this.maxSpeed) {
                this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
                this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
            }
            
            // Minimum speed to prevent stopping
            const minSpeed = 1.5;
            if (speed < minSpeed) {
                this.velocity.x = (this.velocity.x / speed) * minSpeed;
                this.velocity.y = (this.velocity.y / speed) * minSpeed;
            }
        }
        
        // Wrap around the edges of the canvas
        edges() {
            if (this.position.x > canvas.width) this.position.x = 0;
            if (this.position.x < 0) this.position.x = canvas.width;
            if (this.position.y > canvas.height) this.position.y = 0;
            if (this.position.y < 0) this.position.y = canvas.height;
        }
        
        // Calculate separation force
        separate(boids) {
            let desiredSeparation = this.size * 5;
            let steer = { x: 0, y: 0 };
            let count = 0;
            
            // Check for nearby boids
            for (let other of boids) {
                if (other === this) continue;
                
                let dx = this.position.x - other.position.x;
                let dy = this.position.y - other.position.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // If within separation range
                if (distance < desiredSeparation) {
                    // Calculate vector pointing away from neighbor
                    let diff = {
                        x: dx / distance,
                        y: dy / distance
                    };
                    
                    // Weight by distance (closer = stronger)
                    diff.x /= distance;
                    diff.y /= distance;
                    
                    // Add to steering vector
                    steer.x += diff.x;
                    steer.y += diff.y;
                    count++;
                }
            }
            
            // Average
            if (count > 0) {
                steer.x /= count;
                steer.y /= count;
                
                // Normalize and scale
                let mag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                if (mag > 0) {
                    steer.x /= mag;
                    steer.y /= mag;
                    
                    // Scale to maximum speed
                    steer.x *= this.maxSpeed;
                    steer.y *= this.maxSpeed;
                    
                    // Subtract current velocity (Reynolds steering formula)
                    steer.x -= this.velocity.x;
                    steer.y -= this.velocity.y;
                    
                    // Limit force
                    let forceMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                    if (forceMag > this.maxForce) {
                        steer.x = (steer.x / forceMag) * this.maxForce;
                        steer.y = (steer.y / forceMag) * this.maxForce;
                    }
                }
            }
            
            return steer;
        }
        
        // Calculate alignment force
        align(boids) {
            let neighborDist = this.perceptionRadius;
            let sum = { x: 0, y: 0 };
            let count = 0;
            
            // Sum up velocities of nearby boids
            for (let other of boids) {
                if (other === this) continue;
                
                let dx = this.position.x - other.position.x;
                let dy = this.position.y - other.position.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < neighborDist) {
                    sum.x += other.velocity.x;
                    sum.y += other.velocity.y;
                    count++;
                }
            }
            
            // If there are neighbors, calculate steering force
            if (count > 0) {
                // Average
                sum.x /= count;
                sum.y /= count;
                
                // Normalize and scale to max speed
                let mag = Math.sqrt(sum.x * sum.x + sum.y * sum.y);
                if (mag > 0) {
                    sum.x /= mag;
                    sum.y /= mag;
                    sum.x *= this.maxSpeed;
                    sum.y *= this.maxSpeed;
                    
                    // Calculate steering force (desired - current)
                    let steer = {
                        x: sum.x - this.velocity.x,
                        y: sum.y - this.velocity.y
                    };
                    
                    // Limit force
                    let steerMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                    if (steerMag > this.maxForce) {
                        steer.x = (steer.x / steerMag) * this.maxForce;
                        steer.y = (steer.y / steerMag) * this.maxForce;
                    }
                    
                    return steer;
                }
            }
            
            // If no neighbors, return zero force
            return { x: 0, y: 0 };
        }
        
        // Calculate cohesion force
        cohere(boids) {
            let neighborDist = this.perceptionRadius;
            let sum = { x: 0, y: 0 };
            let count = 0;
            
            // Sum up positions of nearby boids
            for (let other of boids) {
                if (other === this) continue;
                
                let dx = this.position.x - other.position.x;
                let dy = this.position.y - other.position.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < neighborDist) {
                    sum.x += other.position.x;
                    sum.y += other.position.y;
                    count++;
                }
            }
            
            // If there are neighbors, calculate steering force
            if (count > 0) {
                // Average to find center
                sum.x /= count;
                sum.y /= count;
                
                // Create desired velocity towards center
                let desired = {
                    x: sum.x - this.position.x,
                    y: sum.y - this.position.y
                };
                
                // Normalize and scale to max speed
                let mag = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
                if (mag > 0) {
                    desired.x /= mag;
                    desired.y /= mag;
                    desired.x *= this.maxSpeed;
                    desired.y *= this.maxSpeed;
                    
                    // Calculate steering force (desired - current)
                    let steer = {
                        x: desired.x - this.velocity.x,
                        y: desired.y - this.velocity.y
                    };
                    
                    // Limit force
                    let steerMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                    if (steerMag > this.maxForce) {
                        steer.x = (steer.x / steerMag) * this.maxForce;
                        steer.y = (steer.y / steerMag) * this.maxForce;
                    }
                    
                    return steer;
                }
            }
            
            // If no neighbors, return zero force
            return { x: 0, y: 0 };
        }
        
        // Add behavior to follow mouse
        followMouse(mousePos) {
            if (!mousePos) return { x: 0, y: 0 };
            
            // Calculate distance to mouse
            let dx = mousePos.x - this.position.x;
            let dy = mousePos.y - this.position.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only follow if within certain range (not too close, not too far)
            if (distance > 50 && distance < 200) {
                // Create desired velocity towards mouse
                let desired = {
                    x: dx,
                    y: dy
                };
                
                // Normalize and scale
                let mag = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
                if (mag > 0) {
                    desired.x /= mag;
                    desired.y /= mag;
                    desired.x *= this.maxSpeed;
                    desired.y *= this.maxSpeed;
                    
                    // Calculate steering force
                    let steer = {
                        x: desired.x - this.velocity.x,
                        y: desired.y - this.velocity.y
                    };
                    
                    // Limit force
                    let steerMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                    if (steerMag > this.maxForce) {
                        steer.x = (steer.x / steerMag) * this.maxForce;
                        steer.y = (steer.y / steerMag) * this.maxForce;
                    }
                    
                    return steer;
                }
            }
            
            return { x: 0, y: 0 };
        }
        
        // Avoid mouse if too close
        avoidMouse(mousePos) {
            if (!mousePos) return { x: 0, y: 0 };
            
            // Calculate distance to mouse
            let dx = this.position.x - mousePos.x;
            let dy = this.position.y - mousePos.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Only avoid if very close
            if (distance < 50) {
                // Create desired velocity away from mouse
                let desired = {
                    x: dx,
                    y: dy
                };
                
                // Normalize and scale (faster when closer)
                let mag = Math.sqrt(desired.x * desired.x + desired.y * desired.y);
                if (mag > 0) {
                    desired.x /= mag;
                    desired.y /= mag;
                    
                    // Stronger avoidance when closer
                    let avoidFactor = 1 - (distance / 50); // 0 to 1
                    desired.x *= this.maxSpeed * (1 + avoidFactor * 2);
                    desired.y *= this.maxSpeed * (1 + avoidFactor * 2);
                    
                    // Calculate steering force
                    let steer = {
                        x: desired.x - this.velocity.x,
                        y: desired.y - this.velocity.y
                    };
                    
                    // Limit force but allow stronger force when very close
                    let maxForce = this.maxForce * (1 + avoidFactor * 3);
                    let steerMag = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
                    if (steerMag > maxForce) {
                        steer.x = (steer.x / steerMag) * maxForce;
                        steer.y = (steer.y / steerMag) * maxForce;
                    }
                    
                    return steer;
                }
            }
            
            return { x: 0, y: 0 };
        }
        
        // Update position
        update(boids, mousePos) {
            // Calculate forces
            let separation = this.separate(boids);
            let alignment = this.align(boids);
            let cohesion = this.cohere(boids);
            let followForce = this.followMouse(mousePos);
            let avoidForce = this.avoidMouse(mousePos);
            
            // Apply forces with weights
            this.applyForce({ x: separation.x * 1.5, y: separation.y * 1.5 });
            this.applyForce({ x: alignment.x * 1.0, y: alignment.y * 1.0 });
            this.applyForce({ x: cohesion.x * 1.0, y: cohesion.y * 1.0 });
            this.applyForce({ x: followForce.x * 1.2, y: followForce.y * 1.2 });
            this.applyForce({ x: avoidForce.x * 2.0, y: avoidForce.y * 2.0 });
            
            // Update velocity and position
            this.velocity.x += this.acceleration.x;
            this.velocity.y += this.acceleration.y;
            
            // Limit velocity
            this.limitVelocity();
            
            // Update position
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            
            // Reset acceleration
            this.acceleration.x = 0;
            this.acceleration.y = 0;
            
            // Oscillator for swimming movement
            this.oscillator += this.oscillatorSpeed;
            
            // Wrap around edges
            this.edges();
        }
        
        // Draw the fish
        draw() {
            // Save context
            ctx.save();
            
            // Translate to fish position
            ctx.translate(this.position.x, this.position.y);
            
            // Rotate in direction of movement
            const angle = Math.atan2(this.velocity.y, this.velocity.x);
            ctx.rotate(angle);
            
            // Fish body color
            ctx.fillStyle = this.color;
            
            // Draw fish body (oval)
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size * 2, this.size, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw tail with oscillation for swimming motion
            const tailWag = Math.sin(this.oscillator) * this.size * 0.5;
            
            ctx.beginPath();
            ctx.moveTo(-this.size * 1.5, 0);
            ctx.lineTo(-this.size * 3, -this.size + tailWag);
            ctx.lineTo(-this.size * 3, this.size + tailWag);
            ctx.closePath();
            ctx.fill();
            
            // Draw fins
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 0.5);
            ctx.lineTo(-this.size, -this.size * 1.2);
            ctx.lineTo(-this.size * 0.5, -this.size * 0.5);
            ctx.closePath();
            ctx.fill();
            
            ctx.beginPath();
            ctx.moveTo(0, this.size * 0.5);
            ctx.lineTo(-this.size, this.size * 1.2);
            ctx.lineTo(-this.size * 0.5, this.size * 0.5);
            ctx.closePath();
            ctx.fill();
            
            // Eye
            ctx.fillStyle = '#1e1e2e'; // Dark eye color
            ctx.beginPath();
            ctx.arc(this.size, -this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#cdd6f4'; // Light pupil color
            ctx.beginPath();
            ctx.arc(this.size * 1.2, -this.size * 0.3, this.size * 0.15, 0, Math.PI * 2);
            ctx.fill();
            
            // Restore context
            ctx.restore();
        }
    }

    // Initialize variables
    const boids = [];
    const numBoids = 50;
    let mousePos = null;

    // Create boids
    for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid());
    }

    // Track mouse position
    canvas.addEventListener('mousemove', (event) => {
        mousePos = {
            x: event.clientX,
            y: event.clientY
        };
    });

    canvas.addEventListener('mouseleave', () => {
        mousePos = null;
    });

    // Touch support for mobile
    canvas.addEventListener('touchmove', (event) => {
        event.preventDefault();
        mousePos = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
    });

    canvas.addEventListener('touchend', () => {
        mousePos = null;
    });

    // Animation loop
    function animate() {
        // Clear canvas with semi-transparent background for trail effect
        ctx.fillStyle = getBackgroundColor();
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw all boids
        for (let boid of boids) {
            boid.update(boids, mousePos);
            boid.draw();
        }
        
        // Continue animation
        requestAnimationFrame(animate);
    }

    // Start animation
    animate();
});
