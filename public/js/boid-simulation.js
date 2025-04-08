// Get canvas and context
(function() {
    // Flag to prevent multiple initializations
    if (window.__boidSimulationInitialized) return;
    
    function initBoidSimulation() {
        const canvas = document.getElementById('boidCanvas');
        if (!canvas) {
            console.error('Boid canvas not found');
            return;
        }
        
        // Mark as initialized
        window.__boidSimulationInitialized = true;
        canvas.__boidInitialized = true;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Could not get canvas context');
            return;
        }

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
                
                // Size
                this.size = 5 + Math.random() * 5;
                
                // Color
                this.color = generateFishColor();
                
                // Max speed and force
                this.maxSpeed = 2 + Math.random() * 1.5;
                this.maxForce = 0.05;
                
                // Perception radius
                this.perceptionRadius = 50;
            }
            
            // Update position
            update() {
                // Update velocity
                this.velocity.x += this.acceleration.x;
                this.velocity.y += this.acceleration.y;
                
                // Limit speed
                const speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
                if (speed > this.maxSpeed) {
                    this.velocity.x = (this.velocity.x / speed) * this.maxSpeed;
                    this.velocity.y = (this.velocity.y / speed) * this.maxSpeed;
                }
                
                // Update position
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
                
                // Reset acceleration
                this.acceleration.x = 0;
                this.acceleration.y = 0;
                
                // Wrap around edges
                this.edges();
            }
            
            // Apply force
            applyForce(force) {
                this.acceleration.x += force.x;
                this.acceleration.y += force.y;
            }
            
            // Wrap around edges
            edges() {
                if (this.position.x > canvas.width) this.position.x = 0;
                if (this.position.x < 0) this.position.x = canvas.width;
                if (this.position.y > canvas.height) this.position.y = 0;
                if (this.position.y < 0) this.position.y = canvas.height;
            }
            
            // Alignment behavior
            align(boids) {
                let steering = { x: 0, y: 0 };
                let total = 0;
                
                for (let other of boids) {
                    const d = distance(this.position, other.position);
                    if (other !== this && d < this.perceptionRadius) {
                        steering.x += other.velocity.x;
                        steering.y += other.velocity.y;
                        total++;
                    }
                }
                
                if (total > 0) {
                    steering.x /= total;
                    steering.y /= total;
                    
                    // Set magnitude to max speed
                    const mag = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                    steering.x = (steering.x / mag) * this.maxSpeed;
                    steering.y = (steering.y / mag) * this.maxSpeed;
                    
                    // Steering = desired - velocity
                    steering.x -= this.velocity.x;
                    steering.y -= this.velocity.y;
                    
                    // Limit force
                    const steerMag = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                    if (steerMag > this.maxForce) {
                        steering.x = (steering.x / steerMag) * this.maxForce;
                        steering.y = (steering.y / steerMag) * this.maxForce;
                    }
                }
                
                return steering;
            }
            
            // Cohesion behavior
            cohesion(boids) {
                let steering = { x: 0, y: 0 };
                let total = 0;
                
                for (let other of boids) {
                    const d = distance(this.position, other.position);
                    if (other !== this && d < this.perceptionRadius) {
                        steering.x += other.position.x;
                        steering.y += other.position.y;
                        total++;
                    }
                }
                
                if (total > 0) {
                    steering.x /= total;
                    steering.y /= total;
                    
                    // Vector pointing from current position to target
                    steering.x -= this.position.x;
                    steering.y -= this.position.y;
                    
                    // Set magnitude to max speed
                    const mag = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                    if (mag > 0) { // Avoid division by zero
                        steering.x = (steering.x / mag) * this.maxSpeed;
                        steering.y = (steering.y / mag) * this.maxSpeed;
                    }
                    
                    // Steering = desired - velocity
                    steering.x -= this.velocity.x;
                    steering.y -= this.velocity.y;
                    
                    // Limit force
                    const steerMag = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                    if (steerMag > this.maxForce) {
                        steering.x = (steering.x / steerMag) * this.maxForce;
                        steering.y = (steering.y / steerMag) * this.maxForce;
                    }
                }
                
                return steering;
            }
            
            // Separation behavior
            separation(boids) {
                let steering = { x: 0, y: 0 };
                let total = 0;
                
                for (let other of boids) {
                    const d = distance(this.position, other.position);
                    if (other !== this && d < this.perceptionRadius) {
                        // Closer boids have stronger influence
                        let diff = {
                            x: this.position.x - other.position.x,
                            y: this.position.y - other.position.y
                        };
                        
                        // Weight by distance
                        diff.x /= d;
                        diff.y /= d;
                        
                        steering.x += diff.x;
                        steering.y += diff.y;
                        total++;
                    }
                }
                
                if (total > 0) {
                    steering.x /= total;
                    steering.y /= total;
                    
                    // Set magnitude to max speed
                    const mag = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                    if (mag > 0) { // Avoid division by zero
                        steering.x = (steering.x / mag) * this.maxSpeed;
                        steering.y = (steering.y / mag) * this.maxSpeed;
                    }
                    
                    // Steering = desired - velocity
                    steering.x -= this.velocity.x;
                    steering.y -= this.velocity.y;
                    
                    // Limit force
                    const steerMag = Math.sqrt(steering.x * steering.x + steering.y * steering.y);
                    if (steerMag > this.maxForce) {
                        steering.x = (steering.x / steerMag) * this.maxForce;
                        steering.y = (steering.y / steerMag) * this.maxForce;
                    }
                }
                
                return steering;
            }
            
            // Apply flocking behaviors
            flock(boids) {
                let alignment = this.align(boids);
                let cohesion = this.cohesion(boids);
                let separation = this.separation(boids);
                
                // Weight forces
                alignment.x *= 1.0;
                alignment.y *= 1.0;
                cohesion.x *= 1.0;
                cohesion.y *= 1.0;
                separation.x *= 1.5; // Separation is slightly more important
                separation.y *= 1.5;
                
                // Apply forces
                this.applyForce(alignment);
                this.applyForce(cohesion);
                this.applyForce(separation);
            }
            
            // Draw fish
            draw() {
                // Save context
                ctx.save();
                
                // Translate to position
                ctx.translate(this.position.x, this.position.y);
                
                // Rotate in direction of velocity
                const angle = Math.atan2(this.velocity.y, this.velocity.x);
                ctx.rotate(angle);
                
                // Draw fish body
                ctx.fillStyle = this.color;
                
                // Fish body (teardrop shape)
                ctx.beginPath();
                ctx.moveTo(this.size, 0);
                ctx.quadraticCurveTo(0, this.size / 2, -this.size, 0);
                ctx.quadraticCurveTo(0, -this.size / 2, this.size, 0);
                ctx.fill();
                
                // Fish tail
                ctx.beginPath();
                ctx.moveTo(-this.size, 0);
                ctx.lineTo(-this.size * 1.5, this.size / 2);
                ctx.lineTo(-this.size * 1.5, -this.size / 2);
                ctx.closePath();
                ctx.fill();
                
                // Restore context
                ctx.restore();
            }
        }
        
        // Helper function to calculate distance between two points
        function distance(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
        
        // Create boids
        const boids = [];
        const numBoids = Math.min(50, Math.max(20, Math.floor(canvas.width * canvas.height / 20000))); // Adjust based on screen size
        
        for (let i = 0; i < numBoids; i++) {
            boids.push(new Boid());
        }
        
        // Animation loop
        function animate() {
            // Clear canvas with semi-transparent background for trail effect
            ctx.fillStyle = getBackgroundColor();
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw each boid
            for (let boid of boids) {
                boid.flock(boids);
                boid.update();
                boid.draw();
            }
            
            // Request next frame
            requestAnimationFrame(animate);
        }
        
        // Start animation
        animate();
    }

    // Try to initialize immediately if document is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initBoidSimulation();
    } else {
        // Otherwise wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', initBoidSimulation);
    }
    
    // Also try on window load as a fallback
    window.addEventListener('load', initBoidSimulation);
})();
