# Booking Service

Our service enables the general public to book appointments with dentists. Dentists play a crucial role in the system, and this service allows them to sign up, log in, and modify their information.

# Technology Used
We utilize MQTT for efficient communication between the system components. This choice is driven by its advantages in low bandwidth usage, real-time communication, and asynchronous messaging. However, it's crucial to address potential security concerns and the learning curve associated with the publish/subscribe paradigm.

# Controllers
The service includes various controllers for creating and managing clinics, appointment slots, and emergency slots.

## Clinic Controllers
- Create Clinic: Creates a new clinic.
- Get All Clinics: Retrieves information about all clinics.
- Get Clinic: Retrieves information about a specific clinic.
- Update Clinic: Updates information about a clinic.
- Delete Clinic: Deletes a specific clinic.
- Delete All Clinics: Deletes all clinics.


## Slots Controllers
- Create Slots: Creates multiple appointment slots.
- Create Slot: Creates a single appointment slot.
- Get Slots: Retrieves information about all appointment slots.
- Get Patient Slots: Retrieves appointment slots for a specific patient.
- Get Slot: Retrieves information about a specific slot.
- Get Clinic Slots: Retrieves appointment slots for a specific clinic.
- Get Dentist Slots: Retrieves appointment slots for a specific dentist.
- Update Slot: Updates information about a specific slot.
- Book Slot: Books a specific slot.
- Unbook Slot: Unbooks a specific slot.
- Delete Slot: Deletes a specific slot.
Delete All Slots: Deletes all slots.

## Emergency Slots Controllers

- Get Score: Retrieves the score for emergency slots.
- Create Emergency Slot: Creates an emergency appointment slot.
- Get Emergency Slots: Retrieves emergency appointment slots for a specific date.
- Delete Emergency Slot: Deletes a specific emergency appointment slot.
- Get Result: Retrieves the result of emergency slots.

#### Test Stage

We currently have only the unit tests. The script npm tun test:ci is used to test the whole project. <br>
In the future, integration test stage may be implemented as well.

#Testing
Our project undergoes automatic testing through the GitLab CI/CD pipeline whenever a new commit is pushed to the remote repository. We use Jest for unit testing. The tests cover various scenarios, including creating dentists, logging in, updating information, and handling exceptions.

## Contributions

#### All Controllers

Tanya Susanna Benu (gusbenuta@student.gu.se) and Tehreem Asif (gusasite@student.gu.se) has created all of the relative methods and functionalities.. 

#### Emergency Booking

David Boram Hong(guscholcda@student.gu.se) has worked on all controllers and schemas related to emergency booking system.

#### Jest Tests & CI Pipeline

David Boram Hong(guscholcda@student.gu.se) has created all of the tests and CI pipeline.

#### DentistDocumentation

Tehreem Asif (gusasite@student.gu.se) has taken care of all the documentation for this service.