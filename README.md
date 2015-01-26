# Event-Notification-using-Chrome-Desktop-App

Event Notification uses Chrome package app framework for creating, displaying and deleting notifications.
It is based on MVC model and uses javascript for it's functioning.

Following are the descriptions of the code :

scripts/controller.js - Contains code for controller, it acts as a glue between filesystem, storage and view code.
scripts/filesystem.js - Contains code for storing alarm id and image blob. Image used for creating event will be stored in 
                        filesystem.
scripts/storage.js - Contains code for storing alarm id, description of the event.
scripts/util.js - Contains code for utility function that will be used throughout the code.
scripts/view.js - Contains template for displaying, creating events.
