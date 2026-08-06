how to start?
- DSA, start with building a simple product
- Read the documentation and examples
- Learn load balancer
- vertical vs horizontal scaling
- RTO vs RPO
- Network Latency and Throughput
- Consistency
- Availability
- Partition tolerance
- CAP theorem

Build a Product:
- authentication , caching, database, load balancer, monitoring, logging,  database optimization, indexing,  sharding, aggregation pipelining, scalable architechture(microservices), CDNs , Message Queues(MQ), Rate Limiting, Circuit Breaking, 

why product building != just writing code.

Product = Problem Solved + Value delivered
zomato solves convenience + laziness + Hunger = Product


Good Ideas::
- Find cheap hostels nearby
- finds cheapest flights across airlines
- compare gorcery prices across stores
- app that helps manage recurring bills 
- 
//=====================================================================================
Software Requirement Specification(SRS)

Project: Online Customer Service Web Portal for an Online Cosmetic Company

Introduction

The purpose of this Software Requirement Specification (SRS) document is to outline the functional and non-functional requirements for the development of an online web portal that provides excellent customer service for an online cosmetic company. The web portal will allow customers to place online orders for beauty products, and the system will facilitate the order fulfillment process from the customer service department to the warehouse team.

1.1 Scope

The scope of this project includes the following activities:

Customer placing an online order
Customer service department receiving the order
Warehouse department fulfilling and shipping the order
Notifying the customer about the order status

1.2 Out of Scope

The following activities are considered out of scope for this project:

Anything prior to ordering (e.g., product browsing, marketing)
Anything after shipping (e.g., delivery tracking, post-purchase support)
Inventory management
Payment system integration

Functional Requirements

2.1 User Registration and Authentication

The web portal shall provide user registration functionality for new customers.
The system shall authenticate users during the order placement process to ensure secure access.

2.2 Order Placement

The web portal shall allow customers to browse and select products for purchase.
Customers shall be able to add products to their shopping cart and specify quantities.
The system shall calculate the order total based on selected products and quantities.
Customers shall be able to review their order and make modifications before finalizing.
The system shall validate and process customer orders.

2.3 Order Reception

The customer service department shall receive customer orders placed through the web portal.
The system shall display order details to the customer service team.
Customer service representatives shall be able to access order information and perform necessary actions.

2.4 Inventory Check and Order Confirmation

The customer service team shall check the inventory system to verify the availability of ordered products.
If the products are in stock, the system shall confirm the order and proceed to order fulfillment.
If the products are out of stock or unavailable within the normal lead time, the system shall notify the customer service team for further action.

2.5 Order Fulfillment

The warehouse team shall receive confirmed orders from the customer service department.
The system shall facilitate the packaging and shipping process for the ordered items.
The system shall generate a shipping confirmation email with details such as tracking number and estimated delivery date.
The warehouse team shall update the order status in the system after shipping.

2.6 Order Status Notification

The system shall send automated notifications to customers regarding the status of their orders.
Customers shall receive notifications about order confirmation, order fulfillment, and shipping details.

Non-Functional Requirements

3.1 Performance

The web portal shall have low latency and provide a responsive user interface.
The system shall handle multiple concurrent user sessions without performance degradation.
The time taken for inventory checks and order processing shall be optimized to minimize customer wait time.

3.2 Security

The system shall employ secure authentication mechanisms to protect customer information.
Customer data, including personal and payment details, shall be encrypted and stored securely.
Access controls shall be implemented to restrict unauthorized access to sensitive information.

3.3 Reliability

The system shall be available for customer order placement 24/7, with minimal downtime for maintenance.
The system shall have backup and recovery mechanisms to ensure data integrity and availability.

3.4 Usability

The web portal shall have an intuitive and user-friendly interface for easy navigation and order placement.
Error handling and validation messages shall be provided to guide users and prevent incorrect inputs.

3.5 Scalability

The system architecture shall support future scalability to accommodate increasing customer demands.
The web portal shall handle a growing customer base and a larger volume of orders without performance degradation.

Constraints

The development of the web portal should adhere to the company's existing technology stack and infrastructure.
The project should be completed within the allocated budget and timeline.
Integration with the existing inventory management and payment systems is not within the scope of this project.

Note: This Software Requirement Specification (SRS) document provides an overview of the requirements for the online customer service web portal. It serves as a foundation for the development team to design and implement the system accurately.
//==============================================================================


Requirements:-
Functional:
- User Authentication
- search functionality
- Reports Generation
- payment handling


Non Functional:
- performance
- Security
- Availability
- Usability
- Scalability

//===============================================================================


