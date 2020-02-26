var callIndex = 0;
var objectsLoaded = false;
var staticPath = '/static/models/';
var objects = ['magnet', 'besen', 'box', 'metall_piece', 'plastic_bag', 'bottle'];

$(document).ready(function() {
  var site = site || {};
  site.window = $(window);
  site.document = $(document);
  site.Width = $('.particlehead').width();
  site.Height = $('.particlehead').height();

  var Background = function() {};

  Background.headparticle = function() {
    if (!Modernizr.webgl) {
      alert('Your browser doesnt support WebGL');
    }

    var camera, scene, renderer;

    var p = [];

    var windowHalfX = site.Width / 2;
    var windowHalfY = site.Height / 2;

    Background.camera = new THREE.PerspectiveCamera(35, site.Width / site.Height, 1, 2000);
    Background.camera.position.z = 350;

    // scene
    Background.scene = new Array(); //of THREE.Scene() objects
    for (var i = 0; i < objects.length; i++) {
      Background.scene.push(new THREE.Scene());
    }
    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
      //console.log('webgl, twice??');
      //console.log( item, loaded, total );
    };

    var p_geom = [];
    var p_material = new THREE.ParticleBasicMaterial({
      color: 0xffffff,
      size: 1.5
    });

    // model
    var loader = new THREE.OBJLoader(manager);
    function loadObjects() {
      if (callIndex > objects.length - 1) {
        callIndex = 0;
        objectsLoaded = true;
        return;
      }
      loader.load(staticPath + objects[callIndex] + '.obj', function(object) {
        object.traverse(function(child) {
          if (child instanceof THREE.Mesh) {
            // child.material.map = texture;
            p_geom[callIndex] = new THREE.Geometry();
            var scale = 24;

            $(child.geometry.vertices).each(function() {
              p_geom[callIndex].vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale));
            });
            p[callIndex] = new THREE.ParticleSystem(p_geom[callIndex], p_material);
          }
        });
        Background.scene[callIndex].add(p[callIndex]);

        callIndex++;
        loadObjects();
      });
    }
    loadObjects();

    Background.renderer = new THREE.WebGLRenderer({ alpha: true });
    Background.renderer.setSize(site.Width, site.Height);
    Background.renderer.setClearColor(0x000000, 0);

    $('.particlehead').append(Background.renderer.domElement);
    $(window).on('resize', onWindowResize);
    $(window).on('click', onWindowClick);

    function onWindowResize() {
      windowHalfX = site.Width / 2;
      windowHalfY = site.Height / 2;
      //console.log(windowHalfX);

      Background.camera.aspect = site.Width / site.Height;
      Background.camera.updateProjectionMatrix();

      Background.renderer.setSize(site.Width, site.Height);
    }

    function onWindowClick() {
      if (callIndex < objects.length - 1) {
        callIndex++;
      } else {
        callIndex = 0;
      }
    }

    Background.animate = function() {
      if (typeof p[callIndex] !== 'undefined') {
        p[callIndex].rotation.y = Date.now() * 0.0005;
        p[callIndex].rotation.x = Date.now() * 0.0001;
      }
      Background.ticker = TweenMax.ticker;
      Background.ticker.addEventListener('tick', Background.animate);
      render();
    };

    function render() {
      if (typeof Background.scene[callIndex] !== 'undefined') {
        Background.camera.lookAt(Background.scene[callIndex].position);
        Background.renderer.render(Background.scene[callIndex], Background.camera);
      }
    }

    render();

    Background.animate();
  };

  Background.headparticle();
});
