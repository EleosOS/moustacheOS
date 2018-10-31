import mongoose from 'mongoose';
import { app } from './Modules/index';
const port: number = 3001;

console.log('--------------------\nStarting moustache\n--------------------');

try {
    mongoose.connect('mongodb://localhost/moustacheDB', { useNewUrlParser: true });
    console.log('[master] Connected to MongoDB.');
} catch (e) {
    console.log(e);
}

app.listen(port, () => {
    console.log(`[express] Listening at port ${port}`);
});
