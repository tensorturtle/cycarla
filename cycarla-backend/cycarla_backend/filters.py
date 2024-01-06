import time

class RoadGradientEstimator:
    """
    A class to estimate the road gradient using a moving average filter.
    Includes functionality to ignore calculations for the first 'n' updates.
    """
    
    def __init__(self, window_size=5, ignore_first_n=0):
        """
        Initialize the RoadGradientEstimator with a specified window size for averaging.
        """
        self.window_size = window_size
        self.ignore_first_n = ignore_first_n
        self.update_count = 0  # Counter for the number of updates received.
        self.last_elevation = None
        self.last_time = None
        self.gradients = []

    def update(self, elevation, speed):
        """
        Update the estimator with new elevation and speed data.
        Ignores gradient calculations for the first 'n' updates.
        
        Args:
            elevation (float): Elevation in meters.
            speed (float): Horizontal speed in meters/second.

        Returns:
            float: Average road gradient in percentage, or None if calculation is not possible.
        """
        self.update_count += 1  # Increment the update count.
        current_time = time.time()
        
        if self.update_count > self.ignore_first_n and self.last_time is not None and speed > 0.1:
            delta_time = current_time - self.last_time
            distance = speed * delta_time
            if distance > 0:
                current_gradient = (elevation - self.last_elevation) / distance * 100
                self._add_gradient(current_gradient)
        else:
            current_gradient = None

        self.last_elevation = elevation
        self.last_time = current_time

        return self.get_average_gradient() if self.gradients else current_gradient

    def _add_gradient(self, gradient):
        """
        Add a new gradient to the list and maintain the size within the window.
        """
        self.gradients.append(gradient)
        if len(self.gradients) > self.window_size:
            self.gradients.pop(0)

    def get_average_gradient(self):
        """
        Calculate and return the average gradient from the recent data.
        """
        if not self.gradients:
            return 0
        return sum(self.gradients) / len(self.gradients)