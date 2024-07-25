const express = require('express');
const path = require('path');
const app = express();

// app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

const certDetails = new Map();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/issue', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'issueCertificate.html'));
});

// Route to handle form submissions
app.post('/submit-form', (req, res) => {
    try {

        const { certificateID, courseName, candidateName, grade, date } = req.body;
        console.log(certificateID);

        certDetails.set(certificateID, { courseName, candidateName, grade, date });
        console.log(certDetails.get(certificateID));
        res.status(201)//.json({ message: 'saved' })
        res.redirect('/thank-you');

    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'formsubmitted.html'));
});

app.get('/certificate', (req,res) => {
    res.json(certificates);
})

app.get("/certificate/:id", (req, res) => {
    const id1 = req.params.id;
    const details = certDetails.get(id1);
    console.log(details);
  if (!details) {
    return res.status(404).send("Certificate not found");
  }

  res.sendFile(path.join(__dirname, 'public', 'view.html'));
  
});

app.get('/api/certificate/:id', (req, res) => {
    const id1 = req.params.id;
    console.log(id1);
    const details = certDetails.get(id1);
    console.log(details);
        if (details) {
        res.json(details);

    }
    else {
        res.status(404).json({ message: 'details not found' });
    }
});
app.post('/update', (req, res) => {
    try {
        const { certificateID, courseName, candidateName, grade, date } = req.body;
        console.log(certificateID);

        certDetails.set(certificateID, { courseName, candidateName, grade, date });
        res.status(201).json({ message: 'saved' })
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
})
app.get('/delete/:id', (req, res) => {
    const id1 = req.params.id;
    console.log(id1);
    certDetails.delete(id1);
    res.status(205).json({ msg: 'delete' })
    // res.send({msg:'delete'});
})


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});