// This file contains the plan for May.
// Theme: Transportation & Movement

const mayPlan = [
    // Week 1: Focus on Land Transport (cars, trains, buses).
    { 
        week: 1, 
        day: 'Monday', 
        activities: [
            { cat: 'Math', desc: 'Introduce an analog clock. Explain that when the big hand is on the 12, it\'s "o\'clock". See what number the little hand is pointing to.' }, 
            { cat: 'French', desc: 'Learn the words for car: `la voiture` and train: `le train`.' }, 
            { cat: 'Creative', desc: 'Make a traffic light from construction paper circles (red, yellow, green) glued on a black rectangle.' }
        ] 
    },
    { 
        week: 1, 
        day: 'Tuesday', 
        activities: [
            { cat: 'Literacy', desc: 'Read a book about cars or trains, like "Don\'t Let the Pigeon Drive the Bus!" by Mo Willems.' }, 
            { cat: 'Mandarin', desc: 'Learn the words for car: 汽车 (qìchē) and train: 火车 (huǒchē).' }, 
            { cat: 'Gross Motor', desc: 'Race toy cars down a homemade ramp (a piece of cardboard propped on a book).' }
        ] 
    },
    { 
        week: 1, 
        day: 'Wednesday', 
        activities: [
            { cat: 'Math', desc: 'Count the wheels on different toy vehicles. Does a car have more or less wheels than a bicycle?' }, 
            { cat: 'French', desc: 'Learn the word for bus: `le bus` (or `l\'autobus`).' }, 
            { cat: 'Science', desc: 'Talk about traffic safety. Why do we look both ways before crossing the street? Why do we wear seatbelts?' }
        ] 
    },
    { 
        week: 1, 
        day: 'Thursday', 
        activities: [
            { cat: 'Literacy', desc: 'Play "I Spy" with sounds while in a car or on a walk. "I spy something that starts with the /s/ sound... sign!"' }, 
            { cat: 'Mandarin', desc: 'Learn the word for bus: 公共汽车 (gōnggòng qìchē).' }, 
            { cat: 'Fine Motor', desc: 'Draw a map of your neighborhood, including your house, the street, and maybe a park or a friend\'s house.' }
        ] 
    },
    { 
        week: 1, 
        day: 'Friday', 
        activities: [
            { cat: 'Language Fun', desc: 'Sing "The Wheels on the Bus" and add new verses for different vehicles ("The horn on the car goes beep, beep, beep...").' }, 
            { cat: 'Math', desc: 'Use a tally chart to count the different colored cars you see on a walk.' }, 
            { cat: 'Free Play', desc: 'Build a city with roads for your toy cars using blocks or masking tape on the floor.' }
        ] 
    },
    // Week 2: Focus on Air Transport (airplanes, helicopters).
    { 
        week: 2, 
        day: 'Monday', 
        activities: [
            { cat: 'Math', desc: 'Explore ways to make 10 with two colors of Lego blocks. This is a foundation for addition facts.' }, 
            { cat: 'French', desc: 'Learn the word for airplane: `l\'avion`.' }, 
            { cat: 'Creative', desc: 'Make paper airplanes and have a competition to see which one flies the farthest.' }
        ] 
    },
    { 
        week: 2, 
        day: 'Tuesday', 
        activities: [
            { cat: 'Literacy', desc: 'Read a book about airplanes or flying.' }, 
            { cat: 'Mandarin', desc: 'Learn the word for airplane: 飞机 (fēijī).' }, 
            { cat: 'Gross Motor', desc: 'Run around with your arms outstretched like an airplane, making airplane sounds.' }
        ] 
    },
    { 
        week: 2, 
        day: 'Wednesday', 
        activities: [
            { cat: 'Math', desc: 'Practice telling time to the hour again. Set the clock to 3 o\'clock, 5 o\'clock, etc., and have your child identify the time.' }, 
            { cat: 'French', desc: 'Learn the word for sky: `le ciel`. "L\'avion est dans le ciel." (The airplane is in the sky).' }, 
            { cat: 'Science', desc: 'Talk about how airplanes fly (in simple terms: engines push them forward and wings lift them up). Watch videos of planes taking off.' }
        ] 
    },
    { 
        week: 2, 
        day: 'Thursday', 
        activities: [
            { cat: 'Literacy', desc: 'Read a book with expression. Encourage your child to copy your voice for the different characters.' }, 
            { cat: 'Mandarin', desc: 'Learn the word for sky: 天空 (tiānkōng).' }, 
            { cat: 'Fine Motor', desc: 'Glue cotton balls on blue paper to make clouds for your paper airplanes to fly through.' }
        ] 
    },
    { 
        week: 2, 
        day: 'Friday', 
        activities: [
            { cat: 'Language Fun', desc: 'Sing "I\'m a Little Airplane" (to the tune of "I\'m a Little Teapot").' }, 
            { cat: 'Math', desc: 'Sort transportation toys by where they travel: land, air, or water.' }, 
            { cat: 'Free Play', desc: 'Build an airport with a runway and a control tower using blocks.' }
        ] 
    },
    // Week 3: Focus on Water Transport (boats, ships).
    { 
        week: 3, 
        day: 'Monday', 
        activities: [
            { cat: 'Math', desc: 'Tell addition stories with boats. "There are 5 boats on the lake. 3 more boats arrive. How many are there now?"' }, 
            { cat: 'French', desc: 'Learn the word for boat: `le bateau`.' }, 
            { cat: 'Creative', desc: 'Make simple origami boats out of paper.' }
        ] 
    },
    { 
        week: 3, 
        day: 'Tuesday', 
        activities: [
            { cat: 'Literacy', desc: 'Read a book about boats, like "Little Toot."' }, 
            { cat: 'Mandarin', desc: 'Learn the word for boat: 船 (chuán).' }, 
            { cat: 'Gross Motor', desc: 'Pretend to row a boat, paddling your arms back and forth.' }
        ] 
    },
    { 
        week: 3, 
        day: 'Wednesday', 
        activities: [
            { cat: 'Math', desc: 'Tell subtraction stories. "There were 8 fish in the water. 2 swam away. How many are left?"' }, 
            { cat: 'French', desc: 'Learn the word for water: `l\'eau`. "Le bateau est sur l\'eau." (The boat is on the water).' }, 
            { cat: 'Science', desc: 'Sink or Float? Fill a basin with water and test different toys and objects to see if they sink or float. Make predictions first!' }
        ] 
    },
    { 
        week: 3, 
        day: 'Thursday', 
        activities: [
            { cat: 'Literacy', desc: 'Play secret word. Slowly sound out a word (e.g., b-oa-t, sh-i-p) and have your child guess the secret word.' }, 
            { cat: 'Mandarin', desc: 'Learn the word for water: 水 (shuǐ).' }, 
            { cat: 'Fine Motor', desc: 'Draw a seascape with boats, waves, and fish.' }
        ] 
    },
    { 
        week: 3, 
        day: 'Friday', 
        activities: [
            { cat: 'Language Fun', desc: 'Sing "Row, Row, Row Your Boat."' }, 
            { cat: 'Math', desc: 'Make a tally chart of how many items sank and how many floated in your experiment.' }, 
            { cat: 'Free Play', desc: 'Sensory play! Play with your paper boats and other waterproof toys in a bathtub or water table.' }
        ] 
    },
    // Week 4: Reviewing all types of movement.
    { 
        week: 4, 
        day: 'Monday', 
        activities: [
            { cat: 'Math', desc: 'Review counting as high as you can. Try counting by 10s to 50 (10, 20, 30, 40, 50).' }, 
            { cat: 'French', desc: 'Learn action verbs: `courir` (to run), `sauter` (to jump), `voler` (to fly), `nager` (to swim).' }, 
            { cat: 'Creative', desc: 'Draw a picture that shows all four types of movement: someone running, jumping, flying (a bird), and swimming.' }
        ] 
    },
    { 
        week: 4, 
        day: 'Tuesday', 
        activities: [
            { cat: 'Literacy', desc: 'Read a book that involves a journey, like "We\'re Going on a Bear Hunt."' }, 
            { cat: 'Mandarin', desc: 'Learn action verbs: 跑 (pǎo - to run) and 跳 (tiào - to jump).' }, 
            { cat: 'Gross Motor', desc: 'Create an obstacle course in your living room or backyard that involves running, jumping, crawling, and climbing.' }
        ] 
    },
    { 
        week: 4, 
        day: 'Wednesday', 
        activities: [
            { cat: 'Math', desc: 'Review telling time to the hour. What time do you eat breakfast? What time do you go to bed?' }, 
            { cat: 'French', desc: 'Review all the transportation words from this month.' }, 
            { cat: 'Science', desc: 'Talk about fast vs. slow. Which is faster, a car or a person walking? An airplane or a boat?' }
        ] 
    },
    { 
        week: 4, 
        day: 'Thursday', 
        activities: [
            { cat: 'Literacy', desc: 'Write a story about a magical vehicle that can travel on land, in the air, AND in the water.' }, 
            { cat: 'Mandarin', desc: 'Review all the transportation words from this month.' }, 
            { cat: 'Fine Motor', desc: 'Build your favorite vehicle out of Lego or other building toys.' }
        ] 
    },
    { 
        week: 4, 
        day: 'Friday', 
        activities: [
            { cat: 'Language Fun', desc: 'Act out the action verbs you learned. Can you show me `sauter`? Can you show me `pǎo`?' }, 
            { cat: 'Math', desc: 'Review addition and subtraction with your fingers.' }, 
            { cat: 'Free Play', desc: 'Child\'s choice! Let them pick their favorite transportation-themed activity from May to do again.' }
        ] 
    }
];

// This line makes the data available to other files.
export default mayPlan;