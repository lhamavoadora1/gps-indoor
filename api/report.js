const express = require('express');
var pdf = require('html-pdf');
var ejs = require('ejs');

var router = express.Router();
router.get('/', getReport);
module.exports = router;

var d = new Date(Date.now());
var datetime = d.toLocaleString();
var totalVisits = 290;
var mostVisitedSection = "Vegetais";
var lessVisitedSection = "Higiene";
var mostVisitedAmount = 230;
var lessVisitedAmount = 22;

async function getReport(req, res) {
    try {
        ejs.renderFile("./template/reportTemplate.ejs", { datetime: datetime,
                                                          totalVisits: totalVisits,
                                                          mostVisitedSection: mostVisitedSection,
                                                          lessVisitedSection: lessVisitedSection,
                                                          mostVisitedAmount: mostVisitedAmount,
                                                          lessVisitedAmount: lessVisitedAmount}, (err, html) => {
            if (err) {
                res.status(500).send();
            }
            else {
                pdf.create(html, { format: 'Letter' }).toStream(function (err, stream) {
                    if (err) {
                        res.json({
                            message: 'Sorry, we were unable to generate pdf',
                        });
                        res.status(500).send();
                    }
                    stream.pipe(res);
                });

            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send(new utils.Error(err));
    }
}