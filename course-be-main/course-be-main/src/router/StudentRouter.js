const express = require('express');
const router = express.Router();
const StudentController = require('../controller/StudentController');
const upload = require('../middleware/multerAvatar');



// router.post('/change-password', StudentController.changePassword);
// router.post('/register-course', StudentController.registerCourse);
// router.post('/update-information', upload.single('file'), StudentController.updateInformation);



//  get course & list course 
router.get('/get_list_yearStu' , StudentController.get_list_yearStu)


// get list lecture for stu 
router.post('/get_lecture' , StudentController.get_lecture)

// get exam -theory 
router.get('/get_exam_theory' , StudentController.get_exam_theory)

// caculate mark after submit exam 
router.post('/createMark-topic/:course_id/:schoolyear_id/:lecture_id/:topic_id' , StudentController.PostMark_topic)

// student check mark 

router.get('/get_mark_topic' , StudentController.check_mark_stu)

// router.get('/all-course', StudentController.getAllCourse);
// // router.get('/course/lecture-detail/:course_slug/:slug',StudentController.getLectureDetail);
// router.get('/course/lecture-detail/:slug',StudentController.getLectureDetail);
// router.get('/all-faqs', StudentController.getFaqs);
// router.post('/update-mark/:param1/:param2', StudentController.MarkStudent);
// router.get('/history-course', StudentController.getHistoryCourse);
module.exports = router;

