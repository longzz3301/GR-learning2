const Account = require("../model/Account");
const Course = require("../model/Course");

const Lecture = require("../model/Lecture");

const Exercise = require("../model/Exercise");
// const MarkModelST = require("../model/mark");

const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
const fs = require("fs-extra");
const SchoolYear = require("../model/SchoolYear");
const Mark_Year = require("../model/Mark_Year");
const TopicLecure = require("../model/TopicLecure");
const theory = require("../model/theory");
const mark_Lecture = require("../model/mark_Lecture");
const Mark_Topic = require("../model/Mark_Topic");
const StudentController = {
  PostMark_topic: async (req, res, next) => {
    try {
      const { mark, exam_id, student_id } = req.body;
      const CourseID = req.params.course_id;
      const SchoolYearsID = req.params.schoolyear_id;
      const topic_id = req.params.topic_id;
      const lecture_id = req.params.lecture_id;
      const token = req.headers.authorization?.split(" ")[1];
      // const token_decode = jwt_decode(token);
      // const student = token_decode.email
      // const getstudentId = await Account.findOne({email:student})
      // const studentId = getstudentId.id // student id qua token
      const check_id_stu = await Account.findById(student_id);
      const checkExam = await Exercise.findOne({ id: exam_id });
      console.log("checkExam :", checkExam);

      // const checkTopicId = await TopicLecure.findOne({ id: getTopicId });
      // console.log("getTopicId :", getTopicId);

      const checkMarkTopicExits = await Mark_Topic.findOne({
        student_id: student_id,
        exam_id: exam_id,
      });
      console.log("student_id", student_id);
      console.log("examId", exam_id);
      console.log("checkMarkTopicExits :", checkMarkTopicExits);

      if (checkExam === null && check_id_stu === null) {
        return res.status(300).json({
          success: false,
          msg: "loi roi ne !",
        });
      }
      if (checkMarkTopicExits) {
        const filterUpdateMarkTopic = { _id: checkMarkTopicExits.id };
        const updateMarkTopic = { mark: mark };
        const optionsUpdateMarkTopic = { upsert: true };

        const updatemark_topic = await Mark_Topic.updateOne(
          filterUpdateMarkTopic,
          updateMarkTopic,
          optionsUpdateMarkTopic
        );
      } else {
        // Tạo mới mark cho topic nếu chưa tồn tại
        const createMark_topic = await Mark_Topic.create({
          mark: mark,
          exam_id: exam_id,
          student_id: student_id,
          topic_id: topic_id,
        });
      }
      // caculate mark lecture

      const get_lecture_ids = lecture_id;
      const get_list_topic = await TopicLecure.find({
        Lecture_ID: get_lecture_ids,
      });
      console.log("123");

      const list_topic_id = get_list_topic.map((list) => list.id);
      const list_mark = await Mark_Topic.find({
        topic_id: { $in: list_topic_id },
        student_id: student_id,
      });
      const get_mark = list_mark.map((list) => list.mark);
      const intialValue = 0;
      const total_mark_lecture =
        get_mark.length > 0
          ? get_mark.reduce(
              (calculateTotal, currentValue) => calculateTotal + currentValue,
              0
            ) / get_mark.length
          : 0;

      const check_mark_lecture = await mark_Lecture.findOne({
        student_id: student_id,
        Lecture_ID: lecture_id,
      });

      const filter = { student_id: student_id, Lecture_ID: lecture_id };
      const update = { mark: total_mark_lecture };
      const options = { upsert: true }; // Nếu không tìm thấy, tạo mới
      const result = await mark_Lecture.updateOne(filter, update, options);
      console.log("caculate mark lecture ", total_mark_lecture);

      // caculate mark year
      const find_lecture = await Lecture.find({
        CourseID: CourseID,
        SchoolYearsID: SchoolYearsID,
      });

      const leccture_id = find_lecture.map((lecture) => lecture.id);
      const find_mark_lec = await mark_Lecture.find({
        student_id: student_id,
        Lecture_ID: { $in: leccture_id },
      });
      const MarkLecture = find_mark_lec.map((mark) => mark.mark);
      const intialValue2 = 0;
      const UpdateTotalMarkYear = MarkLecture.reduce(
        (caculateTotal, intialValue) =>
          (caculateTotal + intialValue) / MarkLecture.length
      );
      console.log("totalMark", UpdateTotalMarkYear);
      const filterMarkYear = {
        courseId: CourseID,
        SchoolYearsID: SchoolYearsID,
        student_id: student_id,
      };

      const updateMarkYear = {
        mark: UpdateTotalMarkYear,
      };

      const optionsMarkYear = { upsert: true };

      const resultMarkYear = await Mark_Year.updateOne(
        filterMarkYear,
        updateMarkYear,
        optionsMarkYear
      );

      console.log("caculate mark year", resultMarkYear);

      return res.status(200).json({
        success: true,
        msg: "creat diem học thành công !",
      });
    } catch (error) {
      return res.status(300).json({
        success: false,
        msg: error.message,
      });
    }
  },

  get_list_yearStu: async (req, res, next) => {
    // const token_decode = jwt_decode(token);
    // const student = token_decode.email
    // const getstudentId = await Account.findOne({email:student})
    // const studentId = getstudentId.id // student id qua token

    const { student_id } = req.body;
    const get_stu = await Account.findById(student_id);
    const getCourse = get_stu.course_id;
    const get_list_yearStu = get_stu.school_yearid;
    if (get_list_yearStu === null) {
      return res.status(300).json({
        success: false,
        msg: error.message,
      });
    }

    const get_list_year = await SchoolYear.findOne({
      courseId: getCourse,
    });
    return res.status(200).json({
      success: true,
      msg: "tạo exam thành công !",
      list_year: get_list_year,
    });
  },

  get_lecture: async (req, res, next) => {
    // const token_decode = jwt_decode(token);
    // const student = token_decode.email
    // const getstudentId = await Account.findOne({email:student})
    // const studentId = getstudentId.id // student id qua token
    const student_id = req.params.id;
    const get_stu = await Account.findById(student_id);
    const course_id = get_stu.course_id;
    const { school_yearid } = req.body;
    const get_schoolYear = await SchoolYear.findById(school_yearid);
    const check_level = get_schoolYear.level;

    if (check_level !== 1) {
      const level = check_level - 1;
      const check_level = await SchoolYear.findOne({
        level: level,
        courseId: course_id,
      });
      const get_id = check_level.id;
      const check_mark = await Mark_Year.findOne({
        courseId: course_id,
        student_id: student_id,
        SchoolYearsID: get_id,
      });

      if (check_mark > 80) {
        const getLecture = await Lecture.findOne({
          CourseID: course_id,
          SchoolYearsID: school_yearid,
        });
        return res.status(200).json({
          success: true,
          msg: "get lecture thành công !",
          list_lecutre: getLecture,
        });
      } else {
        return res.status(300).json({
          success: false,
          msg: "k du trinh len lop !",
        });
      }
    }

    const get_lecutre = await Lecture.find({
      CourseID: course_id,
      SchoolYearsID: school_yearid,
    });
    return res.status(200).json({
      success: true,
      msg: "level year = 1 => get lecture thành công !",
      list_lecutre: get_lecutre,
    });
  },

  get_topic: async (req, res, next) => {
    const Lecture_id = req.body;
    const checkLecture = await Lecture.findById(Lecture_id);

    if (!checkLecture) {
      return res.status(300).json({
        success: false,
        msg: "not found lecture",
      });
    }

    const list_topic = await TopicLecure.findOne({
      Lecture_ID: Lecture_id,
    });

    return res.status(200).json({
      success: true,
      msg: "get list topic success !",
      list_topic: list_topic,
    });
  },

  get_exam_theory: async (req, res, next) => {
    // const token_decode = jwt_decode(token);
    // const student = token_decode.email
    // const getstudentId = await Account.findOne({email:student})
    // const studentId = getstudentId.id // student id qua token
    try {
      const { topic_id } = req.body;
      const check_topic = await TopicLecure.findById(topic_id);

      if (!topic_id) {
        return res.status(300).json({
          success: false,
          msg: "not found topic",
        });
      }

      const get_theory = await theory.findOne({ Topic_id: topic_id });
      const get_exam = await Exercise.findOne({ topic_id: topic_id });
      return res.status(200).json({
        success: true,
        msg: "get list topic success !",
        list_theory: get_theory,
        list_exam: get_exam,
      });
    } catch (error) {
      return res.status(300).json({
        success: false,
        msg: error.message,
      });
    }
  },

  check_mark_stu: async (req, res, next) => {
    // const token_decode = jwt_decode(token);
    // const student = token_decode.email
    // const getstudentId = await Account.findOne({email:student})
    // const studentId = getstudentId.id // student id qua token
    const { student_id } = req.body;
    const get_student = await Account.findById(student_id);
    if (!get_student) {
      return res.status(300).json({
        success: false,
        msg: "user error",
      });
    }
    // get mark stu _ topic
    const find_mark_topic = await Mark_Topic.find({
      student_id: student_id,
    });

    const get_id = find_mark_topic.map((get) => (topic_id = get.id));
    // console.log(get_id)
    const get_topic = await TopicLecure.find({
      id: { $in: get_id },
    });
    const stu_mark_topic = find_mark_topic.map((mark) => {
      const mark_topic = get_topic.find((topic) => topic.id === mark.topic_id);

      return {
        Nametopic: mark_topic ? mark_topic.TopicName : null,
        mark: mark.mark,
        createdAt: mark.createdAt,
        updatedAt: mark.updatedAt,
        exam_id: mark.exam_id,
      };
    });

    // get mark lecture

    const find_mark_lec = await mark_Lecture.find({
      student_id: student_id,
    });

    console.log("find_mark_lec :", find_mark_lec);

    const get_lecture_ids = find_mark_lec.map((get) => (id = get.Lecture_ID));
    const find_lecture = await Lecture.find({
      id: { $in: get_lecture_ids },
    });

    console.log("find_lecture :", find_lecture);

    const stu_mark_Lecture = find_mark_lec.map((markLec) => {
      const mark_Lecture = find_lecture.find(
        (lecture) => lecture.id === markLec.Lecture_ID
      );

      return {
        _id: markLec.id,
        mark: markLec.mark,
        name_lecture: mark_Lecture ? mark_Lecture.nameLecture : null,
      };
    });

    // get mark_year
    const find_mark_year = await Mark_Year.find({
      student_id: student_id,
    });

    const get_yearid = find_mark_year.map((get) => (id = get.id));
    const get_nameYear = await SchoolYear.find({
      id: { $in: get_yearid },
    });

    const stu_mark_year = find_mark_year.map((markYear) => {
      const mark_year = get_nameYear.find(
        (year) => year.id === markYear.SchoolYearsID
      );

      return {
        name_schoolyear: mark_year.nameSchoolYear,
        mark: markYear.mark,
        createAt: markYear.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      msg: "get list topic success !",
      stu_mark_topic: stu_mark_topic,
      stu_mark_Lecture: stu_mark_Lecture,
      stu_mark_year: stu_mark_year,
    });
  },

  // getAllCourse: async (req, res, next) => {
  //     await Course.find({ course_status: true }).sort({ createdAt: -1 }).limit(3).lean().then(async courses => {
  //         const history = await History.find().lean();
  //         return res.status(200).json({ success: true, courses, history })
  //     }).catch(err => {
  //         return res.status(404).json({ success: false, msg: "Có Lỗi Xảy Ra" })
  //     });
  // },

  // getLectureDetail: async (req, res, next) => {
  //     try {
  //         const slug = req.params.slug;
  //         // const course_slug = req.params.course_slug;
  //         // console.log(slug);
  //         // console.log(course_slug);
  //         const lecture = await Lecture.findOne({ lecture_slug: slug });

  //         if (!lecture) {
  //             return res.status(404).json({ success: false, message: 'Lecture not found' });
  //         }

  //         const exercises = await Exercise.find({ lecture_id: lecture.lecture_id });

  //         return res.status(200).json({ success: true, lecture, exercises });
  //     } catch (error) {
  //         // Handle any potential errors, log them, and provide an appropriate response.
  //         console.error(error);
  //         return res.status(500).json({ success: false, message: 'Internal Server Error' });
  //     }
  // },

  // getFaqs: async (req, res, next) => {
  //     await FAQs.find().lean().then(faqs => {
  //         return res.status(200).json({ success: true, faqs })
  //     })
  // },
  // changePassword: async (req, res, next) => {
  //     const { old_password, password } = req.body;
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     await Account.findOne({ email: token_decode.email }).then(account => {
  //         if (account.password != old_password) {
  //             return res.status(400).json({ success: false, msg: 'Mật Khẩu Cũ Không Trùng Khớp' });
  //         } else {
  //             account.password = password;
  //             account.save();
  //             return res.status(200).json({ success: true, msg: 'Thay Đổi Mật Khẩu Thành Công' })
  //         }
  //     })
  // },
  // registerCourse: async (req, res, next) => {
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     const { course_id } = req.body;
  //     await History.findOne({ course_id: course_id, email: token_decode.email }).then(async history => {
  //         console.log(history);
  //         if (!history) {
  //             const data = {
  //                 email: token_decode.email,
  //                 course_id: course_id
  //             }
  //             await History(data).save();
  //             return res.status(200).json({ success: true, msg: 'Đăng Ký Khoá Học Thành Công' })
  //         } else {
  //             return res.status(400).json({ success: false, msg: 'Bạn Đã Đăng Ký Khoá Học Này Rồi' })
  //         }
  //     }).catch(err => {
  //         console.log(err);
  //         return res.status(500).json({ msg: 'Có Lỗi Xảy Ra' })
  //     })

  // },
  // updateInformation: async (req, res, next) => {
  //     const { fullname, phone, dob, sex } = req.body;
  //     const file = req.file;
  //     const token = req.headers['authorization'];
  //     const token_decode = jwt_decode(token);
  //     try {
  //         let filePath = `src/public/uploads/avatar/${token_decode.email}`;
  //         if (!fs.existsSync(filePath)) {
  //             fs.mkdirSync(filePath, { recursive: true });
  //             fs.move(`src/public/uploads/avatar/${file.filename}`, `src/public/uploads/avatar/${token_decode.email}/${file.filename}`, function (err) {
  //                 if (err) return console.error(err)
  //             });
  //         }
  //         await Account.findOne({ email: token_decode.email }).then(async account => {
  //             if (!account) {
  //                 return res.status(400).json({ msg: 'Tài Khoản Không Tồn Tại' })
  //             } else {
  //                 account.fullname = fullname;
  //                 account.phone = phone;
  //                 account.dob = dob;
  //                 account.sex = sex;
  //                 account.avatar = file.filename;
  //                 await account.save();
  //                 return res.status(200).json({ msg: 'Cập Nhật Thông Tin Thành Công' })
  //             }
  //         })
  //     } catch (error) {
  //         return res.status(500).json({ success: false, msg: 'Server Error' });
  //     }
  // },
  // getHistoryCourse: async (req, res, next) => {
  //     const token = req.headers['authorization']
  //     const token_decode = jwt_decode(token);
  //     const history = await History.find({ email: token_decode.email }).lean();
  //     return res.status(200).json({ success: true, history })
  // },
  // MarkStudent: async (req, res, next) => {
  //     const token = req.headers["authorization"];
  //     const token_decode = jwt_decode(token);
  //     const email_student = token_decode.email
  //     const MarkStudent = req.body.mark;
  //     const course = req.params.param1;
  //     const lecture = req.params.param2;
  //     console.log("course :", course)
  //     console.log("lecture:", lecture)
  //     console.log(req.body);

  //     const createMark = await MarkModelST.create({
  //         course_name: course,
  //         lecture_name: lecture,
  //         student_email: email_student,
  //         mark: MarkStudent
  //     })

  //     res.status(200).json({ success: true, "mark of this course : ": createMark })
  // }
};
module.exports = StudentController;
