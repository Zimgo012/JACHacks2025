import {Resend} from 'resend';

//@desc add Animal
//@route POST /animals/
export const addAnimal = async(req, res, next) => {
    const db = req.db;
    const newPost = req.body;

    try{
        const animalData = {
            ...newPost,              // Spread all fields first
            images: newPost.images || [], // If images not sent, default to empty array
            createdAt: new Date()
        };

        const result = await collection.insertOne(animalData);

        res.status(201).send({
            success: true,
            message: 'Animal added successfully',
            id: result.insertedId
        });
    } catch (err) {
        console.error('Error creating animal.', err);
        res.status(500).send({
            success: false,
            error: 'Failed to create Animal'
        });
    }
};


//@desc add User
//@route /users/
//@desc add User
//@route /users/
export const addUser = async (req, res) => {
    const db = req.db;
    const users = db.collection('users'); // <== Add this at the start
    const newUser = req.body;

    try {
        const existingUser = await users.findOne({ email: newUser.email });

        if (existingUser) {
            return res.status(200).json({ message: 'User already exists' });
           }

        const userData = {
            email: newUser.email,
            name: newUser.name,
            createdAt: new Date()
        };

        const result = await users.insertOne(userData);

        res.status(201).json({ message: 'User saved', id: result.insertedId });
    } catch (err) {
        console.error('Failed to save user:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

//@desc save user from Auth0 hook
//@route /users/auth0_hook
export const addUserFromHook = async (req, res) => {
    const db = req.db;
    const users = db.collection('users'); // <== Add this at the start
    const { email, name, hook_secret } = req.body;

    if (hook_secret !== process.env.AUTH0_HOOK_SECRET) {
        return res.status(401).json({ error: 'Unauthorized access' });
    }

    if (!email) {
        return res.status(400).json({ error: 'Missing email' });
    }

    try {
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            return res.status(200).json({ message: 'User already exists (hook)' });
        }

        const userData = {
            email,
            name: name || '',
            createdAt: new Date()
        };

        const result = await users.insertOne(userData);

        res.status(201).json({ message: 'User saved (hook)', id: result.insertedId });
    } catch (err) {
        console.error('Failed to save user from hook:', err);
        res.status(500).json({ error: 'Server error (hook)' });
    }
};

//@desc add Contact to user
//@route POST /contact/
export const addContact = async (req, res, next) => {
    const db = req.db;


    console.log(req.body)
    const { name,  email, phone, message } = req.body;  // ❗only accept message and phone from user input

    try {
        const resend = new Resend(process.env.RESEND_API);
            
        // ✅ Get email from token (authenticated user)
        console.log(email);
        console.log(name);
        console.log(message);
        
        if (!email) {
            return res.status(400).json({ success: false, error: 'No email found in token' });
        }

        const emailBody = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>Thank you for contacting us, ${name}!</h2>
                <p>We have received your message:</p>
                <blockquote style="margin: 10px 0; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #ccc;">
                    ${message}
                </blockquote>
                <p>We will reach out to you shortly at <strong>${phone || 'your email'}</strong>.</p>
                <p>Best regards,<br/>The PetoVibe Team 🐾</p>
            </div>
        `;


        // ✉️ Send Thank You Email
        const {data, error} = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Thank you for contacting PetoVibe!',
            html: emailBody,
        });


        if(error){
        res.status(300).json({
            success:false,
            message: "Email not sent"
        })
          };

        console.log(data)

        // 🛠️ Insert message into user's messages array
        const users = db.collection('users');

        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const updateResult = await users.updateOne(
            { email },
            {
                $push: {
                    messages: {
                        text: message,
                        phone: phone || '',
                        sentAt: new Date()
                    }
                }
            }
        );

        res.status(200).json({
            success: true,
            message: 'Contact message saved to user and email sent successfully',
            updatedCount: updateResult.modifiedCount
        });

    } catch (err) {
        console.error('Error processing contact:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to process contact'
        });
    }
};