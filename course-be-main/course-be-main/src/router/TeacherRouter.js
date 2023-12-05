const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/TeacherController');
const teacherRole = require('../middleware/TeacherRole');
// const upload_course = require('../middleware/multerCourse');


// CRUD Course
router.post('/create-course',teacherRole  , TeacherController.postCreateCourse)  //teacherRole
router.patch('/update-Course' , TeacherController.UpdateCourse)
router.delete('/delete-course' , TeacherController.deleteCourse)
router.delete('/delete-allcourse', TeacherController.deleteAllCoursse )
router.get('/get-listcourse', TeacherController.getListCourse)


// CRUD School Year


router.post('/create-schoolYears/:courseid'  , TeacherController.postCreateSchoolYears) 
router.patch('/update-schoolYears' , TeacherController.updateSchoolYears)
router.delete('/delete-SchoolYear' ,TeacherController.deleteSchoolYear )


// CRUD lecture 
router.post('/create-lecture/:courseid/:yearsid'  , TeacherController.postCreateLecture) 
router.post('')


//CRUD topic 
router.post('/create-topic', TeacherController.postCreateTopicLecture) 

// CRUD theory
router.post('/create-theory' , TeacherController.postCreateTheory) 
router.get('/get-listTheory' , TeacherController.getAllTheory)

//CRUD exam 
router.post('/create-exam'  , TeacherController.PostCreateExam) 


router.get("/get-theory" ,TeacherController.getAllTheory )



// router.post('/create-course', upload_course.single('image'), TeacherController.postCreateCourse);
// router.post('/edit-course', teacherRole, TeacherController.postEditCourse);
// router.post('/create-subject', teacherRole, TeacherController.postCreateSubject);
// router.post('/course/create-lecture', teacherRole, TeacherController.postCreateLecture);
// router.post('/course/lecture-detail/create-exercise', teacherRole, TeacherController.postCreateExercise);
// router.post('/course/lecture-detail/create-question', TeacherController.postCreateQuestion);
// router.post('/edit-subject/:_id', teacherRole, TeacherController.editSubject);
module.exports = router;