"""
Utility to ensure required directories exist
"""
import os
import logging

def ensure_directories():
    """
    Creates necessary directories if they don't exist
    """
    # Base directory is two levels up from this file
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    # List of directories to ensure
    directories = [
        os.path.join(base_dir, 'logs'),
        os.path.join(base_dir, 'media'),
        os.path.join(base_dir, 'staticfiles'),
        os.path.join(base_dir, 'mediafiles'),
    ]
    
    # Create each directory if it doesn't exist
    for directory in directories:
        try:
            if not os.path.exists(directory):
                os.makedirs(directory)
                print(f"Created directory: {directory}")
        except Exception as e:
            print(f"Error creating directory {directory}: {str(e)}")
            # Fall back to console logging if we can't create log directories
            logging.basicConfig(level=logging.INFO)
