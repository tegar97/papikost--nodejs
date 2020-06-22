exports.getLanding = async(req,res) => {
    res.status(200).render('index',{
        title : 'TEMPAT PENCARIAN KOST',
     
    })
}

exports.getArea = async(req,res) => {
    res.status(200).render('area',{
        title : 'AREA TERSEDIA',
     
    })
}

exports.getAreaDetail = async(req,res) => {
    res.status(200).render('areaDetail',{
        title : 'DETAIL AREA',
     
    })
}

exports.getkostDetail = async(req,res) => {
    res.status(200).render('kostDetail',{
        title : 'KOST PAK UDIN',
     
    })
}

exports.getLogin = async(req,res) => {
    res.status(200).render('login',{
        title : 'SIGNIN',
     
    })
}