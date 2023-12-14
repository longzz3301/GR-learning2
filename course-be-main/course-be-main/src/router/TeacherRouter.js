const express = require('express');
const router = express.Router();
const TeacherController = require('../controller/TeacherController');
const teacherRole = require('../middleware/TeacherRole');
// const upload = require('../middleware/multerExcel');
// const upload_course = require('../middleware/multerCourse');
const multer = require('multer');
const fs = require('fs-extra');
const storage = multer.memoryStorage(); // Lưu trữ file trong bộ nhớ
const upload = multer({ storage: storage });

// CRUD Course
router.post('/create-course'  , TeacherController.postCreateCourse)  //teacherRole
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
router.post('/create-topic', TeacherController.CreateTopicLecture) 

// CRUD theory
router.post('/create-theory' , TeacherController.postCreateTheory) 
router.get('/get-listTheory' , TeacherController.getAllTheory)
router.get ('/get-theory ' )
//CRUD exam 
router.post('/create-exam'  , TeacherController.PostCreateExam) 

router.post('/get-listExam' , )
router.get("/get-theory" ,TeacherController.getAllTheory )



// post mark exam_topic 
// router.post('/createMark-topic/:course_id/:schoolyear_id/:lecture_id/:topic_id' , TeacherController.PostMark_topic)

// router.post('/createMark-lecture' , TeacherController.PostMark_lecture)


// router.post('/createMark-year' , TeacherController.PostMark_year)

// router.post('/createMark/:course_id/:schoolyear_id/:lecture_id/:topic_id' , TeacherController.PostMark_topic)




// test create file excel 

router.post('/create_file_excel/:topic_id' , upload.single("csvFile") , TeacherController.test_import_file)

// add course => student 

router.get('/get_list_student' , TeacherController.get_list_student)
router.post('/add_year_student/:course_id' , TeacherController.add_year_student)


// router.post('/create-course', upload_course.single('image'), TeacherController.postCreateCourse);
// router.post('/edit-course', teacherRole, TeacherController.postEditCourse);
// router.post('/create-subject', teacherRole, TeacherController.postCreateSubject);
// router.post('/course/create-lecture', teacherRole, TeacherController.postCreateLecture);
// router.post('/course/lecture-detail/create-exercise', teacherRole, TeacherController.postCreateExercise);
// router.post('/course/lecture-detail/create-question', TeacherController.postCreateQuestion);
// router.post('/edit-subject/:_id', teacherRole, TeacherController.editSubject);
module.exports = router;