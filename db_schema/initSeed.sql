INSERT INTO technologies_master (technology,created_at) VALUES
	 ('Python','2023-10-19 10:06:53'),
	 ('Java','2023-10-19 10:06:58'),
	 ('JavaScript','2023-10-19 10:07:06'),
	 ('C++','2023-10-19 10:07:11'),
	 ('SQL','2023-10-19 10:07:14');
INSERT INTO tech_topics_master (tech_id,topic,created_at) VALUES
	 (1,'Introduction to Programming','2023-10-20 09:22:58'),
	 (1,'Data Types and Variables','2023-10-20 09:22:58'),
	 (1,'Control Structures','2023-10-20 09:22:58'),
	 (1,'Functions and Methods','2023-10-20 09:22:58'),
	 (1,'Arrays and Lists','2023-10-20 09:22:58'),
	 (2,'OOPS','2023-10-20 09:22:58'),
	 (2,'Inheritance','2023-10-20 09:22:58'),
	 (2,'Polymorphism','2023-10-20 09:22:58'),
	 (2,'Abstraction','2023-10-20 09:22:58'),
	 (2,'Exception Handling','2023-10-20 09:22:58');
INSERT INTO tech_topics_master (tech_id,topic,created_at) VALUES
	 (2,'logic building','2023-10-20 09:23:46'),
	 (2,'Object-Oriented Programming in Java','2023-10-20 09:24:53'),
	 (2,'Data Structures in Java','2023-10-20 09:24:53'),
	 (2,'Exception Handling','2023-10-20 09:24:53'),
	 (2,'Multithreading and Concurrency','2023-10-20 09:24:53'),
	 (2,'Java Swing and GUI Programming','2023-10-20 09:24:53'),
	 (2,'File I/O and Serialization','2023-10-20 09:24:53'),
	 (2,'Java Collections Framework','2023-10-20 09:24:53'),
	 (2,'Networking in Java','2023-10-20 09:24:53'),
	 (2,'JDBC and Database Connectivity in Java','2023-10-20 09:24:53');
INSERT INTO tech_topics_master (tech_id,topic,created_at) VALUES
	 (2,'Maven and Build Tools in Java','2023-10-20 09:24:53');
INSERT INTO tech_sub_topics_master (tech_topic_id,sub_topic,created_at) VALUES
	 (3,'Conditional','2023-10-19 10:09:44'),
	 (3,'Transfer','2023-10-19 10:09:49'),
	 (3,'Iterative','2023-10-19 10:09:55'),
	 (11,'Java Exception Handling','2023-10-20 09:30:36'),
	 (11,'Java Multithreading and Concurrency','2023-10-20 09:30:36'),
	 (11,'Java Swing and GUI Programming','2023-10-20 09:30:36'),
	 (11,'Java File I/O and Serialization','2023-10-20 09:30:36'),
	 (11,'Java Collections Framework','2023-10-20 09:30:36'),
	 (11,'Java Networking','2023-10-20 09:30:36'),
	 (12,'Java JDBC and Database Connectivity','2023-10-20 09:30:36');
INSERT INTO tech_sub_topics_master (tech_topic_id,sub_topic,created_at) VALUES
	 (12,'Java Maven and Build Tools','2023-10-20 09:30:36'),
	 (13,'Java Spring Framework','2023-10-20 09:30:36'),
	 (13,'Java Hibernate ORM','2023-10-20 09:30:36');
INSERT INTO activities_master (sub_topic_id,activity,description,resource_link,created_at,`sequence`) VALUES
	 (1,'if-else','No description','https://www.w3schools.com/python/python_conditions.asp','2023-10-19 10:12:55',0),
	 (1,'Nested if-else','No description','https://www.w3schools.com/python/python_conditions.asp','2023-10-19 10:12:55',0),
	 (1,'if-else ladder','No description','https://www.w3schools.com/python/python_conditions.asp','2023-10-19 10:12:55',0),
	 (2,'continue','No description','https://www.geeksforgeeks.org/loops-and-control-statements-continue-break-and-pass-in-python/','2023-10-19 10:12:55',0),
	 (2,'exit','No description','https://www.geeksforgeeks.org/loops-and-control-statements-continue-break-and-pass-in-python/','2023-10-19 10:12:55',0),
	 (2,'break','No description','https://www.geeksforgeeks.org/loops-and-control-statements-continue-break-and-pass-in-python/','2023-10-19 10:12:55',0),
	 (3,'for loop','No description','https://www.geeksforgeeks.org/loops-in-python/','2023-10-19 10:12:55',0),
	 (3,'while loop','No description','https://www.geeksforgeeks.org/loops-in-python/','2023-10-19 10:12:55',0),
	 (3,'do-while loop','No description','https://www.geeksforgeeks.org/loops-in-python/','2023-10-19 10:12:55',0),
	 (4,'Java Try Catch','No description','https://www.javatpoint.com/try-catch-block','2023-10-20 13:18:20',1);
INSERT INTO activities_master (sub_topic_id,activity,description,resource_link,created_at,`sequence`) VALUES
	 (4,'Java Multi-catch block','No description','https://www.javatpoint.com/try-catch-block','2023-10-20 13:18:25',2);
