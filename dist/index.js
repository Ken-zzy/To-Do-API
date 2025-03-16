"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const note_1 = __importDefault(require("./models/note"));
const errors_1 = require("./errors");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notesdb';
app.use(express_1.default.json());
mongoose_1.default.connect(mongoUri)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log(err));
app.get('/api/notes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield note_1.default.find();
    res.json(notes);
}));
app.get('/api/notes/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_1.default.findById(req.params.id);
        if (!note) {
            throw new errors_1.NotFoundError('Note not found');
        }
        res.json(note);
    }
    catch (err) {
        next(err);
    }
}));
app.post('/api/notes', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = new note_1.default(req.body);
        yield note.save();
        res.status(201).json(note);
    }
    catch (err) {
        next(new errors_1.BadRequestError('Invalid note data'));
    }
}));
app.delete('/api/notes/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield note_1.default.findByIdAndDelete(req.params.id);
        if (!note) {
            throw new errors_1.NotFoundError('Note not found');
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
