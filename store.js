const fs = require('fs');

class Store {

    removeNote(id) {
        // Get all notes, remove the note with the given id, write the filtered notes
        return this.getNotes()
          .then((notes) => notes.filter((note) => note.id !== id))
          .then((filteredNotes) => this.write(filteredNotes));
      }

      getNotes(req, res) {
        fs.readFile("db.json", function (err, data) {
          if (err) throw err;
          let allNotes = JSON.parse(data);
          return res.json(allNotes);
        });
      }

}

module.exports = new Store();