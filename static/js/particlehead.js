var callIndex = 0;
var staticPath = '/static/models/';
var objects = ['old_stoll', 'eye'];
var object1 = new THREE.Object3D();
var object2 = new THREE.Object3D();

$(document).ready(function() {
  var face;

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

    //var p;

    var windowHalfX = site.Width / 2;
    var windowHalfY = site.Height / 2;

    Background.camera = new THREE.PerspectiveCamera(35, site.Width / site.Height, 1, 2000);
    Background.camera.position.z = 350;

    // scene
    Background.scene = new THREE.Scene();

    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
      //console.log('webgl, twice??');
      //console.log( item, loaded, total );
    };

    // particles
    var p_geom = new THREE.Geometry();
    var p_material = new THREE.ParticleBasicMaterial({
      color: 0xffffff,
      size: 1.5
    });

    // model
    var loader = new THREE.OBJLoader(manager);
    function loadObjects() {
      if (callIndex > objects.length - 1) return;
      loader.load(
        staticPath + objects[callIndex] + '.obj',
        function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              // child.material.map = texture;

              var scale = 24;

              $(child.geometry.vertices).each(function() {
                p_geom.vertices.push(new THREE.Vector3(this.x * scale, this.y * scale, this.z * scale));
              });
            }
          });

          Background.scene.add(p);

          callIndex++;
          loadObjects();
        },
        function(xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        }
      );
    }
    loadObjects();
    var p = new THREE.ParticleSystem(p_geom, p_material);

    Background.renderer = new THREE.WebGLRenderer({ alpha: true });
    Background.renderer.setSize(site.Width, site.Height);
    Background.renderer.setClearColor(0x000000, 0);

    $('.particlehead').append(Background.renderer.domElement);
    $(window).on('resize', onWindowResize);

    function onWindowResize() {
      windowHalfX = site.Width / 2;
      windowHalfY = site.Height / 2;
      //console.log(windowHalfX);

      Background.camera.aspect = site.Width / site.Height;
      Background.camera.updateProjectionMatrix();

      Background.renderer.setSize(site.Width, site.Height);
    }

    Background.animate = function() {
      p.rotation.y = Date.now() * 0.0005;
      p.rotation.x = Date.now() * 0.0003;
      Background.ticker = TweenMax.ticker;
      Background.ticker.addEventListener('tick', Background.animate);
      render();
    };

    function render() {
      Background.camera.lookAt(Background.scene.position);
      Background.renderer.render(Background.scene, Background.camera);
    }

    render();

    Background.animate();
  };

  Background.headparticle();
});
