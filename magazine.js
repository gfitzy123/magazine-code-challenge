
Articles = new Mongo.Collection('articles');


if (Meteor.isClient) {

    Meteor.subscribe('article', function(){
      var article = Articles.find().fetch();
      var array = Articles.find().fetch();
      console.log('article', article);
      var arrayOfArticles = [];
      var images = [];
      var tags = [];
        for (var i = 0; i < array.length; i++) {
 
          arrayOfArticles.push(array[i].data.article);
          // console.log('article', array[i].data.article);
          // console.log('body', array[i].data.article.body_html);
          // console.log('displayDate', array[i].data.article.display_date);
          // console.log('publicationname', array[i].data.article.publication.name);

          tags.push(array[i].data.article.tags);
          // console.log('tags', array[i].data.article.tags);
          // console.log('images', array[i].data.article.images);
          images.push(array[i].data.article.images);
        }

        var coverImages;
        var remainingImages = [];

        for (var j = 0; j < images[0].length; j++) {
            if (images[0][j].type === 'cover') {
              Session.set('coverImage', images[0][j].url);
              continue;
            }

            console.log('remaining', images[0][j].url);

            remainingImages.push({image: images[0][j].url});
           
        }

        console.log('remaininingImages', remainingImages);
        console.log('coverimage', Session.get('coverImage'));

        Session.set('images', remainingImages);
        Session.set('tags', tags);
        Session.set('arrayOfObjects', arrayOfArticles);
    });

    Template.body.helpers({
      articles: function(){
        return Session.get('arrayOfObjects');
      },
      coverImage: function(){
        return Session.get('coverImage');
      },
      
      images: function(){
         return Session.get('images');
      },

      tags: function(){
        return Session.get('tags');
      }
    });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    called = false;
    var url = 'https://tmc-api-v4.herokuapp.com/v4/article/ef892c7d-a5f1-4aa8-93b2-c25096530aa1';
    HTTP.get(url, function(error, response){
        if (error) {
          console.log('error received', error);
        }

        console.log(response);
        Articles.insert(response);
        Meteor.publish('article', function(){
          return Articles.find({});
        });
    });
  });
}
