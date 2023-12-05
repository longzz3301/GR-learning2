const Account = require("../model/Account");
const Course = require("../model/Course");
// const Subject = require('../model/Subject');
const Lecture = require("../model/Lecture");
const Exercise = require("../model/Exercise");
// const History = require('../model/HistoryCourse');
// const SchoolYearModel = require("../model/SchoolYear")
const MarkModelST = require("../model/mark");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const fs = require("fs-extra");
// const SchoolYear = require("../model/Schoolyear");
const TopicLecure = require("../model/TopicLecure");
const theory = require("../model/theory");
const Theory = require("../model/theory");
const SchoolYear = require("../model/SchoolYear");

const TeacherController = {
  // CRUD Course
  postCreateCourse: async (req, res, next) => {
    const { course_name, course_description } = req.body;
    // const token = req.headers.authorization?.split(" ")[1];
    // const token_decode = jwt_decode(token);
    const existingCourse = await Course.findOne({
      course_name: course_name,
      course_description: course_description,
    });

    if (!existingCourse) {
      const data = {
        course_name: course_name,
        course_description: course_description,
        // imgCourse : imgCourse
      };
      const createNewCourse = await Course.create(data);
      //   console.log(createNewCourse);
      return res
        .status(200)
        .json({ success: true, msg: "Thêm Khoá Học Thành Công !" });
    } else {
      return res
        .status(300)
        .json({ success: false, msg: "Khoá Học Đã Tồn Tại !!!" });
    }
  },

  UpdateCourse: async (req, res, next) => {
    const { course_name, course_description, courseId } = req.body;
    const existingCourse = await Course.findOne({
      id: courseId,
    });
    console.log("existingCourse :", existingCourse);
    if (existingCourse) {
      const updateCourse = await Course.updateOne(
        { id: courseId },
        { course_name: course_name, course_description: course_description },
        { new: true }
      );

      // const updateCourse = await Course.findByIdAndUpdate(
      //   courseId,
      //   {
      //     course_name: course_name,
      //     course_description: course_description,
      //   },
      //   { new: true }
      // );
      console.log("updateCourse :", updateCourse);
      return res.status(200).json({
        success: true,
        msg: "update Khoá Học Thành Công !",
        updateCourse,
      });
    } else {
      return res
        .status(300)
        .json({ success: false, msg: "K tìm thấy Khoá Học  !!!" });
    }
  },

  deleteCourse: async (req, res, next) => {
    const { courseId } = req.body;

    const getLecture = await Lecture.find({ CourseID: courseId });

    const listid_Lecture = getLecture.map((list_id) => list_id.id);

    const findListTopic = await TopicLecure.find({
      Lecture_ID: { $in: listid_Lecture },
    });

    const getIdTopic = findListTopic.map((idTopic) => idTopic.id);

    //delet theory of topic of lecture of course

    const deleteTheory = await theory.deleteMany({
      Topic_id: { $in: getIdTopic },
    });
    //delete topic of Lecture of course

    const deleteTopics = await TopicLecure.deleteMany({
      Lecture_ID: { $in: listid_Lecture },
    });

    // delete lecture of Course
    const deletelecture = await Lecture.deleteMany({ courseId: courseId });

    //delete Schoole Years of course
    const deleteSchoolYear = await SchoolYear.deleteMany({
      courseId: courseId,
    });

    //delete Course
    const deletecourse = await Course.findByIdAndDelete(courseId);
    const getid_SchoolYear = await SchoolYear.find({ courseId: courseId });

    //delet exam  of topic of lecture of course

    // const getAllExam = await Exercise.find({});
    // const filteredExam = getAllExam.filter((Exam) =>
    //   getlistIdTopics.includes(Exam.topic_id)
    // );
    // const ExamId = getLecture.map((list_id) => list_id.id);
    // const deleteExam = await TopicLecure.deleteMany({
    //   Lecture_ID: { $in: ExamId },
    // });
    // console.log("filteredExam :", ExamId);

    return res.status(200).json({
      success: true,
      msg: "delete Khoá Học Thành Công !",
    });
  },

  deleteAllCoursse: async (req, res, next) => {
    const { courseId } = req.body;
    const deletecourse = await Course.deleteMany({});
    const deletelecture = await Lecture.deleteMany({});
    const deleteSchoolYear = await SchoolYear.deleteMany({});
    const deleteTopics = await TopicLecure.deleteMany({});
    const deleteTheory = await Theory.deleteMany({});
    const deleteExam = await Exercise.deleteMany({});
    return res.status(200).json({
      success: true,
      msg: "delete all Khoá Học Thành Công !",
    });
  },

  getListCourse: async (req, res, next) => {
    const getListCourse = await Course.find({});
    return res.status(200).json({
      success: true,
      msg: "get  all Khoá Học Thành Công !",
      getListCourse,
    });
  },

  // CRUD School Years

  postCreateSchoolYears: async (req, res, next) => {
    // logic level cua nam hoc co van de
    // try {
    const { nameSchoolYear } = req.body;
    const courseId = req.params.courseid;

    const checkCourse = await Course.findOne({ id: courseId });
    const getAllYear = await SchoolYear.find({ courseId: courseId });
    const checkLevel = getAllYear.map((check) => check.level);
    console.log("checkLevel :", checkLevel);
    console.log("getAllYear :", getAllYear);
    console.log("getAllYearlength :", getAllYear.length);

    if (checkCourse) {
      const existingNameSchoolYear = await SchoolYear.findOne({
        courseId: courseId,
        nameSchoolYear: nameSchoolYear,
      });

      if (!existingNameSchoolYear) {
        const data = {
          nameSchoolYear: nameSchoolYear,

          courseId: courseId,
          level: getAllYear.length + 1,
        };
        const createSchoolYear = await SchoolYear.create(data);
        console.log(createSchoolYear);
        return res
          .status(200)
          .json({ success: true, msg: "Thêm năm học thành công !" });
      } else {
        return res.status(300).json({
          success: false,
          msg: "Name year exits !",
        });
      }
    } else {
      return res.status(300).json({
        success: false,
        msg: "course not exist !",
      });
    }

    // if (checkCourse) {
    //   const existingNameSchoolYear = await SchoolYear.findOne({
    //     courseId: courseId,
    //     nameSchoolYear: nameSchoolYear,
    //   });

    //   if (!existingNameSchoolYear) {
    //     const checkLevel = await SchoolYear.findOne({
    //       courseId: courseId,
    //       level: level,
    //     });
    //     // console.log("getYear :", checkLevel);

    //     if (!checkLevel) {
    //       // check level ?
    //       const data = {
    //         nameSchoolYear: nameSchoolYear,

    //         courseId: courseId,
    //         level: level,
    //       };
    //       const createSchoolYear = await SchoolYear.create(data);
    //       console.log(createSchoolYear);
    //       return res
    //         .status(200)
    //         .json({ success: true, msg: "Thêm năm học thành công !" });
    //     } else {
    //       return res.status(300).json({
    //         success: false,
    //         msg: "level  error !",
    //       });
    //     }
    //   } else {
    //     return res.status(300).json({
    //       success: false,
    //       msg: "Name year exits !",
    //     });
    //   }
    // } else {
    //   return res.status(300).json({
    //     success: false,
    //     msg: "course not exist !",
    //   });
    // }
  },

  updateSchoolYears: async (req, res, next) => {
    const { nameSchoolYear, id } = req.body;
    const checkid = await SchoolYear.findOne(id);
    console.log("checkid :", checkid);
    const CourseId = checkid.courseId;

    if (checkid) {
      const checkNameYear = await SchoolYear.findOne({
        courseId: CourseId,
        nameSchoolYear: nameSchoolYear,
      });
      console.log("checkNameYear :", checkNameYear);
      if (!checkNameYear) {
        const updateSchoolYears = await SchoolYear.updateOne(
          { id: id },
          {
            nameSchoolYear: nameSchoolYear,
            level: level,
          },
          { new: true }
        );
        return res
          .status(200)
          .json({ success: true, msg: "update năm học thành công !" });
      } else {
        return res.status(300).json({ success: true, msg: "name exist  !" });
      }
    } else {
      return res.status(300).json({ success: false, msg: "error roi ne !!!" });
    }
  },

  deleteSchoolYear: async (req, res, next) => {
    const { SchoolYearsID } = req.body;
    const checkid = await SchoolYear.findOne({ _id: SchoolYearsID });
    console.log("checkid :", checkid);
    if (checkid) {
      const deleteSchoolYear = await SchoolYear.findByIdAndDelete(
        SchoolYearsID
      );
      const getLectureinYear = await Lecture.find({
        SchoolYearsID: SchoolYearsID,
      });
      console.log("getLectureinYear :", getLectureinYear);
      const getIdLecture = getLectureinYear.map((Lecture_ID) => Lecture_ID.id);
      console.log("getIdLecture:", getIdLecture);
      const deletelecture = await Lecture.deleteMany({
        SchoolYearsID: SchoolYearsID,
      });
      const deleteTopic = await TopicLecure.deleteMany({
        Lecture_ID: { $in: getIdLecture },
      });
      const getTopic = await TopicLecure.find({
        Lecture_ID: { $in: getIdLecture },
      });
      const idTopic = getTopic.map((idTopic) => idTopic.id);
      console.log("getTopic :", idTopic);
      const getListTheory = await Theory.find({ Topic_id: { $in: idTopic } });
      const deleteTheory = await Theory.deleteMany({
        Topic_id: { $in: idTopic },
      });

      const getid_SchoolYear = await SchoolYear.find({
        courseId: checkid.courseId,
      });
      const checkLevel = getid_SchoolYear.map((level) => level.level);
      const updateLevel = await SchoolYear.updateMany(
        { courseId: checkid.courseId, level: { $gt: checkid.level } },
        { $inc: { level: -1 } }
      );
      console.log("getid_SchoolYear :", updateLevel);

      return res
        .status(200)
        .json({ success: false, msg: "delete success !!!" });
    } else {
      return res.status(300).json({ success: false, msg: "id fault !!!" });
    }
  },

  getListSchoolYear: async (req, res, next) => {
    const { courseId } = req.body;
    const getListSchoolYearinCourse = await SchoolYear.find({
      courseId: courseId,
    });
    return res.status(200).json({
      success: false,
      msg: "list Schoolyear  success !!!",
      list: getListSchoolYearinCourse,
    });
  },

  // CRUD Lecture

  postCreateLecture: async (req, res, next) => {
    const { nameLecture } = req.body;
    const courseId = req.params.courseid;
    const YearsId = req.params.yearsid;
    const checkCourse = await Course.findOne({ id: courseId });
    console.log("checkCourse :", checkCourse);
    const checkYear = await SchoolYear.findOne({ id: YearsId });
    console.log("checkYear :", checkYear);
    if (checkCourse && checkYear) {
      const nameLectureExist = await Lecture.findOne({
        CourseID: courseId,
        SchoolYearsID: YearsId,
        nameLecture: nameLecture,
      });
      console.log("nameLectureExist :", nameLectureExist);
      if (!nameLectureExist) {
        const data = {
          nameLecture: nameLecture,
          CourseID: courseId,
          SchoolYearsID: YearsId,
        };
        const creatLecture = await Lecture.create(data);
        console.log("creatLecture :", creatLecture);
        return res
          .status(200)
          .json({ success: true, msg: "Thêm lecture học thành công !" });
      } else {
        return res
          .status(300)
          .json({ success: false, msg: "Bai hoc Đã Tồn Tại !!!" });
      }
    } else {
      return res.status(300).json({ success: false, msg: "loi !!!" });
    }
  },

  updateLecture: async (req, res) => {
    const { id, nameLecture } = req.body;
    const checkId = await Lecture.findOne({ id: id });
    const getYear = checkId.SchoolYearsID;
    if (checkId) {
      const checkName = await Lecture.findOne({ SchoolYearsID: getYear });
      if (!checkName) {
        const updateLecture = await Lecture.findByIdAndUpdate(
          { id },
          { nameLecture: nameLecture }
        );
        return res
          .status(200)
          .json({ success: true, msg: "update lecture học thành công !" });
      } else {
        return res
          .status(300)
          .json({ success: false, msg: "name exist not found !!!" });
      }
    } else {
      return res.status(300).json({ success: false, msg: "id not found !!!" });
    }
  },

  deletelecture: async (req, res) => {
    const { id } = req.body;
    const deletelecture = await Lecture.findByIdAndDelete(id);
    // const deleteTopic = await TopicLecure.deleteMany({
    //   Lecture_ID: id
    // })
    const getTopic = await TopicLecure.find({ Lecture_ID: id });
    const getIdTopic = getTopic.map((topId) => topId.id);
    const deleteTheory = await theory.deleteMany({ _id: { $in: getIdTopic } });
    //delete exam chua done
  },

  getLecture : async (req, res) => {
    const {CourseID ,SchoolYearsID } = req.body
    const findLecture = await Lecture.findOne({CourseID:CourseID , SchoolYearsID: SchoolYearsID})
    return res
    .status(200)
    .json({ success: true, msg: "get lecture học thành công !" , "lecture" : findLecture  });
  },

  // CRUD TOPIC

  postCreateTopicLecture: async (req, res) => {
    try {
      const { TopicName, Lecture_ID } = req.body;
      const checkTopicExist = await TopicLecure.findOne({
        Lecture_ID: Lecture_ID,
        TopicName: TopicName,
      });
      if (!checkTopicExist) {
        const data = {
          TopicName: TopicName,
          Lecture_ID: Lecture_ID,
        };
        const createTopic = await TopicLecure.create(data);
        console.log("createTopic :", createTopic);
        return res
          .status(200)
          .json({ success: true, msg: "Thêm Topic thành công !" });
      } else {
        return res.status(300).json({ success: false, msg: " Topic exist !" });
      }
    } catch (error) {
      console.log("error :", error);
    }
  },

  updateTopic :  async (req, res) => {
    const {TopicName, topId} = req.body
    const checkTopicExist = await TopicLecure.findOne({
      TopicName:TopicName ,
      id:topId
    })  
    if (!checkTopicExist) {
      const updateTopic = await TopicLecure.updateOne(
        {id:topId},
        {TopicName:TopicName}
      )
      return res
      .status(200)
      .json({ success: true, msg: "update Topic thành công !" });
    }else {
      return res.status(300).json({ success: false, msg: " Topic name exist !" })
    }
  },

  getTopic :  async (req, res) => {
    const {Lecture_ID} = req.body
    const checkLecture = await Lecture.findById(Lecture_ID)
    if (checkLecture) {
      const getTopic = await TopicLecure.findOne({Lecture_ID:Lecture_ID})
      return res
      .status(200)
      .json({ success: true, msg: "update Topic thành công !" , "getTopic :": getTopic });
    }else{
      return res.status(300).json({ success: false, msg: " error Lecture_id not found !" })
    }
  },






  // CRUD theory

  postCreateTheory: async (req, res, next) => {
    const { nameQuestion, answer, Topic_id } = req.body;
    const getTopicDetail = await TopicLecure.findOne({ id: Topic_id });
    const getTheoryExist = await theory.findOne({ Topic_id: Topic_id });

    if (getTopicDetail) {
      if (getTheoryExist) {
        const getTheory = getTheoryExist.Theory;
        const checkTheory = getTheory.filter(
          (name) => name.nameQuestion === nameQuestion
        );
        console.log("checkTheory:", checkTheory);
        if (checkTheory.length === 0) {
          getTheoryExist.Theory.push({
            nameQuestion: nameQuestion,
            answer: answer,
          });

          // Save the updated document
          await getTheoryExist.save();
          return res.status(200).json({
            success: true,
            msg: "theem  theory thành công!",
            createdTheory: getTheoryExist,
          });
        } else {
          return res.status(200).json({
            success: false,
            msg: "  question name bi trung roi ne !",
            // createdTheory: getTheoryExist,
          });
        }
      } else {
        const Theory = [
          {
            nameQuestion: nameQuestion,
            answer: answer,
          },
        ];
        console.log(Theory);

        const createdTheory = await theory.create({
          Theory: [
            {
              nameQuestion: nameQuestion,
              answer: answer,
            },
          ],
          Topic_id: Topic_id,
        });
        console.log(createdTheory);
        return res.status(200).json({
          success: true,
          msg: "tạo theory thành công !",
          createdTheory,
        });
      }
    } else {
      return res.status(300).json({
        success: false,
        msg: " error not found topic to create theory !",
      });
    }
  },

  getAllTheory: async (req, res, next) => {
    const { Topic_id } = req.body;
    const getListTheory = await theory.findOne({ Topic_id: Topic_id });
    console.log(getListTheory);

    return res
      .status(200)
      .json({ success: true, msg: "get theory thành công !", getListTheory });
  },




  //CRUD exam 

  PostCreateExam: async (req, res, next) => {
    const {
      question_name,
      topic_id,
      correct_answer,
      wrong_answer1,
      wrong_answer2,
      wrong_answer3,
      wrong_answer4,
    } = req.body;
    const checkId = await TopicLecure.findOne({ id: topic_id });
    if (checkId) {
      const checkExcercise = await Exercise.findOne({ topic_id: topic_id });
      if (checkExcercise) {
        const getExcercise = checkExcercise.ex_question;
        const checkQuestion = getExcercise.filter(
          (question) => question.question_name === question_name
        );
        console.log("checkQuestion :" , checkQuestion)
        console.log("getExcercise :" , getExcercise)

        if (checkQuestion.length === 0) {
          checkExcercise.ex_question.push({
            question_name: question_name,
            correct_answer: correct_answer,
            wrong_answer1: wrong_answer1,
            wrong_answer2: wrong_answer2,
            wrong_answer3: wrong_answer3,
            wrong_answer4: wrong_answer4,
          });

          await checkExcercise.save();
          return res.status(200).json({
            success: true,
            msg: "theem  excercise thành công!",
            createdTheory: checkExcercise,
          });
        } else
          return res.status(200).json({
            success: false,
            msg: "  question name bi trung roi ne !",
            // createdTheory: getTheoryExist,
          });
      } else {
        const ex_question = [
          {
            question_name: question_name,
            correct_answer: correct_answer,
            wrong_answer1: wrong_answer1,
            wrong_answer2: wrong_answer2,
            wrong_answer3: wrong_answer3,
            wrong_answer4: wrong_answer4,
          },
        ];
        console.log(Theory);

        const createdTheory = await Exercise.create({
          ex_question: [
            {
              question_name: question_name,
              correct_answer: correct_answer,
              wrong_answer1: wrong_answer1,
              wrong_answer2: wrong_answer2,
              wrong_answer3: wrong_answer3,
              wrong_answer4: wrong_answer4,
            },
          ],
          topic_id: topic_id,
        });
        console.log(createdTheory);
        return res.status(200).json({
          success: true,
          msg: "tạo exam thành công !",
          createdTheory,
        });
      }
    }
  },




  //  create mark-topic 
  PostMark_topic :  async (req, res, next) => {
    const {mark , examId } = req.body
    
     const token = req.headers.authorization?.split(" ")[1];
    const token_decode = jwt_decode(token);
      
    const checkExam = await Exercise.findOne({_id : examId})
    const getTopicId = checkExam.topic_id
    const getTopic = await TopicLecure.findById(getTopicId)
    if (checkExam && getTopic) {
      const createMark_topic = await MarkModelST.create({
        mark:mark ,
        exam_id:getTopicId,

      })
    }
  },
  





  // create mark-Lecture 



  // create mark-School Year 




































  // postChangePassword: async (req, res, next) => {

  // },
  // getAllCourse: async (req, res, next) => {
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     await Course.find({ teacher_email: token_decode.email }).then(async courses => {
  //         if (!courses) {
  //             return res.status(300).json({ success: false, msg: 'Khoá học không tồn tại' })
  //         }
  //         return res.status(200).json({ success: true, data: courses })
  //     })
  // },
  // getCourse: async (req, res, next) => {
  //     const _id = req.params._id;
  //     await Course.findOne({ _id: _id }).then(course => {
  //         if (!course) {
  //             return res.status(300).json({ success: false, msg: 'Không Tồn Tại Khoá Học' })
  //         } else {
  //             return res.status(200).json({ success: true, course })
  //         }
  //     })
  // },
  // postCreateCourse: async (req, res, next) => {
  //     const {  course_name, course_description, course_price } = req.body;

  //     // const token = req.headers['authorization'];
  //     // const token_decode = jwt_decode(token);
  //     // console.log(req.body)

  //     try {
  //         const existingCourse = await Course.findOne({ course_name: course_name }).then(async course => {
  //             console.log("course :" , existingCourse)
  //             if ( !existingCourse) {
  //                 const data = {
  //                     // teacher_email: token_decode.email,
  //                     // course_id: course_id,
  //                     course_price: course_price,
  //                     // sub_id: sub_id,
  //                     course_name: course_name,
  //                     course_description: course_description,

  //                     // course_image: file.filename
  //                 }
  //                 console.log("data :" , data)
  //                 await Course(data).save();

  //                 console.log("Course :" , Course)
  //                 return res.status(200).json({ success: true, msg: 'Thêm Khoá Học Thành Công !' })
  //             } else {
  //                 return res.status(300).json({ success: false, msg: 'Khoá Học Đã Tồn Tại !!!' })
  //             }
  //         })
  //     } catch (error) {
  //         return res.status(500).json({ success: false, msg: 'Có lỗi xảy ra' })
  //     }
  // },
  // postEditCourse: async (req, res, next) => {
  //     const { course_id, course_name, course_description, course_price, course_status, dateStart, dateEnd } = req.body;
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     await Course.findOne({ course_id: course_id, teacher_email: token_decode.email }).then(async course => {
  //         if (!course) {
  //             return res.status(400).json({ success: false, msg: 'Khoá học không tồn tại' })
  //         }
  //         course.course_id = course_id;
  //         course.course_name = course_name;
  //         course.course_description = course_description;
  //         course.dateStart = dateStart;
  //         course.dateEnd = dateEnd;
  //         course.course_price = course_price;
  //         course.course_status = course_status
  //         await course.save();
  //         return res.status(200).json({ success: true, msg: "Cập nhật thành công" });
  //     }).catch(err => {
  //         return res.status(400).json({ success: false, msg: 'Cập nhật thất bại !' });
  //     })
  // },
  // deleteCourse: async (req, res, next) => {
  //     const _id = req.params._id;
  //     try {
  //         await Course.findByIdAndDelete(_id).then(async course => {
  //             const filePath = `src/public/uploads/courses/${course.course_id}`;
  //             await fs.rmSync(filePath, { recursive: true, force: true });
  //             const lecture = await Lecture.findOne({ course_id: course.course_id });
  //             const exercise = await Exercise.findOne({ lecture_id: lecture.lecture_id });
  //             await Lecture.findByIdAndDelete(lecture._id);
  //             await Exercise.findByIdAndDelete(exercise._id);

  //         });
  //         return res.status(200).json({ success: true, msg: "Xoá Khoá Học Thành Công !!!" })
  //     } catch (error) {
  //         return res.status(500).json({ success: false, msg: "Có lỗi xảy ra. Vui lòng kiểm tra lại !!!" })
  //     }
  // },
  // searchCourse: async (req, res, next) => {
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     try {
  //         await Course.find(
  //             {
  //                 "$or": [
  //                     { course_name: { $regex: req.params.key } },
  //                     { course_id: { $regex: req.params.key } },
  //                     { dateStart: { $regex: req.params.key } },
  //                     { dateEnd: { $regex: req.params.key } },

  //                 ],
  //                 teacher_email: token_decode.email
  //             }
  //         ).then(async courses => {
  //             let data = courses.map(course => {
  //                 return {
  //                     course_id: course.course_id,
  //                     course_name: course.course_name,
  //                     course_description: course.course_description,
  //                     dateStart: course.dateStart,
  //                     dateEnd: course.dateEnd,
  //                     course_status: course.course_status
  //                 }
  //             });
  //             return res.status(200).json({ success: true, record: data })
  //         })
  //     } catch (error) {
  //         console.log(error);
  //         return res.status(500).json({ success: false, msg: 'Server Error' })
  //     }
  // },
  // getAllSubject: async (req, res, next) => {
  //     await Subject.find().then(subjects => {
  //         return res.status(200).json({ success: true, data: subjects })
  //     })
  // },
  // postCreateSubject: async (req, res, next) => {
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     const { sub_id, sub_name } = req.body;
  //     await Subject.findOne({ sub_id: sub_id }).then(async subject => {
  //         if (!subject) {
  //             let data = {
  //                 sub_id: sub_id,
  //                 sub_name: sub_name,
  //                 teacher_email: token_decode.email
  //             }
  //             await Subject(data).save();
  //             return res.status(200).json({ success: true, msg: "Thêm Môn Học Thành Công", data: subject })
  //         } else {
  //             return res.status(300).json({ success: false, msg: "Môn Học Đã Tồn Tại !!!" })
  //         }
  //     })
  // },
  // deleteSubject: async (req, res, next) => {
  //     const _id = req.params._id;
  //     await Subject.findByIdAndDelete(_id).then(subject => {
  //         return res.status(200).json({ success: true, msg: 'Xoá Thành Công' })
  //     }).catch(err => {
  //         return res.status(400).json({ success: false, msg: 'Có Lỗi Xảy Ra' })
  //     })
  // },
  // editSubject: async (req, res, next) => {
  //     const _id = req.params._id;
  //     const { sub_name } = req.body
  //     console.log(sub_name);
  //     await Subject.findOne({ _id: _id }).then(async sub => {
  //         sub.sub_name = sub_name;
  //         await sub.save();
  //         return res.status(200).json({ success: true, msg: 'Thay Đổi Thành Công' })
  //     }).catch(err => {
  //         return res.status(400).json({ success: false, msg: 'Có Lỗi Xảy Ra' })
  //     })
  // },
  // getCourseDetail: async (req, res, next) => {
  //     const slug = req.params.slug;
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     try {
  //         const course = await Course.findOne({ course_slug: slug });
  //         const subject = await Subject.findOne({ course_id: course.course_id });
  //         const lecture = await Lecture.find({ course_id: course.course_id }).lean();
  //         const history = await History.findOne({ course_id: course.course_id, email: token_decode.email });
  //         const studentList = await History.find({ course_id: course.course_id });
  //         const courseDetail = {
  //             course_id: course.course_id,
  //             course_name: course.course_name,
  //             course_description: course.course_description,
  //             course_price: course.course_price,
  //             course_status: course.course_status,
  //             sub_id: subject.sub_id,
  //             dateStart: course.dateStart,
  //             dateEnd: course.dateEnd,
  //             sub_name: subject.sub_name,
  //             course_image: course.course_image,
  //             isRegister: (history == null) ? false : true
  //         }
  //         return res.status(200).json({ success: true, courseDetail, lecture, studentList })
  //     } catch (error) {
  //         return res.status(500).json({ success: false, msg: 'Có Lỗi Xảy Ra. Vui Lòng Thử Lại !!!' });
  //     }

  // },
  // getLecture: async (req, res, next) => {
  //     const course_id = req.params.id
  //     await Lecture.findOne({ course_id: course_id }).then(lecture => {
  //         if (!lecture) {
  //             return res.status(400).json({ success: false, msg: 'Chưa Có Bài Giảng Nào Cho Khoá Học' })
  //         } else {
  //             return res.status(200).json({ success: true, lecture })
  //         }
  //     })
  // },
  // postCreateLecture: async (req, res, next) => {
  //     const { course_id, lecture_id, lecture_name, lecture_content, lecture_image, lecture_document } = req.body;
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     await Lecture.findOne({ lecture_id: lecture_id }).then(async lecture => {
  //         if (!lecture) {
  //             const data = {
  //                 teacher_email: token_decode.email,
  //                 course_id: course_id,
  //                 lecture_id: lecture_id,
  //                 lecture_name: lecture_name,
  //                 lecture_content: lecture_content,
  //                 lecture_document: lecture_document,
  //                 lecture_image: lecture_image
  //             }
  //             await Lecture(data).save();
  //             return res.status(200).json({ success: true, msg: 'Thêm Bài Giảng Thành Công !' })
  //         } else {
  //             return res.status(400).json({ success: false, msg: 'Bài Giảng Đã Tồn Tại !' })
  //         }
  //     })
  // },
  // getDelLecture: async (req, res, next) => {
  //     const _id = req.params._id;
  //     try {
  //         await Lecture.findByIdAndDelete(_id);
  //         return res.status(200).json({ success: true, msg: 'Xoá Bài Giảng Thành Công' });
  //     } catch (error) {
  //         return res.status(400).json({ success: false, msg: 'Có Lỗi Xảy Ra Vui Lòng Thử Lại !!!' });
  //     }
  // },
  // getLectureDetail: async (req, res, next) => {
  //     const slug = req.params.slug;
  //     const lecture = await Lecture.findOne({ lecture_slug: slug });
  //     const exercise = await Exercise.find({ lecture_id: lecture.lecture_id });
  //     return res.status(200).json({ success: true, lecture, exercise });
  // },
  // getMarkStudent : async (req, res, next) => {
  // const token = req.headers['authorization'];
  // const token_decode = jwt_decode(token);
  // const getCourse = req.params.param1;
  // console.log("getCourse :" , getCourse)
  // const lecture = req.params.param2;
  // console.log("lecture :" , lecture)
  // const getMarkStudent = await MarkModelST.findOne({
  //     lecture_name:lecture ,
  //     course_name: getCourse

  // })
  // console.log("getMarkStudent :" , getMarkStudent)
  // res.status(200).json({ success: true, "mark of this course : " :getMarkStudent })
  //     await MarkModelST.find().then(marks => {
  //         return res.status(200).json({ success: true, data: marks })
  //     })
  // },

  // postCreateExercise: async (req, res, next) => {
  //     const { lecture_id, ex_id, ex_name } = req.body;
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     await Exercise.findOne({ ex_id: ex_id }).then(async ex => {
  //         if (!ex) {
  //             const data = {
  //                 lecture_id: lecture_id,
  //                 ex_id: ex_id,
  //                 ex_name: ex_name,
  //                 teacher_email: token_decode.email
  //             }
  //             await Exercise(data).save();
  //             return res.status(200).json({ success: true, msg: 'Thêm Bài Tập Thành Công !!!' })
  //         } else {
  //             return res.status(400).json({ success: false, msg: 'Bài Tập Đã Tồn Tại !!!' })
  //         }
  //     })

  // },
  // getDelEx: async (req, res, next) => {
  //     const _id = req.params.id;
  //     try {
  //         await Exercise.findByIdAndDelete(_id)
  //         return res.status(200).json({ success: true, msg: 'Xoá Bài Tập Thành Công' })
  //     } catch (error) {
  //         return res.status(500).json({ success: false, msg: 'Có Lỗi Xảy Ra. Vui Lòng Thử Lại !!!' })
  //     }
  // },
  // postCreateQuestion: async (req, res, next) => {
  //     const { question_name, ex_id, question_content } = req.body;

  //     // ex_id la _id cua field
  //     await Exercise.findByIdAndUpdate({ _id: ex_id }, {
  //         $push: { ex_question: { question_name: question_name, question_content: question_content } }
  //     })
  //     return res.status(200).json({ success: true, msg: 'Thêm Câu Hỏi Thành Công' })
  // },
  // deleteStudent: async (req, res, next) => {
  //     const _id = req.params._id;
  //     try {
  //         await History.findByIdAndDelete(_id);
  //         return res.status(200).json({ msg: 'Xoá Học Viên Khỏi Khoá Học Thành Công' })
  //     } catch (error) {
  //         return res.status(400).json({ msg: 'Xoá Học Viên Không Thành Công' })
  //     }
  // }
};
module.exports = TeacherController;
