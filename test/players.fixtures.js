function makePlayersArray() {
    return [
        {
            id: 1,
            name: 'carl',
            level: 3,
            ac: 15, 
            pp: 14,
            dmid: 'party02'
        },
        {
            id: 2,
            name: 'jarl',
            level: 3,
            ac: 15, 
            pp: 14,
            dmid: 'party02'
        },
        {
            id: 3,
            name: 'marl',
            level: 3,
            ac: 15, 
            pp: 14,
            dmid: 'party02'
        },
        {
            id: 4,
            name: 'yarl',
            level: 3,
            ac: 15, 
            pp: 14,
            dmid: 'party02'
        }
    ]
}
function makeMaliciousPlayer(){
    const maliciousPlayer =
    {
        id: 911,
        name: 'Naughty naughty very naughty <script>alert("xss");</script>',
        level: 20,
        ac: 15, 
        pp: 2,
        dmid: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    const expectedPlayer = 
    {
        id: 911, 
        name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        level: 20,
        ac: 15, 
        pp: 2, 
        dmid: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
    }
    return{
        maliciousPlayer,
        expectedPlayer
    }
    
}
module.exports ={
    makePlayersArray,
    makeMaliciousPlayer
}