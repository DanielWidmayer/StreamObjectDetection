var callIndex = 0;
var staticPath = "/static/models/";
var objects = ["besen", "bottle", "box", "metall_piece", "plastic_bag"];
var object1 = new THREE.Object3D();
var object2 = new THREE.Object3D();

$(document).ready(function() {
  var face;

  var site = site || {};
  site.window = $(window);
  site.document = $(document);
  site.Width = $(".particlehead").width();
  site.Height = $(".particlehead").height();

  var Background = function() {};

  Background.headparticle = function() {
    if (!Modernizr.webgl) {
      alert("Your browser doesnt support WebGL");
    }

    // var camera, scene, renderer;

    //var p;

    var windowHalfX = site.Width / 2;
    var windowHalfY = site.Height / 2;

    Background.camera = new THREE.PerspectiveCamera(
      35,
      site.Width / site.Height,
      1,
      2000
    );
    Background.camera.position.z = 350;

    // scene
    // Background.scene = new THREE.Scene();
    Background.scene0 = new THREE.Scene();
    Background.scene1 = new THREE.Scene();
    Background.scene2 = new THREE.Scene();
    Background.scene3 = new THREE.Scene();
    Background.scene4 = new THREE.Scene();

    // texture
    var manager = new THREE.LoadingManager();
    manager.onProgress = function(item, loaded, total) {
      //console.log('webgl, twice??');
      //console.log( item, loaded, total );
    };

    // particles
    // for (var i = 0; i < objects.length; i++) {
    //   p_geom[i] = {};
    //   p_geom[i] = new THREE.Geometry();
    // }
    var p_geom = new THREE.Geometry();
    var p_material = new THREE.ParticleBasicMaterial({
      color: 0xffffff,
      size: 1.5
    });

    // model
    // var p = [];
    // var p_geom_init= new THREE.Geometry();
    var p = new THREE.ParticleSystem(p_geom, p_material);
    var p0 = new THREE.ParticleSystem(p_geom, p_material);
    var p1 = new THREE.ParticleSystem(p_geom, p_material);
    var p2 = new THREE.ParticleSystem(p_geom, p_material);
    var p3 = new THREE.ParticleSystem(p_geom, p_material);
    var p4 = new THREE.ParticleSystem(p_geom, p_material);
    // var p_array = [];
    var loader = new THREE.OBJLoader(manager);
    function loadObjects() {
      if (callIndex > objects.length - 1) return;
      loader.load(
        staticPath + objects[callIndex] + ".obj",
        function(object) {
          p_geom = new THREE.Geometry();
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              // child.material.map = texture;

              var scale = 24;

              $(child.geometry.vertices).each(function() {
                p_geom.vertices.push(
                  new THREE.Vector3(
                    this.x * scale,
                    this.y * scale,
                    this.z * scale
                  )
                );
              });
            }
          });

          var tmp_p = new THREE.ParticleSystem(p_geom, p_material);
          // p.push(tmp_p);
          switch (callIndex) {
            case 0:
              Background.scene0.add(tmp_p);
              p0 = tmp_p;
              break;
            case 1:
              Background.scene1.add(tmp_p);
              p1 = tmp_p;
              break;
            case 2:
              Background.scene2.add(tmp_p);
              p2 = tmp_p;
              break;
            case 3:
              Background.scene3.add(tmp_p);
              p3 = tmp_p;
              break;
            case 4:
              Background.scene4.add(tmp_p);
              p4 = tmp_p;
              break;
          }
          // Background.scene.add(tmp_p);

          callIndex++;
          loadObjects();
        },
        function(xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        }
      );
    }
    loadObjects();
    // choosing default scene
    Background.scene = Background.scene4;
    // console.log(p0);
    if (typeof p4 !== "undefined") {
      p = p4;
    }
    // var loadAiObject = function(jrs) {
    //   Background.scene.add(p[jrs]);
    // }

    // loadAiObject(0);

    // Background.scene.add(p[0]);
    // var p = new THREE.ParticleSystem(p_geom, p_material);

    Background.renderer = new THREE.WebGLRenderer({ alpha: true });
    Background.renderer.setSize(site.Width, site.Height);
    Background.renderer.setClearColor(0x000000, 0);

    $(".particlehead").append(Background.renderer.domElement);
    $(window).on("resize", onWindowResize);

    function onWindowResize() {
      windowHalfX = site.Width / 2;
      windowHalfY = site.Height / 2;
      //console.log(windowHalfX);

      Background.camera.aspect = site.Width / site.Height;
      Background.camera.updateProjectionMatrix();

      Background.renderer.setSize(site.Width, site.Height);
    }

    Background.animate = function() {
      // console.log(p.rotation);
      p.rotation.y = Date.now() * 0.001;
      p.rotation.x = Date.now() * 0.0005;
      Background.ticker = TweenMax.ticker;
      Background.ticker.addEventListener("tick", Background.animate);
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
