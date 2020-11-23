exports.questBlueBike = [{
    "id": "1",
    "no": "1",
    "question_no": "qa1001",
    "question": {
        "en": "Do you have a valid motorcycle license?",
        "th": "คุณมีใบขับขี่รถจักรยานยนต์หรือไม่？"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Yes",
                "th": "มี"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "No",
                "th": "ไม่มี"
            }
        }
    ],
    "type": "1",
    "forbid_option": null,
    "display": "block",
    "relation": [
        {
            "no": "1",
            "answer": "2",
            "nextno": "2"
        }
    ],
    "questionText": []
},
{
    "id": "2",
    "no": "2",
    "question_no": "qa1002",
    "question": {
        "en": "When can I get a valid motorcycle license?",
        "th": "คุณจะได้รับใบขับขี่รถจักรยานยนต์เมื่อใด？"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Can't get",
                "th": "ไม่สามารถรับใบขับขี่ได้"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "Within one week",
                "th": "ภายใน 1 สัปดาห์"
            }
        },
        {
            "val": 3,
            "option": {
                "en": "Within one month",
                "th": "ภายใน 1 เดือน"
            }
        },
        {
            "val": 4,
            "option": {
                "en": "not sure",
                "th": "ไม่แน่ใจ"
            }
        }
    ],
    "type": "1",
    "forbid_option": "1",
    "display": "none",
    "relation": [],
    "questionText": []
},
{
    "id": "3",
    "no": "3",
    "question_no": "qa1003",
    "question": {
        "en": "Is it a heavy motorcycle?",
        "th": "รถจักรยานยนต์ของคุณมีขนาดเท่าใด?"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Less than 150cc",
                "th": "ต่ำกว่า 150 cc"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "Greater than or equal to 150cc",
                "th": "มากกว่าหรือเท่ากับ 150 cc"
            }
        }
    ],
    "type": "1",
    "forbid_option": "2",
    "display": "block",
    "relation": [],
    "questionText": []
},
{
    "id": "4",
    "no": "4",
    "question_no": "qa1004",
    "question": {
        "en": "What is the age of your vehicle?",
        "th": "รถของคุณมีอายุการใช้งานกี่ปี?"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "1-3 years",
                "th": "1-3 ปี"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "4-6 years",
                "th": "4-6 ปี"
            }
        },
        {
            "val": 3,
            "option": {
                "en": "7-9 years",
                "th": "7-9 ปี"
            }
        },
        {
            "val": 4,
            "option": {
                "en": "10 years and above",
                "th": "10 ปี และ 10 ปีขึ้นไป"
            }
        }
    ],
    "type": "1",
    "forbid_option": "4",
    "display": "block",
    "relation": [],
    "questionText": []
},
{
    "id": "5",
    "no": "5",
    "question_no": "qa1005",
    "question": {
        "en": "Do you accept working six days a week ?",
        "th": "คุณสามารถทำงาน 6 วันต่อสัปดาห์ได้หรือไม่?"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Accept",
                "th": "ยอมรับ"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "Not accept",
                "th": "ไม่ยอมรับ"
            }
        }
    ],
    "type": "1",
    "forbid_option": "2",
    "display": "block",
    "relation": [],
    "questionText": []
},
{
    "id": "6",
    "no": "6",
    "question_no": "qa1006",
    "question": {
        "en": "Is there a tattoo that can't be covered by clothes?",
        "th": "คุณมีรอยสักที่ไม่สามารถปกปิดหรือไม่?"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Yes",
                "th": "มี"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "No",
                "th": "ไม่มี"
            }
        }
    ],
    "type": "1",
    "forbid_option": "1",
    "display": "block",
    "relation": [],
    "questionText": []
},
{
    "id": "7",
    "no": "7",
    "question_no": "qa1007",
    "question": {
        "en": "Is there a piercing hole?",
        "th": "คุณมีการเจาะหูหรือระเบิดหูหรือไม่?"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Yes",
                "th": "มี"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "No",
                "th": "ไม่มี"
            }
        }
    ],
    "type": "1",
    "forbid_option": "1",
    "display": "block",
    "relation": [],
    "questionText": []
},
{
    "id": "8",
    "no": "8",
    "question_no": "qa1008",
    "question": {
        "en": "Is there a criminal record?",
        "th": "คุณมีประวัติอาชญากรรมหรือไม่?"
    },
    "options": [
        {
            "val": 1,
            "option": {
                "en": "Yes",
                "th": "มี"
            }
        },
        {
            "val": 2,
            "option": {
                "en": "No",
                "th": "ไม่มี"
            }
        }
    ],
    "type": "1",
    "forbid_option": null,
    "display": "block",
    "relation": [
        {
            "no": "8",
            "answer": "1",
            "nextno": "9"
        }
    ],
    "questionText": []
},
{
    "id": "9",
    "no": "9",
    "question_no": "qa1009",
    "question": {
        "en": "Criminal content",
        "th": "ประวัติอาชญากรรม"
    },
    "options": [
        {
            "val": 2,
            "option": {
                "en": "Fight, Quarrel",
                "th": "ความผิดฐานทะเลาะวิวาท"
            }
        },
        {
            "val": 3,
            "option": {
                "en": "Drug Abuse",
                "th": "ความผิดฐานเสพยาเสพติด"
            }
        },
        {
            "val": 4,
            "option": {
                "en": "Drug Trafficking",
                "th": "ความผิดฐานจำหน่ายสารเสพติด"
            }
        },
        {
            "val": 5,
            "option": {
                "en": "Kill",
                "th": "ความผิดฐานฆ่าคนตาย"
            }
        },
        {
            "val": 6,
            "option": {
                "en": "Rape",
                "th": "ความผิดฐานข่มขืนกระทำชำเรา"
            }
        },
        {
            "val": 7,
            "option": {
                "en": "Obscene Children",
                "th": "ความผิดฐานพรากเด็กและพรากผู้เยา"
            }
        },
        {
            "val": 8,
            "option": {
                "en": "Stealing Money",
                "th": "ขโมย"
            }
        },
        {
            "val": 9,
            "option": {
                "en": "Illegal Labor",
                "th": "ความผิดด้านแรงงานกฎหมาย"
            }
        },
        {
            "val": 10,
            "option": {
                "en": "Gunrunning",
                "th": "ความผิดฐานมีอาวุธสงคราม"
            }
        },
        {
            "val": 1,
            "option": {
                "en": "Other",
                "th": "อื่นๆ"
            }
        }
    ],
    "type": "1",
    "forbid_option": null,
    "display": "none",
    "relation": [],
    "questionText": []
}]

// ----------------------------------Van Quest--------------------------------------------------- //

exports.questBlueVan = [
    {
        "id": "10",
        "no": "1",
        "question_no": "qa2001",
        "question": {
            "en": "Do you have a valid car driver's license?",
            "th": "คุณมีใบขับขี่รถยนต์หรือไม่?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Yes",
                    "th": "มี"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "No",
                    "th": "ไม่มี"
                }
            }
        ],
        "type": "2",
        "forbid_option": null,
        "display": "block",
        "relation": [
            {
                "no": "1",
                "answer": "2",
                "nextno": "2"
            }
        ],
        "questionText": []
    },
    {
        "id": "11",
        "no": "2",
        "question_no": "qa2002",
        "question": {
            "en": "When can I get a valid car license?",
            "th": "คุณจะได้รับใบขับขี่รถยนต์เมื่อใด?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Can't get",
                    "th": "ไม่สามารถรับใบขับขี่ได้"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "Within one week",
                    "th": "ภายใน 1 สัปดาห์"
                }
            },
            {
                "val": 3,
                "option": {
                    "en": "Within one month",
                    "th": "ภายใน 1 เดือน"
                }
            },
            {
                "val": 4,
                "option": {
                    "en": "Not sure",
                    "th": "ไม่แน่ใจ"
                }
            }
        ],
        "type": "2",
        "forbid_option": "1",
        "display": "none",
        "relation": [],
        "questionText": []
    },
    {
        "id": "12",
        "no": "3",
        "question_no": "qa2003",
        "question": {
            "en": "Truck model？",
            "th": "ประเภทของรถกระบะ?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "One row trucks",
                    "th": "รถกระบะ 2 ประตู"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "Double row trucks",
                    "th": "รถกระบะ 4 ประตู"
                }
            }
        ],
        "type": "2",
        "forbid_option": "2",
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "13",
        "no": "4",
        "question_no": "qa2004",
        "question": {
            "en": "Is there an opaque back cover?",
            "th": "รถของคุณมีการติดตู้แล้วหรือยัง?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Already installed",
                    "th": "ติดตั้ง"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "Not installed",
                    "th": "ไม่ได้ติดตั้ง"
                }
            }
        ],
        "type": "2",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "14",
        "no": "5",
        "question_no": "qa2005",
        "question": {
            "en": "Is it a diesel car?",
            "th": "รถของคุณเติมน้ำมันดีเซลหรือไม่?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Yes",
                    "th": "ใช่"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "No",
                    "th": "ไม่ใช่"
                }
            }
        ],
        "type": "2",
        "forbid_option": "2",
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "15",
        "no": "6",
        "question_no": "qa2006",
        "question": {
            "en": "Pickup truck age？",
            "th": "รถของคุณมีอายุการใช้งานกี่ปี?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "1-3 years",
                    "th": "1-3 ปี"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "4-6 years",
                    "th": "4-6 ปี"
                }
            },
            {
                "val": 3,
                "option": {
                    "en": "7-9 years",
                    "th": "7-9 ปี"
                }
            },
            {
                "val": 4,
                "option": {
                    "en": "10 years and above",
                    "th": "10 ปี และ 10 ปีขึ้นไป"
                }
            }
        ],
        "type": "2",
        "forbid_option": "4",
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "16",
        "no": "7",
        "question_no": "qa2007",
        "question": {
            "en": "Do you accept working six days a week ?",
            "th": "คุณสามารถทำงาน 6 วันต่อสัปดาห์ได้หรือไม่?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Accept",
                    "th": "ยอมรับ"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "Not accept",
                    "th": "ไม่ยอมรับ"
                }
            }
        ],
        "type": "2",
        "forbid_option": "2",
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "17",
        "no": "8",
        "question_no": "qa2008",
        "question": {
            "en": "Is there a tattoo that can't be covered by clothes?",
            "th": "คุณมีรอยสักที่ไม่สามารถปกปิดหรือไม่?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Yes",
                    "th": "มี"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "No",
                    "th": "ไม่มี"
                }
            }
        ],
        "type": "2",
        "forbid_option": "1",
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "18",
        "no": "9",
        "question_no": "qa2009",
        "question": {
            "en": "Is there a piercing hole?",
            "th": "คุณมีการเจาะหูหรือระเบิดหูหรือไม่?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Yes",
                    "th": "มี"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "No",
                    "th": "ไม่มี"
                }
            }
        ],
        "type": "2",
        "forbid_option": "1",
        "display": "block",
        "relation": [],
        "questionText": []
    },
    {
        "id": "28",
        "no": "10",
        "question_no": "qa2010",
        "question": {
            "en": "Is there a criminal record?",
            "th": "คุณมีประวัติอาชญากรรมหรือไม่?"
        },
        "options": [
            {
                "val": 1,
                "option": {
                    "en": "Yes",
                    "th": "มี"
                }
            },
            {
                "val": 2,
                "option": {
                    "en": "No",
                    "th": "ไม่มี"
                }
            }
        ],
        "type": "2",
        "forbid_option": null,
        "display": "block",
        "relation": [
            {
                "no": "10",
                "answer": "1",
                "nextno": "11"
            }
        ],
        "questionText": []
    },
    {
        "id": "29",
        "no": "11",
        "question_no": "qa2011",
        "question": {
            "en": "Is there a criminal record?",
            "th": "ประวัติอาชญากรรม"
        },
        "options": [
            {
                "val": 2,
                "option": {
                    "en": "Fight, Quarrel",
                    "th": "ความผิดฐานทะเลาะวิวาท"
                }
            },
            {
                "val": 3,
                "option": {
                    "en": "Drug Abuse",
                    "th": "ความผิดฐานเสพยาเสพติด"
                }
            },
            {
                "val": 4,
                "option": {
                    "en": "Drug Trafficking",
                    "th": "ความผิดฐานจำหน่ายสารเสพติด"
                }
            },
            {
                "val": 5,
                "option": {
                    "en": "Kill",
                    "th": "ความผิดฐานฆ่าคนตาย"
                }
            },
            {
                "val": 6,
                "option": {
                    "en": "Rape",
                    "th": "ความผิดฐานข่มขืนกระทำชำเรา"
                }
            },
            {
                "val": 7,
                "option": {
                    "en": "Obscene Children",
                    "th": "ความผิดฐานพรากเด็กและพรากผู้เยา"
                }
            },
            {
                "val": 8,
                "option": {
                    "en": "Stealing Money",
                    "th": "ขโมย"
                }
            },
            {
                "val": 9,
                "option": {
                    "en": "Illegal Labor",
                    "th": "ความผิดด้านแรงงานกฎหมาย"
                }
            },
            {
                "val": 10,
                "option": {
                    "en": "Gunrunning",
                    "th": "ความผิดฐานมีอาวุธสงคราม"
                }
            },
            {
                "val": 1,
                "option": {
                    "en": "Other",
                    "th": "อื่นๆ"
                }
            }
        ],
        "type": "2",
        "forbid_option": null,
        "display": "none",
        "relation": [],
        "questionText": []
    }
]

// ----------------------------------Genecral Quest--------------------------------------------- //

exports.questGeneral = [
    {
        "id": "19",
        "no": "1",
        "question_no": "qa3001",
        "question": {
          "en": "Health ?",
          "th": "สุขภาพ ?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Excellent",
              "th": "ดีมาก"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "Good",
              "th": "ดี"
            }
          },
          {
            "val": 3,
            "option": {
              "en": "Fair",
              "th": "พอใช้"
            }
          },
          {
            "val": 4,
            "option": {
              "en": "Bad",
              "th": "ไม่ดี"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "1",
            "answer": "4",
            "display": "1"
          }
        ]
      },
      {
        "id": "20",
        "no": "2",
        "question_no": "qa3002",
        "question": {
          "en": "Do you smoke?",
          "th": "สูบบุหรี่หรือไม่ ?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "ใช่"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่ใช่"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": []
      },
      {
        "id": "21",
        "no": "3",
        "question_no": "qa3003",
        "question": {
          "en": "Do you have any serious liness, Injury or Operation?",
          "th": "เคยป่วยหนัก หรือบาดเจ็บ หรือผ่าตัดใหญ่หรือไม่ ?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "เคย"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่เคย"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "3",
            "answer": "1",
            "display": "1"
          }
        ]
      },
      {
        "id": "22",
        "no": "4",
        "question_no": "qa3004",
        "question": {
          "en": "Do you have any 'physical handicap' on feet, hands, sight, hearing, or speech?",
          "th": "มีความบกพร่องทางร่ายกาย หรือไม่?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "มี"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่มี"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "deformed": {
          "id": "",
          "type": null,
        },
        "questionText": [
          {
            "no": "4",
            "answer": "1",
            "display": "1"
          }
        ]
      },
      {
        "id": "24",
        "no": "6",
        "question_no": "qa3006",
        "question": {
          "en": "Have you been a member of laber Union?",
          "th": "เป็นสมาชิกสหภาพแรงงานหรือไม่?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "เป็น"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่เป็น"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": []
      },
      {
        "id": "25",
        "no": "7",
        "question_no": "qa3007",
        "question": {
          "en": "Have you been convicted in cort of law in the country or oversea?",
          "th": "มีคดีเกี่ยวกับศาล ใน/นอกประเทศ หรือคดีต้องโทษหรือไม่?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "มี"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่มี"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "7",
            "answer": "1",
            "display": "1"
          }
        ]
      },
      {
        "id": "26",
        "no": "8",
        "question_no": "qa3008",
        "question": {
          "en": "Have you been dismissed or suspended from any employment?",
          "th": "ท่านเคยถูกให้พ้นสภาพพนักงานหรือถูกให้หยุดงานหรือไม่ ?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "เคย"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่เคย"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "8",
            "answer": "1",
            "display": "1"
          }
        ]
      },
      {
        "id": "27",
        "no": "9",
        "question_no": "qa3009",
        "question": {
          "en": "Are you bankrupt or in dept?",
          "th": "ท่านเป็นบุคคลล้มละลายหรือไม่ ?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "ใช่"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่ใช่"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "9",
            "answer": "1",
            "display": "1"
          }
        ]
      },
      {
        "id": "34",
        "no": "10",
        "question_no": "qa3010",
        "question": {
          "en": "Do you have feature militatry service?",
          "th": "เคยผ่านการรับราชการทหารหรือไม่ ?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "เคย"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่เคย"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [
          {
            "no": "10",
            "answer": "2",
            "nextno": "11"
          }
        ],
        "questionText": []
      },
      {
        "id": "35",
        "no": "11",
        "question_no": "qa3011",
        "question": {
          "en": "Do you have feature militatry obiligation?",
          "th": "มีกำหนดที่จะเข้ารับการฝึกทหารหรือไม่?"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "มี"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่มี"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "none",
        "relation": [],
        "questionText": [
          {
            "no": "11",
            "answer": "1",
            "display": "1",
            "field": "3"
          }
        ]
      },
      {
        "id": "36",
        "no": "12",
        "question_no": "qa3012",
        "question": {
          "en": "Do you have friends or relative in our company？",
          "th": "มีเพื่อนหรือญาติ ที่อยู่กลุ่มบริษัทนี้หรือไม่？"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "มี"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่มี"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "12",
            "answer": "1",
            "display": "1",
            "field": "2"
          }
        ]
      },
      {
        "id": "37",
        "no": "13",
        "question_no": "qa3013",
        "question": {
          "en": "Is there a recommender working in this company？",
          "th": "มีบุคคลในบริษัทที่แนะนำมาสมัครงานหรือไม่？"
        },
        "options": [
          {
            "val": 1,
            "option": {
              "en": "Yes",
              "th": "มี"
            }
          },
          {
            "val": 2,
            "option": {
              "en": "No",
              "th": "ไม่มี"
            }
          }
        ],
        "type": "3",
        "forbid_option": null,
        "display": "block",
        "relation": [],
        "questionText": [
          {
            "no": "13",
            "answer": "1",
            "display": "1",
            "field": "2"
          }
        ]
      }
]