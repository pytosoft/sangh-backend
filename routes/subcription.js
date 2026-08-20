
const express = require('express');
const router = express.Router();
let Subscription = require('../entity/subcription').Subscription;
const Subscriber = require('../entity/subscribers').Subscriber;
const Response = require('../config/response')
const isAuth = require('../middleware/is-auth')
const User = require('../entity/user').User;
const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
const handlebars = require("handlebars");
const PDFDocument = require('pdfkit');


// Rest of your code

/**
 * Subscribers
 * @purpose: This Rest API  used to  get Subscriber list
 * @method: GET
 */
router.get("/list", isAuth, (req, res, next) => {
    let query = {}
    if (req.query.adminId)
        query.givenBy = req.query.adminId
    if (req.query.active)
        query.active = req.query.active
    Subscription.find(query, (err, suceess) => {
        if (err) {
            console.log('error ', err);
            res.sendStatus(500);
        } else if (suceess) {
            response = Response.createResponse(Response.RequestStatus.Success, "subcription list", suceess);
            res.status(200).json(response);
        } else {
            response = Response.createResponse(Response.RequestStatus.Success, "No subcription found.", []);
            res.status(200).json(response);
        }
    })
})

/**
 * subscriber
 * @purpose: This Rest API  used to  get subscriber list
 * @method: POST
 */
router.post("/", isAuth, (req, res, next) => {
    let subscriberId = req.body.subscriberId;
    let plans = req.body.plans;
    if (subscriberId && plans.length > 0 && req.body.createdBy) {
        Subscriber.countDocuments({ _id: subscriberId }, function (err, count) {
            if (err) {
                res.sendStatus(500);
            } else if (count == 0) {
                let response = Response.createResponse(Response.RequestStatus.Fail, 'User is not registered. Please register user first.');
                res.json(200, response);
            } else {
                Subscription.collection.insert(plans, function (err, docs) {
                    if (err) {
                        return console.error(err);
                    } else {
                        let update = {}
                        update.active = true;
                        User.findById(req.body.createdBy, (error, c) => {
                            if (error) {
                                res.sendStatus(500).json(error);
                            } else {
                                Subscriber.findByIdAndUpdate(subscriberId, update, (err, result) => {
                                    if (err) {
                                        res.sendStatus(500).json(err);
                                    } else {
                                        if (req.body.createdBy) {
                                            let reqData = {}
                                            if (c.isSuperAdmin) {
                                                c.depositAmount = c.depositAmount ? c.depositAmount : 0;
                                                reqData = {
                                                    depositAmount: c.depositAmount + req.body.totalAmount
                                                }
                                            } else {
                                                reqData = {
                                                    pendingAmount: c.pendingAmount + req.body.totalAmount
                                                }
                                            }
                                            User.findByIdAndUpdate(req.body.createdBy, reqData, function (err, result) {
                                                if (err) {
                                                    res.sendStatus(500);
                                                } else {
                                                    response = Response.createResponse(Response.RequestStatus.Success, "Subcription Activated.");
                                                    res.status(200).json(response);
                                                }
                                            });
                                        }

                                    }
                                })
                            }
                        })
                    }
                });


            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.post('/expiring', async (req, res) => {
  try {
    const { endDate } = req.body;
console.log(endDate);
    if (!endDate) {
      return res.status(400).json({ message: 'Expiration date is required' });
    }

    const expirationDate = new Date(endDate);
    let searchQuery = { endDate: { $lte: expirationDate }}
    if(req.body.city){
    searchQuery.city = req.body.city
     }
    if(req.body.state){
    searchQuery.state= req.body.state
     }
console.log(searchQuery);
    const plans = await Subscription.find(searchQuery).populate('subscriberId');
    res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * deactivateSubcription
 * @purpose: This Rest API  used to  get users list
 * @method: POST
 */
router.post("/deactive", isAuth, (req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date().getTime();
        req.body.active = false;
        Subscription.findByIdAndUpdate(req.body._id, req.body, (err, results) => {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                let message = "Subcription Deactivated Successfully";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * activateSubcription
 * @purpose: This Rest API is used to activate a subscription again
 * @method: POST
 */
router.post("/active", isAuth, (req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date().getTime();
        req.body.active = true;
        Subscription.findByIdAndUpdate(req.body._id, req.body, (err, results) => {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                if (results && results.subscriberId) {
                    Subscriber.findByIdAndUpdate(results.subscriberId, { active: true }, function () {
                        let message = "Subcription Activated Successfully";
                        let response = Response.createResponse(Response.RequestStatus.Success, message);
                        res.status(200).json(response);
                    });
                } else {
                    let message = "Subcription Activated Successfully";
                    let response = Response.createResponse(Response.RequestStatus.Success, message);
                    res.status(200).json(response);
                }
            }
        });
    } else {
        res.sendStatus(400);
    }
})
router.post("/update", isAuth, (req, res, next) => {
    if (req.body._id) {
        req.body.updateDate = new Date();
        console.log(req.body)
        let update = {};
        update = req.body;
        //update.price = Number(update.price);
        Subscription.findByIdAndUpdate(req.body._id, { $set: req.body }, (err, results) => {
            if (err) {
                let response = Response.createResponse(0, err.message);
                res.status(500).json(response);
            } else {
                let message = "Subcription updated Successfully";
                let response = Response.createResponse(Response.RequestStatus.Success, message);
                res.status(200).json(response);
            }
        });
    } else {
        res.sendStatus(400);
    }
})
/**
 * Subscribers
 * @purpose: This Rest API  used to  get Subscriber list
 * @method: GET
 */
router.post("/list/address", isAuth, async function (req, res, next) {


    // const listOfSubs = await Subscription.find({});
    // listOfSubs.forEach(async function (res){
    //         const subsInfo = await Subscriber.findById(res.subscriberId);
    //         let update = {};
    //         update['displayId'] =  subsInfo.subscriberId;
    //         const updated = await Subscription.findByIdAndUpdate(res._id, update);
    //         console.log(updated);
    // })

    let query = {}
    if (req.body.admin) {
        query.createdBy = req.body.admin
    }
    if (req.body.state){
        query.state =  { $in: req.body.state.split(',') }
    }
    if (req.body.city)
        query.city = { $in: req.body.city.split(',') }
    if (req.body.bookId)
        query.bookId = req.body.bookId
    if (req.body.startDate && req.body.endDate) {
           let  startDate = new Date(new Date(req.body.startDate).setHours(00, 00, 00))
        startDate.setDate(startDate.getDate() + 1);  
        startDate = startDate.toISOString();   
        let  endDate = new Date(new Date(req.body.endDate).setHours(23, 59, 59))
        endDate.setDate(endDate.getDate() + 1);  
        endDate = endDate.toISOString();   
        query.updateDate = {
            $gte: startDate,
            $lt: endDate
        }
    }
    query.active = true
    console.log(query)
    var suceess = await Subscription.find(query).sort({
        city: 1
    });
    console.log(suceess.length)
        let temp = [];
        suceess.forEach(res => {
		console.log(res.deliveryAddress.fatherName)
            if (res.deliveryAddress.fatherName && res.deliveryAddress.fatherName) {
                res.deliveryAddress.name = res.deliveryAddress.name + ' S/O ' + res.deliveryAddress.fatherName;
            }
            if (res.deliveryAddress.address.includes("#")) {
                res.deliveryAddress.address = res.deliveryAddress.address;
            }
            res.deliveryAddress.address = res.deliveryAddress.address;
            res.deliveryAddress.displayId = res.name.slice(0,2)+' '+res.displayId;
            temp.push(res.deliveryAddress)
        })
        const pdfData = {
            name: "address",
            date: new Date(),
            collection: temp
        }
        console.log(temp)
        const pdfPath = await createPDF(pdfData);
        console.log('write  file done' + pdfPath)
        var file = fs.createReadStream(pdfPath);
        var stat = fs.statSync(pdfPath);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
        file.pipe(res);
})
const itemsPerRow = 6; // Number of data items to display in a row
const rowsPerPage = 9; // Number of rows to display per page

const generatePDF = async (data) => {
  const doc = new PDFDocument({margin:10});

  doc.font('assets/hindi-regular.ttf');

  const stream = fs.createWriteStream('pdf/output.pdf');

  doc.pipe(stream);

  // Set up font and other styling
  doc.fontSize(5);

  let currentPage;

  for (let rowIndex = 0; rowIndex < data.length; rowIndex += itemsPerRow) {
    if ((rowIndex / itemsPerRow) % rowsPerPage === 0 && rowIndex !== 0) {
      // Start a new page for every 'rowsPerPage' rows
      await doc.addPage();
      currentPage++;
    }

    for (let colIndex = 0; colIndex < itemsPerRow; colIndex++) {
      const dataIndex = rowIndex + colIndex;
      if (dataIndex >= data.length) {
        // No more data to display
        break;
      }

      const x = 20 + colIndex * 95; // Adjust the horizontal spacing between columns
      const y = 20 + ((rowIndex / itemsPerRow) % rowsPerPage) * 85; // Adjust the vertical spacing between rows

      // Add a border around the address elements with a dotted line
      await doc.rect(x, y, 90, 80 ).stroke();

      // Add content inside the bordered area
      const item = data[dataIndex];
      await doc.text(`${item.displayId}`, x + 3, y + 5, {width:88});
      await doc.text(`${item.name}`, x + 3, y + 15, {width:88});
      await doc.text(`${item.address}`, x + 3, y + 30, {width:88});
      await doc.text(`${item.city+' '+item.state+'-'+ item.pinCode}`, x + 3, y + 60, {width:88});
      await doc.text(`${item.mobile}`, x + 3, y + 70, {width:88});

    }
  }

  doc.end();
  console.log('PDF generated successfully!');
  
  return 'pdf/output.pdf';  
}
router.get("/download/pdf", isAuth, (req, res, next) => {
    const __dirname = 'pdf';
    const pdfPath = path.join(__dirname, '/output.pdf'); // Replace with the actual path to your PDF file
    console.log(pdfPath)
    fs.exists(pdfPath, (exists) => {
        if (!exists) {
          res.status(404).json({ error: 'PDF file not found' });
          return;
        }
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=downloaded_file.pdf');
    
        const stream = fs.createReadStream(pdfPath);
        stream.pipe(res);
      });
})

async function createPDF(data) {
    console.log('started file' + data.collection.length)
    var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
    var template = handlebars.compile(templateHtml);
    var html = template(data);
    console.log(html);
    console.log('read html')

    var milis = new Date();
    milis = milis.getTime();
    console.log('time')

    var pdfPath = path.join('pdf', `${data.name}-${milis}.pdf`);
    console.log('pdf path' + pdfPath)

    var options = {
        width: '1230px',
        headerTemplate: "<p></p>",
        footerTemplate: "<p></p>",
        displayHeaderFooter: true,
        margin: {
            top: "10px",
            bottom: "30px"
        },
        printBackground: true,
        path: pdfPath
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
    });
    console.log("file writing stared")
    var page = await browser.newPage();
    console.log("created page" + page)
    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
        waitUntil: 'networkidle0'
    });

    await page.pdf(options);
    await browser.close();
    console.log("File Created Suceesfully")
    return pdfPath;
}
module.exports = router;
