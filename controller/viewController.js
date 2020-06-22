exports.getLanding = async(req,res) => {
    res.status(200).render('index',{
        title : 'PAPIKOST',
     
    })
}