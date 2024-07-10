import mongoose, { get } from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/playground')
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Connection to MongoDB failed...', err));

const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5,
        maxlength: 255,
        //match: /pattern/ //regex
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        trim: true
    },
    author: String, //custom validator
    tags: {
        type: Array,
        validate: {
            validator: function(v) {

                    const result = v && v.length > 0;
            },
            message: 'A course should have at least one tag.'
        }
    },
    price: { 
        type: Number, 
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v),
        required: function() { return this.isPublished } 
    },
    tags: [ String ],
    date: { type: Date, default: Date.now },
    isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: "The React.js Course",
        author: "Mosh",
        tags: ['express', 'frontend'],
        isPublished: true    
    })

    try {
        const result = await course.save()
        console.log(result)
    } catch (err) {
        // console.log(err.message) handling errors
        for (field in err.errors){
            console.log(err.errors[field].message)
        }
    }
    
}

const getCourses = async () => {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)

    //Logical operators
    // or
    // and

   // const pageNumber = 2
    //const pageSize = 10
    // /api/courses?pageNumber=2&pageSize=10

    const courses = await Course
    .find({ author: 'Mosh', isPublished: true })
    //.find({ price: { $gte: 10, $lte: 20 } })
    //.find({ price: { $in: [10, 15, 20] } })
    // .find()
    // .or([ {author: 'Mosh'}, {isPublished: true} ])

    // Starts with Mosh
    //.find({ author: /^Mosh/ })

    //ends with Hamedani
    //.find({ author: /Hamedani$/i })

    // Contains Mosh
    //.find({ author: /.*Mosh.*/i })
    //.limit(10)
    //.skip((pageNumber - 1) * pageSize)
    .sort({ name: -1 })
    .select({ name: 1, tags: 1, price: 1})
    //.count() //instead of select
    console.log(courses)
}

//getCourses()

const updateCourse = async (id) => {
    // Approach: Query first
    // findById()
    // Modify its properties
    // save()

    // const course = await Course.findById(id)
    // if (!course) return
    // course.isPublished = true
    // course.author = 'Another Author'

    // const result = await course.save()
    // console.log(result)


    // Approach 2: Update first
    // Update directly
    // Optionally: get the updated document

    // const result = await Course.updateOne({_id: id}, {
    //     $set: {
    //         author: 'Mosh',
    //         isPublished: false
    //     }
    // })
    // console.log(result)

    // to get the updated document

    const result = await Course.findByIdAndUpdate(id, {
        $set: {
            author: 'Jason',
            isPublished: true
        }
    }, { new: true })
    console.log(result)

}

//updateCourse('64eef9826e275435435');

const removeCourse = async (id) => {
    //const result = await Course.deleteOne({ _id: id })
    const result = await Course.findByIdAndRemove(id)
    console.log(result)
}

//removeCourse('64eef9826e275435435');